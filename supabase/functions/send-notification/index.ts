import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface NotificationRequest {
  type: "order_placed" | "order_status" | "appointment_confirmed" | "appointment_reminder";
  userId?: string;
  email?: string;
  phone?: string;
  data: {
    orderId?: string;
    orderStatus?: string;
    orderTotal?: number;
    appointmentId?: string;
    doctorName?: string;
    appointmentDate?: string;
    appointmentTime?: string;
    customerName?: string;
  };
  channels?: ("email" | "sms")[];
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

async function sendEmail(to: string, subject: string, html: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await resend.emails.send({
      from: "Taj Medical <noreply@tajmedical.com>",
      to: [to],
      subject,
      html,
    });
    
    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error: error.message };
  }
}

async function sendSMS(phone: string, message: string): Promise<{ success: boolean; error?: string }> {
  const authKey = Deno.env.get("MSG91_AUTH_KEY");
  const senderId = Deno.env.get("MSG91_SENDER_ID") || "TAJMED";
  
  if (!authKey) {
    return { success: false, error: "MSG91_AUTH_KEY not configured" };
  }

  try {
    // Format phone number for MSG91 (should be 10 digits for India)
    const formattedPhone = phone.replace(/[^0-9]/g, "").slice(-10);
    
    const response = await fetch("https://control.msg91.com/api/v5/flow/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authkey": authKey,
      },
      body: JSON.stringify({
        sender: senderId,
        route: "4", // Transactional route
        country: "91",
        sms: [
          {
            message,
            to: [formattedPhone],
          },
        ],
      }),
    });

    const result = await response.json();
    
    if (result.type === "success") {
      return { success: true };
    } else {
      console.error("MSG91 error:", result);
      return { success: false, error: result.message || "SMS send failed" };
    }
  } catch (error) {
    console.error("SMS send error:", error);
    return { success: false, error: error.message };
  }
}

function getEmailTemplate(type: string, data: NotificationRequest["data"]): { subject: string; html: string } {
  switch (type) {
    case "order_placed":
      return {
        subject: `Order Confirmed - #${data.orderId?.slice(0, 8)}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #0f766e, #14b8a6); padding: 30px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Order Confirmed!</h1>
            </div>
            <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px;">
              <p style="color: #334155; font-size: 16px;">Hi ${data.customerName || "Customer"},</p>
              <p style="color: #334155; font-size: 16px;">Your order has been successfully placed.</p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Order ID:</strong> ${data.orderId?.slice(0, 8).toUpperCase()}</p>
                <p style="margin: 5px 0;"><strong>Total:</strong> ₹${data.orderTotal}</p>
                <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #0f766e; font-weight: bold;">Confirmed</span></p>
              </div>
              <p style="color: #64748b; font-size: 14px;">You can track your order from your dashboard.</p>
              <p style="color: #334155; font-size: 16px;">Thank you for shopping with Taj Medical!</p>
            </div>
          </div>
        `,
      };

    case "order_status":
      const statusColors: Record<string, string> = {
        processing: "#f59e0b",
        shipped: "#3b82f6",
        delivered: "#10b981",
        cancelled: "#ef4444",
      };
      const statusColor = statusColors[data.orderStatus || ""] || "#6b7280";
      
      return {
        subject: `Order Update - #${data.orderId?.slice(0, 8)} is ${data.orderStatus}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: ${statusColor}; padding: 30px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">📦 Order Update</h1>
            </div>
            <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px;">
              <p style="color: #334155; font-size: 16px;">Hi ${data.customerName || "Customer"},</p>
              <p style="color: #334155; font-size: 16px;">Your order status has been updated.</p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Order ID:</strong> ${data.orderId?.slice(0, 8).toUpperCase()}</p>
                <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold; text-transform: capitalize;">${data.orderStatus}</span></p>
              </div>
              <p style="color: #334155; font-size: 16px;">Thank you for choosing Taj Medical!</p>
            </div>
          </div>
        `,
      };

    case "appointment_confirmed":
      return {
        subject: `Appointment Confirmed with Dr. ${data.doctorName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #0f766e, #14b8a6); padding: 30px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">✅ Appointment Confirmed</h1>
            </div>
            <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px;">
              <p style="color: #334155; font-size: 16px;">Hi ${data.customerName || "Patient"},</p>
              <p style="color: #334155; font-size: 16px;">Your appointment has been confirmed.</p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Doctor:</strong> Dr. ${data.doctorName}</p>
                <p style="margin: 5px 0;"><strong>Date:</strong> ${data.appointmentDate}</p>
                <p style="margin: 5px 0;"><strong>Time:</strong> ${data.appointmentTime}</p>
              </div>
              <p style="color: #64748b; font-size: 14px;">Please arrive 10 minutes before your scheduled time.</p>
              <p style="color: #334155; font-size: 16px;">Thank you for choosing Taj Medical!</p>
            </div>
          </div>
        `,
      };

    case "appointment_reminder":
      return {
        subject: `Reminder: Appointment Tomorrow with Dr. ${data.doctorName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #f59e0b, #fbbf24); padding: 30px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">⏰ Appointment Reminder</h1>
            </div>
            <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px;">
              <p style="color: #334155; font-size: 16px;">Hi ${data.customerName || "Patient"},</p>
              <p style="color: #334155; font-size: 16px;">This is a reminder for your upcoming appointment.</p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Doctor:</strong> Dr. ${data.doctorName}</p>
                <p style="margin: 5px 0;"><strong>Date:</strong> ${data.appointmentDate}</p>
                <p style="margin: 5px 0;"><strong>Time:</strong> ${data.appointmentTime}</p>
              </div>
              <p style="color: #64748b; font-size: 14px;">Please ensure you have your prescription and any relevant medical records.</p>
              <p style="color: #334155; font-size: 16px;">See you soon!</p>
            </div>
          </div>
        `,
      };

    default:
      return { subject: "Notification from Taj Medical", html: "<p>You have a new notification.</p>" };
  }
}

