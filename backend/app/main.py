import os
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text

# Ensure root is in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from backend.app.config import settings
from backend.app.database import engine, Base
from backend.app.database_seed import seed_database
import backend.app.models

# Routers
from backend.app.auth.routes import router as auth_router
from backend.app.api.dashboard import router as dashboard_router
from backend.app.api.cases import router as cases_router
from backend.app.api.wallets import router as wallets_router
from backend.app.api.vasps import router as vasps_router
from backend.app.api.reports import router as reports_router
from backend.app.api.evidence import router as evidence_router
from backend.app.api.sahyog import router as sahyog_router
from backend.app.api.audit import router as audit_router
from backend.app.api.search import router as search_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables exist and seed demo dataset if empty
    Base.metadata.create_all(bind=engine)
    try:
        seed_database()
    except Exception as e:
        print(f"Warning during seed: {e}")
    yield
    # Shutdown

app = FastAPI(
    title="TraceVASP — Blockchain Intelligence & VASP Attribution Platform",
    description="Automated Attribution of Unknown Cryptocurrency Wallets to Nearest Virtual Asset Service Providers (VASPs). Designed for Law Enforcement & Cybercrime Investigations.",
    version=settings.VERSION,
    lifespan=lifespan
)

# CORS Middleware
cors_origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()] if settings.CORS_ORIGINS else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins if cors_origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health Check Endpoints (Phase 4 requirement: GET /api/health)
@app.api_route("/api/health", methods=["GET", "HEAD"], tags=["System"])
def api_health():
    db_status = "connected"
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"error: {str(e)}"

    return {
        "status": "ok" if db_status == "connected" else "degraded",
        "service": "SIH-182 backend",
        "database": db_status,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "sahyog_mode": "PROTOTYPE_SIMULATION" if settings.SAHYOG_MOCK_MODE else "PRODUCTION_GATEWAY"
    }

@app.api_route("/health", methods=["GET", "HEAD"], tags=["System"])
def root_health():
    db_status = "connected"
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"error: {str(e)}"

    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "service": "SIH-182 backend",
        "database": db_status,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "sahyog_mode": "PROTOTYPE_SIMULATION" if settings.SAHYOG_MOCK_MODE else "PRODUCTION_GATEWAY"
    }

# Include API Routers
app.include_router(auth_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(cases_router, prefix="/api")
app.include_router(wallets_router, prefix="/api")
app.include_router(vasps_router, prefix="/api")
app.include_router(reports_router, prefix="/api")
app.include_router(evidence_router, prefix="/api")
app.include_router(sahyog_router, prefix="/api")
app.include_router(audit_router, prefix="/api")
app.include_router(search_router, prefix="/api")

# Serve Frontend Single Page Application (Unified Single-Link Deployment)
dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
if os.path.exists(dist_dir):
    assets_dir = os.path.join(dist_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.api_route("/", methods=["GET", "HEAD"], include_in_schema=False)
    async def serve_root():
        index_file = os.path.join(dist_dir, "index.html")
        return FileResponse(index_file)

    @app.api_route("/{full_path:path}", methods=["GET", "HEAD"], include_in_schema=False)
    async def serve_spa(request: Request, full_path: str):
        # Allow /api and /health routes to not be intercepted
        if full_path.startswith("api") or full_path == "health" or full_path.startswith("docs") or full_path.startswith("openapi"):
            return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={"detail": "Not Found"})

        file_path = os.path.join(dist_dir, full_path)
        if full_path and os.path.isfile(file_path):
            return FileResponse(file_path)

        # Fallback to SPA index.html for client-side routing
        index_file = os.path.join(dist_dir, "index.html")
        return FileResponse(index_file)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"Unhandled error processing {request.method} {request.url.path}: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred while processing the intelligence request."}
    )
