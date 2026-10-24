import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  type: "general" | "volunteer" | "programs" | "partnership";
  recaptchaToken: string;
}

const RECAPTCHA_MIN_SCORE = 0.5;

async function verifyRecaptcha(token: string): Promise<{ success: boolean; score: number }> {
  const secret = Deno.env.get("RECAPTCHA_SECRET_KEY");
  if (!secret) {
    console.error("RECAPTCHA_SECRET_KEY is not configured");
    return { success: false, score: 0 };
  }

  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${secret}&response=${token}`,
  });

  const data = await response.json();
  return { success: data.success, score: data.score ?? 0 };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const formData: ContactFormData = await req.json();
    const { name, email, message, type, recaptchaToken } = formData;

    // Verify reCAPTCHA token
    if (!recaptchaToken) {
      return new Response(
        JSON.stringify({ error: "reCAPTCHA verification is required. Please reload the page and try again." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const recaptchaResult = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaResult.success || recaptchaResult.score < RECAPTCHA_MIN_SCORE) {
      return new Response(
        JSON.stringify({ error: "reCAPTCHA verification failed. Please try again." }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate required fields
    if (!name || !email || !message || !type) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get request metadata
    const userAgent = req.headers.get("user-agent") || "";
    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";

    // Initialize Supabase client with service role for database writes
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check rate limiting - max 5 submissions per hour from same IP
    if (ipAddress) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { count } = await supabase
        .from("contact_submissions")
        .select("*", { count: "exact", head: true })
        .eq("ip_address", ipAddress)
        .gte("created_at", oneHourAgo);

      if (count && count >= 5) {
        return new Response(
          JSON.stringify({ error: "Too many submissions. Please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Insert submission into database
    const { data: submission, error: dbError } = await supabase
      .from("contact_submissions")
      .insert([{
        name,
        email,
        message,
        type,
        user_agent: userAgent,
        ip_address: ipAddress,
        recaptcha_score: recaptchaResult.score,
      }])
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to save submission" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Send emails via Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (resendApiKey) {
      try {
        // Format the inquiry type for display
        const typeLabels: Record<string, string> = {
          general: "General Information",
          volunteer: "Volunteering",
          programs: "Program Information",
          partnership: "Partnership Opportunities",
        };

        // Send notification email to organization
        const notificationResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "SWIPE CE Website <noreply@sitesonpolaris.com>",
            to: ["hello@sitesonpolaris.com"],
            subject: `New Contact Form Submission: ${typeLabels[type] || type}`,
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: linear-gradient(135deg, #5d00c1 0%, #00c019 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
                  </div>
                  
                  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
                    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                      <h2 style="color: #5d00c1; margin-top: 0; font-size: 18px; border-bottom: 2px solid #5d00c1; padding-bottom: 10px;">Submission Details</h2>
                      
                      <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold; width: 140px; color: #666;">Name:</td>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">${name}</td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #666;">Email:</td>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;"><a href="mailto:${email}" style="color: #00c019; text-decoration: none;">${email}</a></td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #666;">Inquiry Type:</td>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">${typeLabels[type] || type}</td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #666;">Submission ID:</td>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; font-family: monospace; font-size: 12px;">${submission.id}</td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0; font-weight: bold; color: #666;">Date:</td>
                          <td style="padding: 12px 0;">${new Date(submission.created_at).toLocaleString()}</td>
                        </tr>
                      </table>
                    </div>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px;">
                      <h3 style="color: #5d00c1; margin-top: 0; font-size: 16px; border-bottom: 2px solid #5d00c1; padding-bottom: 10px;">Message</h3>
                      <p style="white-space: pre-wrap; margin: 0; line-height: 1.6;">${message}</p>
                    </div>
                  </div>
                  
                  <div style="text-align: center; margin-top: 20px; padding: 20px; color: #666; font-size: 12px;">
                    <p style="margin: 0;">This is an automated notification from the SWIPE CE website contact form.</p>
                  </div>
                </body>
              </html>
            `,
          }),
        });

        if (!notificationResponse.ok) {
          console.error("Failed to send notification email:", await notificationResponse.text());
        }

        // Send auto-reply email to user
        const autoReplyResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "SWIPE Community Empowerment <noreply@sitesonpolaris.com>",
            to: [email],
            subject: "Thank You for Contacting SWIPE Community Empowerment",
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: linear-gradient(135deg, #5d00c1 0%, #00c019 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">Thank You for Reaching Out!</h1>
                  </div>
                  
                  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
                    <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
                      <p style="margin-top: 0; font-size: 16px;">Dear ${name},</p>
                      
                      <p>Thank you for contacting SWIPE Community Empowerment! We have received your message and truly appreciate your interest in our mission to empower communities.</p>
                      
                      <p>Our team will review your inquiry and get back to you as soon as possible, typically within 1-2 business days.</p>
                      
                      <div style="background: #f0f0f0; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #00c019;">
                        <p style="margin: 0; font-weight: bold; color: #5d00c1; margin-bottom: 8px;">Your Submission Summary:</p>
                        <p style="margin: 5px 0;"><strong>Inquiry Type:</strong> ${typeLabels[type] || type}</p>
                        <p style="margin: 5px 0;"><strong>Message:</strong></p>
                        <p style="margin: 5px 0; white-space: pre-wrap; font-size: 14px;">${message}</p>
                      </div>
                    </div>
                    
                    <div style="background: white; padding: 25px; border-radius: 8px;">
                      <h3 style="color: #5d00c1; margin-top: 0; font-size: 18px;">Stay Connected</h3>
                      
                      <p style="margin-bottom: 15px;">While you wait, feel free to:</p>
                      
                      <ul style="list-style: none; padding: 0;">
                        <li style="margin-bottom: 10px; padding-left: 25px; position: relative;">
                          <span style="position: absolute; left: 0; color: #00c019;">✓</span>
                          Follow us on <a href="https://www.facebook.com/SWIPECEINC" style="color: #5d00c1; text-decoration: none;">Facebook</a>
                        </li>
                        <li style="margin-bottom: 10px; padding-left: 25px; position: relative;">
                          <span style="position: absolute; left: 0; color: #00c019;">✓</span>
                          Email us directly at <a href="mailto:swipeceinc@gmail.com" style="color: #5d00c1; text-decoration: none;">swipeceinc@gmail.com</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div style="text-align: center; margin-top: 20px; padding: 20px; color: #666; font-size: 12px;">
                    <p style="margin: 0 0 5px 0;">SWIPE Community Empowerment, Inc.</p>
                    <p style="margin: 0;">Serving the Charlotte Metro Area</p>
                  </div>
                </body>
              </html>
            `,
          }),
        });

        if (!autoReplyResponse.ok) {
          console.error("Failed to send auto-reply email:", await autoReplyResponse.text());
        }
      } catch (emailError) {
        console.error("Error sending emails:", emailError);
        // Don't fail the request if email fails - submission is still saved
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Thank you for your message! We will get back to you soon.",
        submissionId: submission.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing contact form:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
