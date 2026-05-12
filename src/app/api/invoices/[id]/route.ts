import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET invoice detail + items + payment
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [invRes, itemsRes, payRes] = await Promise.all([
    supabaseAdmin.from('invoices').select('*, patients(full_name, patient_code, phone)').eq('id', id).single(),
    supabaseAdmin.from('invoice_items').select('*').eq('invoice_id', id),
    supabaseAdmin.from('payments').select('*').eq('invoice_id', id).order('created_at', { ascending: false }).limit(1),
  ]);

  if (invRes.error) return NextResponse.json({ error: invRes.error.message }, { status: 500 });

  return NextResponse.json({
    invoice: invRes.data,
    items: itemsRes.data || [],
    payment: payRes.data?.[0] || null,
  });
}

// POST = process payment
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  // Insert payment
  const { error: payErr } = await supabaseAdmin.from('payments').insert({
    invoice_id: id,
    payment_number: body.payment_number,
    amount: body.amount,
    method: body.method,
    status: 'paid',
    paid_at: new Date().toISOString(),
    notes: body.notes || null,
  });

  if (payErr) return NextResponse.json({ error: payErr.message }, { status: 500 });

  // Update invoice status
  const { error: invErr } = await supabaseAdmin
    .from('invoices')
    .update({ status: 'paid', updated_at: new Date().toISOString() })
    .eq('id', id);

  if (invErr) return NextResponse.json({ error: invErr.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
