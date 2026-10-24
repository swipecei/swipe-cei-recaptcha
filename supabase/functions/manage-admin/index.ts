import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AdminActionRequest {
  userId: string;
  action: "grant" | "revoke";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const anonClient = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

    const { data: { user: requestingUser }, error: authError } = await anonClient.auth.getUser(token);

    if (authError || !requestingUser) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: requestingUserProfile, error: profileError } = await supabase
      .from("users")
      .select("is_admin")
      .eq("id", requestingUser.id)
      .single();

    if (profileError || !requestingUserProfile?.is_admin) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Admin privileges required" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const requestData: AdminActionRequest = await req.json();
    const { userId, action } = requestData;

    if (!userId || !action || !["grant", "revoke"].includes(action)) {
      return new Response(
        JSON.stringify({ error: "Invalid request: userId and action (grant/revoke) required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (userId === requestingUser.id && action === "revoke") {
      return new Response(
        JSON.stringify({ error: "Cannot revoke your own admin privileges" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const isAdmin = action === "grant";

    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update({ is_admin: isAdmin })
      .eq("id", userId)
      .select("id, email, first_name, last_name, is_admin")
      .single();

    if (updateError) {
      console.error("Error updating user admin status:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update admin status" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Admin ${action} by ${requestingUser.email} for user ${updatedUser.email} (${userId})`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Admin privileges ${action === "grant" ? "granted to" : "revoked from"} ${updatedUser.email}`,
        user: updatedUser,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in manage-admin function:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
