# OG Image Troubleshooting Guide

## Gray Preview / Image Not Loading

### Symptoms

- Preview shows gray box
- No image appears
- "Failed to load" error

### Causes & Solutions

#### 1. Edge Function Not Deployed ⚠️ **Most Common**

**Check:**

```bash
# List deployed functions
supabase functions list
```

**Solution:**

```bash
# Deploy the function
supabase functions deploy og-image

# Verify deployment
curl https://your-project.supabase.co/functions/v1/og-image
```

**Expected Response:**

- Should return a PNG image
- Status code: 200

#### 2. Migration Not Run

**Check:**

```bash
# Check if table exists
supabase db diff
```

**Solution:**

```bash
# Run migration
supabase db push

# Or apply specific migration
supabase migration up
```

**Verify:**

```sql
SELECT * FROM og_image_settings WHERE is_active = true;
```

#### 3. Supabase Not Started (Local Development)

**Check:**

```bash
# Check if Supabase is running
supabase status
```

**Solution:**

```bash
# Start Supabase
supabase start

# Serve functions locally
supabase functions serve og-image
```

**Test Locally:**

```bash
curl http://localhost:54321/functions/v1/og-image > test.png
open test.png
```

#### 4. CORS Issues

**Symptoms:**

- Console shows CORS error
- Network tab shows blocked request

**Solution:**
Edge Function already has CORS headers. Check browser console for specific error.

#### 5. Database Connection Issues

**Check Edge Function Logs:**

```bash
# View logs
supabase functions logs og-image

# Or in Supabase Dashboard
# Functions → og-image → Logs
```

**Common Errors:**

- "Failed to fetch OG image settings" → Check migration
- "Connection refused" → Check Supabase status
- "Unauthorized" → Check RLS policies

## Admin Interface

### Test Endpoint Button

The admin interface now includes a "Test Endpoint Connection" button:

**States:**

- 🔵 **Test Endpoint Connection** - Not tested yet
- 🟢 **Endpoint Available** - Function is working
- 🔴 **Endpoint Unavailable** - Function not deployed

**How to Use:**

1. Click "Test Endpoint Connection"
2. Wait for response
3. If unavailable, deploy function
4. Test again

### Preview Not Updating

**Solutions:**

1. Click "Refresh" button
2. Save settings first
3. Clear browser cache
4. Check browser console for errors

## Deployment Checklist

Before expecting preview to work:

- [ ] Run migration: `supabase db push`
- [ ] Deploy function: `supabase functions deploy og-image`
- [ ] Verify function: `curl [function-url]`
- [ ] Check settings exist in database
- [ ] Test endpoint in admin interface
- [ ] Refresh preview

## Quick Fix Commands

```bash
# Complete setup from scratch
supabase db push
supabase functions deploy og-image
supabase functions logs og-image --follow

# Test locally
supabase start
supabase functions serve og-image
curl http://localhost:54321/functions/v1/og-image > test.png

# Check database
supabase db diff
supabase db reset  # WARNING: Resets all data
```

## Common Error Messages

### "Failed to fetch OG image settings"

**Cause:** Migration not run or no active settings
**Fix:** Run migration, check database

### "Cannot find module 'satori'"

**Cause:** Edge Function dependencies not installed
**Fix:** Redeploy function

### "CORS policy blocked"

**Cause:** CORS headers missing
**Fix:** Check Edge Function CORS headers (should be present)

### "Network request failed"

**Cause:** Function not deployed or wrong URL
**Fix:** Deploy function, check URL in `.env`

## Debugging Steps

### 1. Check Environment

```bash
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
```

### 2. Test Function Directly

```bash
# Get your function URL
FUNCTION_URL="https://your-project.supabase.co/functions/v1/og-image"

# Test default image
curl $FUNCTION_URL > test.png

# Test with parameters
curl "$FUNCTION_URL?title=Test&subtitle=Preview" > test2.png

# Open images
open test.png test2.png
```

### 3. Check Browser Console

```javascript
// In browser console
fetch('https://your-project.supabase.co/functions/v1/og-image')
  .then(r => r.blob())
  .then(blob => {
    const url = URL.createObjectURL(blob);
    window.open(url);
  });
```

### 4. Verify Database

```sql
-- Check settings exist
SELECT * FROM og_image_settings;

-- Check active settings
SELECT * FROM og_image_settings WHERE is_active = true;

-- Check brand identity (for logo)
SELECT logo_text, logo_icon FROM brand_identity WHERE is_active = true;
```

## Still Not Working?

### Check These

1. ✅ Supabase project is running
2. ✅ Migration applied successfully
3. ✅ Edge Function deployed
4. ✅ Environment variables set
5. ✅ Browser console shows no errors
6. ✅ Network tab shows request
7. ✅ Function logs show no errors

### Get Help

1. Check Edge Function logs
2. Test function directly with curl
3. Verify database has settings
4. Check browser network tab
5. Review Supabase dashboard

## Success Indicators

When everything is working:

- ✅ Test button shows "Endpoint Available"
- ✅ Preview shows generated image
- ✅ No console errors
- ✅ Function logs show successful requests
- ✅ curl returns PNG image

---

**Most Common Issue:** Edge Function not deployed
**Quick Fix:** `supabase functions deploy og-image`
