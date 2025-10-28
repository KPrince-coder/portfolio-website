# File Upload Guide - Avatars & Resumes

This guide explains how to upload and manage avatar images and resume PDFs in your portfolio.

## Storage Buckets Created

The profiles migration automatically creates two storage buckets:

### 1. Avatars Bucket

- **Purpose:** Store profile pictures
- **Bucket ID:** `avatars`
- **Public:** Yes (images can be viewed by anyone)
- **File Size Limit:** 5MB
- **Allowed Types:** JPEG, JPG, PNG, WebP, GIF
- **URL Format:** `https://jcsghggucepqzmonlpeg.supabase.co/storage/v1/object/public/avatars/filename.jpg`

### 2. Resumes Bucket

- **Purpose:** Store PDF resumes
- **Bucket ID:** `resumes`
- **Public:** Yes (resumes can be downloaded by anyone)
- **File Size Limit:** 10MB
- **Allowed Types:** PDF only
- **URL Format:** `https://jcsghggucepqzmonlpeg.supabase.co/storage/v1/object/public/resumes/filename.pdf`

## Uploading Files

### Method 1: Through Supabase Dashboard (Manual)

#### Upload Avatar

1. Go to <https://supabase.com/dashboard/project/jcsghggucepqzmonlpeg/storage/buckets>
2. Click on `avatars` bucket
3. Click "Upload file"
4. Select your image (max 5MB)
5. Recommended naming: `user-id/avatar.jpg` or `user-id/profile.png`
6. After upload, click on the file and copy the public URL
7. Update your profile in Table Editor with the URL

#### Upload Resume

1. Go to <https://supabase.com/dashboard/project/jcsghggucepqzmonlpeg/storage/buckets>
2. Click on `resumes` bucket
3. Click "Upload file"
4. Select your PDF (max 10MB)
5. Recommended naming: `user-id/resume.pdf` or `user-id/cv.pdf`
6. After upload, click on the file and copy the public URL
7. Update your profile in Table Editor with the URL

### Method 2: Programmatically (In Your App)

#### Upload Avatar with TypeScript/JavaScript

```typescript
import { supabase } from '@/integrations/supabase/client';

async function uploadAvatar(file: File, userId: string) {
  // 1. Upload file to storage
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/avatar.${fileExt}`;
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {
      upsert: true // Replace if exists
    });

  if (uploadError) {
    console.error('Error uploading avatar:', uploadError);
    return null;
  }

  // 2. Get public URL
  const { data: urlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  // 3. Update profile with avatar URL
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: urlData.publicUrl })
    .eq('user_id', userId);

  if (updateError) {
    console.error('Error updating profile:', updateError);
    return null;
  }

  return urlData.publicUrl;
}

// Usage
const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('Please upload an image file');
    return;
  }

  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('File size must be less than 5MB');
    return;
  }

  const userId = 'YOUR_USER_ID'; // Get from auth
  const avatarUrl = await uploadAvatar(file, userId);
  
  if (avatarUrl) {
    console.log('Avatar uploaded successfully:', avatarUrl);
  }
};
```

#### Upload Resume with TypeScript/JavaScript

```typescript
import { supabase } from '@/integrations/supabase/client';

async function uploadResume(file: File, userId: string) {
  // 1. Upload file to storage
  const fileName = `${userId}/resume.pdf`;
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('resumes')
    .upload(fileName, file, {
      upsert: true // Replace if exists
    });

  if (uploadError) {
    console.error('Error uploading resume:', uploadError);
    return null;
  }

  // 2. Get public URL
  const { data: urlData } = supabase.storage
    .from('resumes')
    .getPublicUrl(fileName);

  // 3. Update profile with resume info
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ 
      resume_url: urlData.publicUrl,
      resume_file_name: file.name,
      resume_updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);

  if (updateError) {
    console.error('Error updating profile:', updateError);
    return null;
  }

  return urlData.publicUrl;
}

