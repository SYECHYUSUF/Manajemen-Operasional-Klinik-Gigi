import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('invoices')
    .select('*, patients(full_name, patient_code, phone)')
    .order('issued_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { invoice, items } = body;

  // Insert invoice
  const { data: inv, error: invErr } = await supabaseAdmin
    .from('invoices')
    .insert(invoice)
    .select('id')
    .single();

  if (invErr) return NextResponse.json({ error: invErr.message }, { status: 500 });

  // Insert invoice items
  if (items && items.length > 0) {
    const itemsWithInvoice = items.map((item: any) => ({ ...item, invoice_id: inv.id }));
    const { error: itemErr } = await supabaseAdmin.from('invoice_items').insert(itemsWithInvoice);
    if (itemErr) return NextResponse.json({ error: itemErr.message }, { status: 500 });
  }

  return NextResponse.json(inv);
}
