# OG Image Authentication Fix

## Problem

The OG image function returns 401 Unauthorized because Supabase Edge Functions require authentication by default.

## Solution

### Option 1: Disable JWT Verification (Recommended for OG Images)

OG images need to be publicly accessible for social media crawlers.

**Steps:**

1. Go to Supabase Dashboard
2. Navigate to Edge Functions → og-image
3. Click on Settings/Configuration
4. Disable "Verify JWT" or set function to public
5. Save changes

### Option 2: Use Service Role Key (Current Implementation)

The function already uses `SUPABASE_SERVICE_ROLE_KEY` which should bypass RLS.

**Verify Environment Variables:**

```bash
# Check if service role key is set
supabase secrets list
```

**Set if missing:**

```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Option 3: Configure in supabase/config.toml

Add to your `supabase/config.toml`:

```toml
[functions.og-image]
verify_jwt = false
```

Then redeploy:

```bash
supabase functions deploy og-image
```

## Testing

After applying the fix:

```bash
# Should return 200 OK
curl -I https://your-project.supabase.co/functions/v1/og-image

# Should return PNG image
curl https://your-project.supabase.co/functions/v1/og-image > test.png
open test.png
```

## Why This is Safe

OG images are meant to be public:

- Social media crawlers need access
- No sensitive data in images
- Read-only operation
- Uses service role for database access (secure)

## Current Status

The function is deployed but returns 401. Apply one of the solutions above to fix.