// Usage
const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // Validate file type
  if (file.type !== 'application/pdf') {
    alert('Please upload a PDF file');
    return;
  }

  // Validate file size (10MB)
  if (file.size > 10 * 1024 * 1024) {
    alert('File size must be less than 10MB');
    return;
  }

  const userId = 'YOUR_USER_ID'; // Get from auth
  const resumeUrl = await uploadResume(file, userId);
  
  if (resumeUrl) {
    console.log('Resume uploaded successfully:', resumeUrl);
  }
};
```

## File Upload Component Example

Here's a complete React component for uploading avatar and resume:

```typescript
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export function ProfileFileUpload({ userId }: { userId: string }) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate
    if (!file.type.startsWith('image/')) {
      toast({ variant: 'destructive', title: 'Please upload an image file' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ variant: 'destructive', title: 'File must be less than 5MB' });
      return;
    }

    setUploading(true);

    try {
      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/avatar.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: urlData.publicUrl })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      toast({ title: 'Avatar uploaded successfully!' });
    } catch (error) {
      console.error('Error:', error);
      toast({ variant: 'destructive', title: 'Failed to upload avatar' });
    } finally {
      setUploading(false);
    }
  };

  const uploadResume = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate
    if (file.type !== 'application/pdf') {
      toast({ variant: 'destructive', title: 'Please upload a PDF file' });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ variant: 'destructive', title: 'File must be less than 10MB' });
      return;
    }

    setUploading(true);

    try {
      // Upload to storage
      const fileName = `${userId}/resume.pdf`;
      
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          resume_url: urlData.publicUrl,
          resume_file_name: file.name,
          resume_updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      toast({ title: 'Resume uploaded successfully!' });
    } catch (error) {
      console.error('Error:', error);
      toast({ variant: 'destructive', title: 'Failed to upload resume' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Upload Avatar (Max 5MB)
        </label>
        <Input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Upload Resume (PDF, Max 10MB)
        </label>
        <Input
          type="file"
          accept="application/pdf"
          onChange={uploadResume}
          disabled={uploading}
        />
      </div>
    </div>
  );
}
```

## Deleting Files

### Delete Avatar

```typescript
async function deleteAvatar(userId: string) {
  const fileName = `${userId}/avatar.jpg`; // or whatever extension
  
  const { error } = await supabase.storage
    .from('avatars')
    .remove([fileName]);

  if (error) {
    console.error('Error deleting avatar:', error);
    return false;
  }

  // Update profile to remove avatar URL
  await supabase
    .from('profiles')
    .update({ avatar_url: null })
    .eq('user_id', userId);

  return true;
}
```

### Delete Resume

```typescript
async function deleteResume(userId: string) {
  const fileName = `${userId}/resume.pdf`;
  
  const { error } = await supabase.storage
    .from('resumes')
    .remove([fileName]);

  if (error) {
    console.error('Error deleting resume:', error);
    return false;
  }

  // Update profile to remove resume info
  await supabase
    .from('profiles')
    .update({ 
      resume_url: null,
      resume_file_name: null,
      resume_updated_at: null
    })
    .eq('user_id', userId);

  return true;
}
```

## Security & Permissions

### Storage Policies

The migration creates these policies:

**Avatars:**

- ✅ Anyone can view/download avatars (public bucket)
- ✅ Authenticated users can upload avatars
- ✅ Authenticated users can update avatars
- ✅ Authenticated users can delete avatars

**Resumes:**

- ✅ Anyone can view/download resumes (public bucket)
- ✅ Authenticated users can upload resumes
- ✅ Authenticated users can update resumes
- ✅ Authenticated users can delete resumes

### Best Practices

1. **File Naming:** Use `userId/filename` pattern for organization
2. **Validation:** Always validate file type and size on client side
3. **Error Handling:** Provide clear error messages to users
4. **Upsert:** Use `upsert: true` to replace existing files
5. **Cleanup:** Delete old files when uploading new ones
6. **URLs:** Store the public URL in the profiles table for easy access

## Troubleshooting

### Issue: Upload fails with "Policy violation"

**Solution:** Ensure user is authenticated and RLS policies are correctly set

### Issue: File not appearing after upload

**Solution:** Check bucket is public and file was uploaded successfully

### Issue: "File too large" error

**Solution:** Validate file size before upload (5MB for avatars, 10MB for resumes)

### Issue: Wrong file type uploaded

**Solution:** Use `accept` attribute on file input and validate MIME type

## Alternative: External URLs

You can also use external URLs instead of uploading to Supabase:

```typescript
// Update profile with external avatar URL
await supabase
  .from('profiles')
  .update({ avatar_url: 'https://example.com/avatar.jpg' })
  .eq('user_id', userId);

// Update profile with external resume URL
await supabase
  .from('profiles')
  .update({ 
    resume_url: 'https://example.com/resume.pdf',
    resume_file_name: 'resume.pdf',
    resume_updated_at: new Date().toISOString()
  })
  .eq('user_id', userId);
```

This is useful for:

- Using Gravatar or other avatar services
- Hosting resume on Google Drive, Dropbox, etc.
- Using CDN for better performance
