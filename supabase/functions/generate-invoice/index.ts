import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface InvoiceRequest {
  type: "order" | "lab_booking" | "scan_booking";
  referenceId: string;
}

function generateInvoiceHTML(invoice: any, items: any[], type: string): string {
  const itemRows = items.map((item, index) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${index + 1}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.quantity || 1}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">₹${item.price || item.amount}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">₹${(item.price || item.amount) * (item.quantity || 1)}</td>
    </tr>
  `).join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${invoice.invoice_number}</title>
  <style>
    @media print {
      body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 40px; background: #f8fafc; }
    .invoice { max-width: 800px; margin: 0 auto; background: white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border-radius: 12px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #0f766e, #14b8a6); color: white; padding: 30px 40px; }
    .header h1 { margin: 0 0 5px 0; font-size: 28px; }
    .header p { margin: 0; opacity: 0.9; }
    .content { padding: 40px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
    .info-box h3 { margin: 0 0 10px 0; color: #0f766e; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
    .info-box p { margin: 3px 0; color: #334155; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #f1f5f9; padding: 12px; text-align: left; font-weight: 600; color: #475569; }
    th:last-child, th:nth-child(3), th:nth-child(4) { text-align: right; }
    th:nth-child(3) { text-align: center; }
    .totals { margin-top: 20px; border-top: 2px solid #e2e8f0; padding-top: 20px; }
    .total-row { display: flex; justify-content: space-between; padding: 8px 0; }
    .total-row.grand { font-size: 20px; font-weight: bold; color: #0f766e; border-top: 2px solid #0f766e; margin-top: 10px; padding-top: 15px; }
    .footer { text-align: center; padding: 30px 40px; background: #f8fafc; border-top: 1px solid #e2e8f0; }
    .footer p { margin: 5px 0; color: #64748b; font-size: 14px; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .badge-paid { background: #dcfce7; color: #16a34a; }
    .badge-pending { background: #fef3c7; color: #d97706; }
  </style>
</head>
<body>
  <div class="invoice">
    <div class="header">
      <h1>TAJ MEDICAL</h1>
      <p>Your Trusted Healthcare Partner</p>
    </div>
    
    <div class="content">
      <div class="info-grid">
        <div class="info-box">
          <h3>Invoice Details</h3>
          <p><strong>Invoice No:</strong> ${invoice.invoice_number}</p>
          <p><strong>Date:</strong> ${new Date(invoice.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p><strong>Type:</strong> ${type === 'order' ? 'Medicine Order' : type === 'lab_booking' ? 'Lab Test Booking' : 'Scan Booking'}</p>
          <p><strong>Payment:</strong> <span class="badge ${invoice.payment_status === 'completed' ? 'badge-paid' : 'badge-pending'}">${invoice.payment_status?.toUpperCase() || 'PENDING'}</span></p>
        </div>
        <div class="info-box" style="text-align: right;">
          <h3>Bill To</h3>
          <p><strong>${invoice.customer_name || 'Customer'}</strong></p>
          ${invoice.customer_email ? `<p>${invoice.customer_email}</p>` : ''}
          ${invoice.customer_phone ? `<p>${invoice.customer_phone}</p>` : ''}
          ${invoice.customer_address ? `<p>${invoice.customer_address}</p>` : ''}
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 50px;">#</th>
            <th>Item Description</th>
            <th style="width: 80px;">Qty</th>
            <th style="width: 100px;">Price</th>
            <th style="width: 120px;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
      </table>

      <div class="totals" style="max-width: 300px; margin-left: auto;">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>₹${invoice.subtotal}</span>
        </div>
        ${invoice.discount > 0 ? `
        <div class="total-row" style="color: #16a34a;">
          <span>Discount:</span>
          <span>-₹${invoice.discount}</span>
        </div>
        ` : ''}
        ${invoice.tax_amount > 0 ? `
        <div class="total-row">
          <span>Tax (GST):</span>
          <span>₹${invoice.tax_amount}</span>
        </div>
        ` : ''}
        <div class="total-row grand">
          <span>Total:</span>
          <span>₹${invoice.total}</span>
        </div>
      </div>
    </div>

    <div class="footer">
      <p><strong>Thank you for choosing Taj Medical!</strong></p>
      <p>For support: support@tajmedical.com | +91 1234567890</p>
      <p style="font-size: 12px; margin-top: 15px;">This is a computer-generated invoice. No signature required.</p>
    </div>
  </div>
</body>
</html>
  `;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authorization required");
    }
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !userData.user) {
      throw new Error("Invalid authorization");
    }

    const { type, referenceId }: InvoiceRequest = await req.json();
    console.log("Generating invoice:", { type, referenceId });

    let invoice;
    let items: any[] = [];

    // Check if invoice already exists
    const { data: existingInvoice } = await supabaseClient
      .from("invoices")
      .select("*")
      .eq(type === "order" ? "order_id" : type === "lab_booking" ? "lab_booking_id" : "scan_booking_id", referenceId)
      .single();

    if (existingInvoice) {
      invoice = existingInvoice;
      items = invoice.items as any[];
    } else {
      // Fetch the reference data and create invoice
      if (type === "order") {
        const { data: order, error } = await supabaseClient
          .from("orders")
          .select("*")
          .eq("id", referenceId)
          .eq("user_id", userData.user.id)
          .single();

        if (error || !order) throw new Error("Order not found");

        items = order.items as any[];
        
        // Get user profile for customer details
        const { data: profile } = await supabaseClient
          .from("profiles")
          .select("*")
          .eq("id", userData.user.id)
          .single();

        // Create invoice record
        const { data: newInvoice, error: invoiceError } = await supabaseClient
          .from("invoices")
          .insert({
            user_id: userData.user.id,
            order_id: referenceId,
            invoice_type: "order",
            items: order.items,
            subtotal: order.subtotal,
            discount: order.discount || 0,
            tax_amount: 0,
            total: order.total,
            payment_status: order.payment_status,
            payment_method: order.payment_method,
            customer_name: profile?.full_name,
            customer_email: profile?.email || userData.user.email,
            customer_phone: profile?.phone || order.delivery_phone,
            customer_address: order.delivery_address,
          })
          .select()
          .single();

        if (invoiceError) throw invoiceError;
        invoice = newInvoice;

      } else if (type === "lab_booking") {
        const { data: booking, error } = await supabaseClient
          .from("lab_bookings")
          .select("*, lab_tests(*), health_packages(*)")
          .eq("id", referenceId)
          .eq("user_id", userData.user.id)
          .single();

        if (error || !booking) throw new Error("Lab booking not found");

        const testName = booking.lab_tests?.name || booking.health_packages?.name || "Lab Test";
        items = [{ name: testName, price: booking.amount, quantity: 1 }];

        const { data: profile } = await supabaseClient
          .from("profiles")
          .select("*")
          .eq("id", userData.user.id)
          .single();

        const { data: newInvoice, error: invoiceError } = await supabaseClient
          .from("invoices")
          .insert({
            user_id: userData.user.id,
            lab_booking_id: referenceId,
            invoice_type: "lab_booking",
            items: items,
            subtotal: booking.amount,
            discount: 0,
            tax_amount: 0,
            total: booking.amount,
            payment_status: booking.payment_status,
            customer_name: profile?.full_name,
            customer_email: profile?.email || userData.user.email,
            customer_phone: profile?.phone,
            customer_address: booking.collection_address,
          })
          .select()
          .single();

        if (invoiceError) throw invoiceError;
        invoice = newInvoice;

      } else if (type === "scan_booking") {
        const { data: booking, error } = await supabaseClient
          .from("scan_bookings")
          .select("*, scan_tests(*)")
          .eq("id", referenceId)
          .eq("user_id", userData.user.id)
          .single();

        if (error || !booking) throw new Error("Scan booking not found");

        items = [{ name: booking.scan_tests?.name || "Scan", price: booking.amount, quantity: 1 }];

        const { data: profile } = await supabaseClient
          .from("profiles")
          .select("*")
          .eq("id", userData.user.id)
          .single();

        const { data: newInvoice, error: invoiceError } = await supabaseClient
          .from("invoices")
          .insert({
            user_id: userData.user.id,
            scan_booking_id: referenceId,
            invoice_type: "scan_booking",
            items: items,
            subtotal: booking.amount,
            discount: 0,
            tax_amount: 0,
            total: booking.amount,
            payment_status: booking.payment_status,
            customer_name: profile?.full_name,
            customer_email: profile?.email || userData.user.email,
            customer_phone: profile?.phone,
          })
          .select()
          .single();

        if (invoiceError) throw invoiceError;
        invoice = newInvoice;
      }
    }

    // Generate HTML invoice
    const html = generateInvoiceHTML(invoice, items, type);

    return new Response(JSON.stringify({ 
      success: true, 
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoice_number,
      html 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Invoice generation error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
