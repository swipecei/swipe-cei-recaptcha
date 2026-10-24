# Edge Function Deployment Instructions

## Manage Admin Edge Function

The `manage-admin` edge function has been created and needs to be deployed.

### Function Location
`supabase/functions/manage-admin/index.ts`

### Deployment Options

#### Option 1: Via Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard
2. Navigate to **Edge Functions** section
3. Click **Create a new function** or **Deploy function**
4. Upload or copy the contents of `supabase/functions/manage-admin/index.ts`
5. Set the function name as: `manage-admin`
6. Deploy the function

#### Option 2: Via Supabase CLI

If you have Supabase CLI installed:

```bash
supabase functions deploy manage-admin
```

#### Option 3: Via MCP Tool

If the MCP tool is available in your environment:

```bash
mcp__supabase__deploy_edge_function manage-admin
```

### Function Details

**Name:** `manage-admin`

**Purpose:** Securely grant or revoke admin privileges to users

**Authentication:** Requires authenticated admin user

**Endpoints:**
- POST `/functions/v1/manage-admin`

**Request Body:**
```json
{
  "userId": "user-uuid",
  "action": "grant" | "revoke"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Admin privileges granted to user@example.com",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "First",
    "last_name": "Last",
    "is_admin": true
  }
}
```

### Environment Variables Required

The function uses these environment variables (automatically available in Supabase):
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Anonymous key for auth verification
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for admin operations

### Testing After Deployment

```typescript
import { authApi } from './lib/supabase';

// Grant admin privileges
const result = await authApi.manageAdminPrivileges('user-uuid', 'grant');
console.log(result);

// Revoke admin privileges
const result2 = await authApi.manageAdminPrivileges('user-uuid', 'revoke');
console.log(result2);
```

### Security Notes

- Only existing admins can use this function
- Users cannot revoke their own admin privileges
- All actions are logged for audit purposes
- Uses service role key internally (never exposed to client)

### Verification

After deployment, verify the function is working:

1. Check Edge Functions dashboard shows `manage-admin` as deployed
2. Test with an admin account
3. Check function logs for any errors
4. Verify admin privileges are correctly granted/revoked in the users table
