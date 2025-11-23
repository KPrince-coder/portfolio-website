# Supabase Migration Checklist

Use this checklist to ensure a smooth migration to your new Supabase project.

## Pre-Migration Checklist

- [x] New Supabase project created (jcsghggucepqzmonlpeg)
- [x] Project credentials obtained
- [x] Old migrations archived to `migrations_old`
- [x] New migration file created
- [x] Configuration files updated (.env, config.toml, client.ts)
- [x] Migration documentation created

## Migration Application Checklist

### Step 1: Verify Configuration

- [ ] Confirm `.env` has correct credentials
- [ ] Confirm `supabase/config.toml` has correct project_id
- [ ] Confirm `src/integrations/supabase/client.ts` has correct URL and key

### Step 2: Link Supabase Project

```bash
supabase link --project-ref jcsghggucepqzmonlpeg
```

- [ ] Project linked successfully
- [ ] No error messages

### Step 3: Review Migration File

- [ ] Open `supabase/migrations/20241028000000_initial_schema.sql`
- [ ] Review the schema structure
- [ ] Understand what will be created

### Step 4: Apply Migration

```bash
supabase db push
```

- [ ] Migration applied successfully
- [ ] No SQL errors reported
- [ ] All tables created

### Step 5: Verify in Supabase Dashboard

Go to: <https://supabase.com/dashboard/project/jcsghggucepqzmonlpeg>

**Table Editor:**

- [ ] profiles table exists
- [ ] skills table exists
- [ ] projects_categories table exists
- [ ] projects table exists
- [ ] project_analytics table exists
- [ ] blog_posts table exists
- [ ] contact_messages table exists
- [ ] message_notifications table exists
- [ ] email_templates table exists
- [ ] message_analytics table exists
- [ ] site_settings table exists
- [ ] brand_settings table exists

**Database > Policies:**

- [ ] RLS enabled on all tables
- [ ] Policies created for each table
- [ ] Public read policies for published content
- [ ] Admin policies for authenticated users

**Database > Functions:**

- [ ] update_updated_at_column function exists
- [ ] trigger_new_message_notification function exists

**Database > Triggers:**

- [ ] updated_at triggers on all tables
- [ ] on_new_contact_message trigger exists

### Step 6: Verify Seed Data

Check in Table Editor:

- [ ] 5 skills inserted
- [ ] 4 site_settings inserted
- [ ] 6 projects_categories inserted
- [ ] 2 email_templates inserted
- [ ] 2 brand_settings inserted

### Step 7: Generate TypeScript Types

```bash
supabase gen types typescript --project-id jcsghggucepqzmonlpeg > src/integrations/supabase/types.ts
```

- [ ] Types generated successfully
- [ ] No TypeScript errors in project

### Step 8: Test Application

**Start Development Server:**

```bash
npm run dev
```

**Test Public Access:**

- [ ] Home page loads
- [ ] Skills section displays
- [ ] Projects section displays (if any published)
- [ ] Blog page loads
- [ ] Contact form displays

**Test Contact Form:**

- [ ] Submit a test message
- [ ] Message appears in Supabase dashboard
- [ ] Notification record created
- [ ] No console errors

**Test Admin Functions (if authenticated):**

- [ ] Can view all projects
- [ ] Can create new project
- [ ] Can edit project
- [ ] Can delete project
- [ ] Can view contact messages
- [ ] Can reply to messages

### Step 9: Performance Check

- [ ] Page load times acceptable
- [ ] No slow queries in Supabase logs
- [ ] Indexes working correctly

### Step 10: Security Verification

- [ ] Cannot access unpublished content without auth
- [ ] Cannot modify data without auth
- [ ] Can submit contact form without auth
- [ ] RLS policies working as expected

## Post-Migration Checklist

### Documentation

- [ ] Team notified of new credentials
- [ ] Environment variables updated in deployment
- [ ] CI/CD pipelines updated (if applicable)
- [ ] Documentation updated with new project details

### Cleanup

- [ ] Old Supabase project marked for deletion (optional)
- [ ] Old credentials removed from password manager
- [ ] Migration summary reviewed and filed

### Monitoring

- [ ] Set up error monitoring
- [ ] Configure database alerts
- [ ] Monitor query performance
- [ ] Check storage usage

## Rollback Plan (If Needed)

If something goes wrong:

1. **Immediate Rollback:**
   - [ ] Revert `.env` to old credentials
   - [ ] Revert `supabase/config.toml`
   - [ ] Revert `src/integrations/supabase/client.ts`
   - [ ] Restart application

2. **Database Rollback:**
   - [ ] Go to Supabase Dashboard
   - [ ] Database > Settings > Reset Database
   - [ ] Reapply old migrations if needed

3. **Document Issues:**
   - [ ] Note what went wrong
   - [ ] Save error messages
   - [ ] Plan fixes before retry

## Success Criteria

Migration is successful when:

- ✅ All tables created correctly
- ✅ RLS policies active and working
- ✅ Seed data inserted
- ✅ Application loads without errors
- ✅ Contact form works
- ✅ Admin functions work (if authenticated)
- ✅ No console errors
- ✅ Performance is acceptable

## Notes

**Date Started:** _______________  
**Date Completed:** _______________  
**Performed By:** _______________  
**Issues Encountered:** _______________  
**Resolution:** _______________

## Additional Resources

- [Supabase Dashboard](https://supabase.com/dashboard/project/jcsghggucepqzmonlpeg)
- [Supabase CLI Docs](https://supabase.com/docs/guides/cli)
- [Migration README](./supabase/migrations/README.md)
- [Migration Summary](./SUPABASE_MIGRATION_SUMMARY.md)

## Support

If you encounter issues:

1. Check Supabase Dashboard logs
2. Review migration file syntax
3. Verify credentials are correct
4. Check RLS policies
5. Consult Supabase documentation
