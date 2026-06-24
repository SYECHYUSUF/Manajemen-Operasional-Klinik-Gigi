import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
import os
from dotenv import load_dotenv

load_dotenv("D:/Muhammad_Fadhil_Mulyadi/Project/Manajemen-Operasional-Klinik-Gigi/backend/.env")

DATABASE_URL = os.getenv("DATABASE_URL")

async def fix():
    engine = create_async_engine(DATABASE_URL)
    async with engine.begin() as conn:
        # 1. Update the trigger function
        await conn.execute(text("""
            CREATE OR REPLACE FUNCTION trigger_recalculate_invoice()
            RETURNS TRIGGER AS $$
            BEGIN
              UPDATE invoices
              SET subtotal = (
                SELECT COALESCE(SUM(subtotal), 0) FROM invoice_items WHERE invoice_id = COALESCE(NEW.invoice_id, OLD.invoice_id)
              ),
              total_amount = GREATEST(0, (SELECT COALESCE(SUM(subtotal), 0) FROM invoice_items WHERE invoice_id = COALESCE(NEW.invoice_id, OLD.invoice_id)) - discount_amount + tax_amount)
              WHERE id = COALESCE(NEW.invoice_id, OLD.invoice_id);
              RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        """))
        
        # 2. Fix the existing negative total_amount data
        await conn.execute(text("""
            UPDATE invoices
            SET total_amount = GREATEST(0, subtotal - discount_amount + tax_amount)
            WHERE total_amount < 0 OR total_amount != GREATEST(0, subtotal - discount_amount + tax_amount);
        """))
        print("Fixed database triggers and existing data!")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(fix())