function getSMSTemplate(type: string, data: NotificationRequest["data"]): string {
  switch (type) {
    case "order_placed":
      return `TAJ MEDICAL: Your order #${data.orderId?.slice(0, 8).toUpperCase()} for Rs.${data.orderTotal} is confirmed. Track on our app.`;
    case "order_status":
      return `TAJ MEDICAL: Your order #${data.orderId?.slice(0, 8).toUpperCase()} is now ${data.orderStatus?.toUpperCase()}. Track on our app.`;
    case "appointment_confirmed":
      return `TAJ MEDICAL: Appointment confirmed with Dr. ${data.doctorName} on ${data.appointmentDate} at ${data.appointmentTime}.`;
    case "appointment_reminder":
      return `TAJ MEDICAL REMINDER: Your appointment with Dr. ${data.doctorName} is tomorrow at ${data.appointmentTime}. Please arrive 10 min early.`;
    default:
      return "TAJ MEDICAL: You have a new notification.";
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const body: NotificationRequest = await req.json();
    const { type, userId, email, phone, data, channels = ["email", "sms"] } = body;

    console.log("Sending notification:", { type, userId, email, phone, channels });

    const results: { email?: { success: boolean; error?: string }; sms?: { success: boolean; error?: string } } = {};

    // Send email if channel is enabled and email is provided
    if (channels.includes("email") && email) {
      const { subject, html } = getEmailTemplate(type, data);
      results.email = await sendEmail(email, subject, html);

      // Log the notification
      await supabaseClient.from("notification_logs").insert({
        user_id: userId || null,
        notification_type: "email",
        template: type,
        recipient: email,
        subject,
        content: html,
        reference_id: data.orderId || data.appointmentId || null,
        reference_type: type.includes("order") ? "order" : "appointment",
        status: results.email.success ? "sent" : "failed",
        error_message: results.email.error || null,
      });
    }

    // Send SMS if channel is enabled and phone is provided
    if (channels.includes("sms") && phone) {
      const message = getSMSTemplate(type, data);
      results.sms = await sendSMS(phone, message);

      // Log the notification
      await supabaseClient.from("notification_logs").insert({
        user_id: userId || null,
        notification_type: "sms",
        template: type,
        recipient: phone,
        content: message,
        reference_id: data.orderId || data.appointmentId || null,
        reference_type: type.includes("order") ? "order" : "appointment",
        status: results.sms.success ? "sent" : "failed",
        error_message: results.sms.error || null,
      });
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Notification error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
