import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface NewsletterData {
  email: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { email }: NewsletterData = await req.json();

    // Validate email
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
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

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if email already exists
    const { data: existing } = await supabase
      .from("newsletter_subscriptions")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      // If already subscribed and active
      if (existing.status === "active") {
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "You are already subscribed to our newsletter!" 
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      // If previously unsubscribed, reactivate
      if (existing.status === "unsubscribed") {
        const { error: updateError } = await supabase
          .from("newsletter_subscriptions")
          .update({ 
            status: "active", 
            subscribed_at: new Date().toISOString(),
            unsubscribed_at: null 
          })
          .eq("id", existing.id);

        if (updateError) {
          console.error("Error reactivating subscription:", updateError);
          return new Response(
            JSON.stringify({ error: "Failed to reactivate subscription" }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "Welcome back! Your subscription has been reactivated." 
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Insert new subscription
    const { data: subscription, error: dbError } = await supabase
      .from("newsletter_subscriptions")
      .insert([{ email }])
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to save subscription" }),
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
        // Send notification to organization
        const notificationResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "SWIPE CE Website <noreply@sitesonpolaris.com>",
            to: ["hello@sitesonpolaris.com"],
            subject: "New Newsletter Subscription",
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: linear-gradient(135deg, #5d00c1 0%, #00c019 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">New Newsletter Subscriber</h1>
                  </div>
                  
                  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
                    <div style="background: white; padding: 25px; border-radius: 8px;">
                      <p style="margin-top: 0; font-size: 16px;">A new subscriber has joined your newsletter!</p>
                      
                      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold; width: 140px; color: #666;">Email:</td>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;"><a href="mailto:${email}" style="color: #00c019; text-decoration: none;">${email}</a></td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #666;">Subscribed:</td>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">${new Date().toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0; font-weight: bold; color: #666;">Subscription ID:</td>
                          <td style="padding: 12px 0; font-family: monospace; font-size: 12px;">${subscription.id}</td>
                        </tr>
                      </table>
                    </div>
                  </div>
                  
                  <div style="text-align: center; margin-top: 20px; padding: 20px; color: #666; font-size: 12px;">
                    <p style="margin: 0;">This is an automated notification from the SWIPE CE website.</p>
                  </div>
                </body>
              </html>
            `,
          }),
        });

        if (!notificationResponse.ok) {
          console.error("Failed to send notification email:", await notificationResponse.text());
        }

        // Send welcome email to subscriber
        const welcomeResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "SWIPE Community Empowerment <noreply@sitesonpolaris.com>",
            to: [email],
            subject: "Welcome to SWIPE Community Empowerment Newsletter!",
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: linear-gradient(135deg, #5d00c1 0%, #00c019 100%); padding: 40px; border-radius: 10px 10px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Our Community!</h1>
                  </div>
                  
                  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
                    <div style="background: white; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
                      <p style="margin-top: 0; font-size: 16px;">Thank you for subscribing to the SWIPE Community Empowerment newsletter!</p>
                      
                      <p>You've taken an important step in staying connected with our mission to empower communities. Through our newsletter, you'll receive:</p>
                      
                      <ul style="list-style: none; padding: 0; margin: 20px 0;">
                        <li style="margin-bottom: 12px; padding-left: 25px; position: relative;">
                          <span style="position: absolute; left: 0; color: #00c019; font-size: 20px;">✓</span>
                          Updates about our programs and events
                        </li>
                        <li style="margin-bottom: 12px; padding-left: 25px; position: relative;">
                          <span style="position: absolute; left: 0; color: #00c019; font-size: 20px;">✓</span>
                          Stories of community impact and transformation
                        </li>
                        <li style="margin-bottom: 12px; padding-left: 25px; position: relative;">
                          <span style="position: absolute; left: 0; color: #00c019; font-size: 20px;">✓</span>
                          Opportunities to get involved and volunteer
                        </li>
                        <li style="margin-bottom: 12px; padding-left: 25px; position: relative;">
                          <span style="position: absolute; left: 0; color: #00c019; font-size: 20px;">✓</span>
                          Important announcements and news
                        </li>
                      </ul>
                      
                      <p>We're excited to have you as part of our community!</p>
                    </div>
                    
                    <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
                      <h3 style="color: #5d00c1; margin-top: 0; font-size: 18px;">Stay Connected</h3>
                      
                      <p style="margin-bottom: 15px;">Follow us on social media for daily updates:</p>
                      
                      <div style="text-align: center;">
                        <a href="https://www.facebook.com/SWIPECEINC" style="display: inline-block; background: linear-gradient(135deg, #5d00c1 0%, #00c019 100%); color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; margin: 10px; font-weight: bold;">Visit Our Facebook</a>
                      </div>
                      
                      <p style="margin-top: 20px; text-align: center;">Questions? Email us at <a href="mailto:swipeceinc@gmail.com" style="color: #5d00c1; text-decoration: none;">swipeceinc@gmail.com</a></p>
                    </div>
                    
                    <div style="text-align: center; font-size: 12px; color: #666;">
                      <p>You can <a href="#" style="color: #666; text-decoration: underline;">unsubscribe</a> at any time.</p>
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

        if (!welcomeResponse.ok) {
          console.error("Failed to send welcome email:", await welcomeResponse.text());
        }
      } catch (emailError) {
        console.error("Error sending emails:", emailError);
        // Don't fail the request if email fails - subscription is still saved
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Thank you for subscribing to our newsletter!",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing newsletter subscription:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
