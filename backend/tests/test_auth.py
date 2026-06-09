import pytest

@pytest.mark.asyncio
async def test_register_new_user(client):
    response = await client.post("/auth/register", json={
        "email": "testuser_plan@example.com",
        "password": "TestPass@123",
        "role": "patient",
    })
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "testuser_plan@example.com"
    assert data["role"] == "patient"
    assert "id" in data

@pytest.mark.asyncio
async def test_login_valid_credentials(client):
    # register first
    await client.post("/auth/register", json={
        "email": "testlogin_plan@example.com",
        "password": "TestPass@123",
    })
    response = await client.post("/auth/login", json={
        "email": "testlogin_plan@example.com",
        "password": "TestPass@123",
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

@pytest.mark.asyncio
async def test_login_wrong_password(client):
    await client.post("/auth/register", json={
        "email": "testwrong_plan@example.com",
        "password": "TestPass@123",
    })
    response = await client.post("/auth/login", json={
        "email": "testwrong_plan@example.com",
        "password": "WrongPassword",
    })
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_protected_endpoint_without_token(client):
    response = await client.get("/patients")
    assert response.status_code == 403
