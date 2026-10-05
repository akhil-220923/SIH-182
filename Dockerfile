# Multi-stage Dockerfile: Builds frontend assets and starts production FastAPI backend
# Enables single-container full-stack deployment on any cloud host (Render, Railway, Fly.io, Cloud Run, AWS, VPS)

# Stage 1: Build Frontend Assets
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Production Python Runtime
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy and install python dependencies
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy backend code
COPY backend/ /app/backend/

# Copy compiled frontend SPA for single-container standalone support
COPY --from=frontend-builder /app/dist /app/frontend/dist

# Set runtime environment variables
ENV PYTHONPATH=/app
ENV FRONTEND_DIST_DIR=/app/frontend/dist
ENV REPORT_DIR=/app/reports
ENV HOST=0.0.0.0
ENV PORT=8000
EXPOSE 8000

RUN mkdir -p /app/reports

# Health check
HEALTHCHECK --interval=10s --timeout=5s --start-period=15s --retries=3 \
    CMD curl -f http://127.0.0.1:${PORT:-8000}/api/health || exit 1

# Start command
CMD ["sh", "-c", "python -m uvicorn backend.app.main:app --host ${HOST:-0.0.0.0} --port ${PORT:-8000}"]
