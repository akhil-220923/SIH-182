import os
import sys
import pytest
from fastapi.testclient import TestClient

# Ensure root in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from backend.app.main import app
from backend.app.database import Base, engine, SessionLocal
from backend.app.database_seed import seed_database

@pytest.fixture(scope="session", autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    seed_database()
    yield

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

@pytest.fixture
def auth_headers(client):
    resp = client.post("/api/auth/login", json={
        "email": "investigator@tracevasp.demo",
        "password": "Demo@12345"
    })
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
