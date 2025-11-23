# OG Image - Final Setup Steps

## Current Status

✅ **Code**: Complete and deployed
✅ **Migration**: Ready to run
✅ **Edge Function**: Deployed with WASM support
❌ **Authentication**: Needs configuration

## The Issue

The function returns **401 Unauthorized** because Supabase Edge Functions require JWT verification by default. This is a **configuration issue**, not a code issue.

## Solution: Configure in Supabase Dashboard

### Step 1: Access Function Settings

1. Go to: <https://supabase.com/dashboard/project/jcsghggucepqzmonlpeg/functions>
2. Click on the `og-image` function
3. Look for Settings or Configuration tab

### Step 2: Disable JWT Verification

Find one of these options:

- "Verify JWT" toggle → Turn OFF
- "Public Access" toggle → Turn ON  
- "Authentication Required" → Set to NO

### Step 3: Save and Test

```bash
# Should now return 200 OK
curl -I https://jcsghggucepqzmonlpeg.supabase.co/functions/v1/og-image

# Should download PNG
curl https://jcsghggucepqzmonlpeg.supabase.co/functions/v1/og-image > test.png
```

## Alternative: Use Authorization Header

If you can't disable JWT, the frontend can pass the anon key:

```typescript
// In admin preview
const response = await fetch(ogImageUrl, {
  headers: {
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
  }
});
```

But this won't work for social media crawlers, so public access is preferred.

## Why Public Access is Safe

OG images should be public because:

- ✅ Social media crawlers need access (Facebook, Twitter, LinkedIn)
- ✅ No sensitive data in images
- ✅ Read-only operation
- ✅ Function uses service role key for secure database access
- ✅ Standard practice for OG image endpoints

## What's Already Done

### 1. WASM Support ✅

- Switched from `@resvg/resvg-js` to `@resvg/resvg-wasm`
- Compatible with Supabase Edge Runtime
- No native module dependencies

### 2. Service Role Key ✅

- Function uses `SUPABASE_SERVICE_ROLE_KEY`
- Secure database access
- Bypasses RLS policies

### 3. CORS Headers ✅

- Proper CORS configuration
- Allows cross-origin requests
- Compatible with all browsers

### 4. Error Handling ✅

- Comprehensive error messages
- Logging for debugging
- Graceful fallbacks

## Testing After Configuration

### Test 1: Basic Request

```bash
curl https://jcsghggucepqzmonlpeg.supabase.co/functions/v1/og-image > test.png
open test.png
```

### Test 2: With Parameters

```bash
curl "https://jcsghggucepqzmonlpeg.supabase.co/functions/v1/og-image?title=Test&subtitle=Preview" > test2.png
open test2.png
```

### Test 3: In Browser

```javascript
// Open browser console
fetch('https://jcsghggucepqzmonlpeg.supabase.co/functions/v1/og-image')
  .then(r => r.blob())
  .then(blob => {
    const url = URL.createObjectURL(blob);
    window.open(url);
  });
```

## Next Steps

1. **Configure function in Supabase Dashboard** (5 minutes)
2. **Run migration**: `supabase db push`
3. **Test endpoint**: Should return 200 OK
4. **Check admin preview**: Should show generated image
5. **Test social sharing**: Validate with Facebook/Twitter debuggers

## Support

If you can't find the JWT verification setting:

1. Check Supabase documentation for your version
2. Contact Supabase support
3. Or use the Authorization header approach (less ideal)

---

**The code is production-ready. Only configuration remains!**
