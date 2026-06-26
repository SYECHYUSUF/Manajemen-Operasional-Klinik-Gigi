from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from dependencies import get_db, get_current_user, require_role
from models import Doctor, Patient, User, UserRole
from schemas import UserMeResponse, UserMeUpdate, UserResponse

router = APIRouter(prefix="/users", tags=["users"])

_admin_only = require_role(UserRole.admin)


@router.get("", response_model=list[UserResponse])
async def list_users(db: AsyncSession = Depends(get_db), _: User = Depends(_admin_only)):
    result = await db.execute(select(User).order_by(User.created_at.desc()))
    return result.scalars().all()


@router.get("/me", response_model=UserMeResponse)
async def get_me(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    data: dict = {
        "id": current_user.id,
        "email": current_user.email,
        "role": current_user.role,
        "is_active": current_user.is_active,
    }
    if current_user.role == UserRole.doctor:
        res = await db.execute(select(Doctor).where(Doctor.user_id == current_user.id))
        doctor = res.scalar_one_or_none()
        if doctor:
            data["full_name"] = doctor.full_name
            data["phone"] = doctor.phone
            data["license_number"] = doctor.license_number
            data["specialization_name"] = doctor.specialization.name if doctor.specialization else None
    elif current_user.role == UserRole.patient:
        res = await db.execute(select(Patient).where(Patient.user_id == current_user.id))
        patient = res.scalar_one_or_none()
        if patient:
            data["full_name"] = patient.full_name
            data["phone"] = patient.phone
            data["address"] = patient.address
    return data


@router.put("/me", response_model=UserMeResponse)
async def update_me(body: UserMeUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    update_data = body.model_dump(exclude_none=True)
    if update_data:
        if current_user.role == UserRole.doctor:
            res = await db.execute(select(Doctor).where(Doctor.user_id == current_user.id))
            doctor = res.scalar_one_or_none()
            if doctor:
                for field, value in update_data.items():
                    if hasattr(doctor, field):
                        setattr(doctor, field, value)
                await db.commit()
        elif current_user.role == UserRole.patient:
            res = await db.execute(select(Patient).where(Patient.user_id == current_user.id))
            patient = res.scalar_one_or_none()
            if patient:
                for field, value in update_data.items():
                    if hasattr(patient, field):
                        setattr(patient, field, value)
                await db.commit()
    return await get_me(db, current_user)


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: UUID, db: AsyncSession = Depends(get_db), _: User = Depends(_admin_only)):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.delete("/{user_id}", status_code=204)
async def deactivate_user(user_id: UUID, db: AsyncSession = Depends(get_db), _: User = Depends(_admin_only)):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = False
    await db.commit()
