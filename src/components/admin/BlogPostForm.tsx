import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, X, Plus, Eye } from 'lucide-react';

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string;
  tags: string[];
  published: boolean;
  reading_time: number;
}

interface BlogPostFormProps {
  post?: BlogPost;
  onSave: () => void;
  onCancel: () => void;
}

const BlogPostForm: React.FC<BlogPostFormProps> = ({ post, onSave, onCancel }) => {
  const [formData, setFormData] = useState<BlogPost>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image_url: '',
    tags: [],
    published: false,
    reading_time: 5,
    ...post
  });
  const [newTag, setNewTag] = useState('');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.id ? prev.slug : generateSlug(title)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      content,
      reading_time: estimateReadingTime(content)
    }));
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      toast({
        variant: "destructive",
        title: "Missing required fields",
        description: "Title and content are required",
      });
      return;
    }

    setSaving(true);
    try {
      const dataToSave = {
        ...formData,
        published_at: formData.published ? new Date().toISOString() : null,
      };

      if (formData.id) {
        const { error } = await supabase
          .from('blog_posts')
          .update(dataToSave)
          .eq('id', formData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([dataToSave]);

        if (error) throw error;
      }

      toast({
        title: "Blog post saved successfully",
      });

      onSave();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error saving blog post",
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {formData.id ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h3>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving} className="neural-glow">
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Post'}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="card-neural">
            <CardHeader>
              <CardTitle>Post Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter post title"
                />
              </div>

              <div>
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="url-friendly-slug"
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief description of the post"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Write your blog post content here (HTML supported)"
                  rows={15}
                  className="font-mono"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publishing */}
          <Card className="card-neural">
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="published">Published</Label>
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                />
              </div>

              <div>
                <Label htmlFor="reading-time">Reading Time (minutes)</Label>
                <Input
                  id="reading-time"
                  type="number"
                  value={formData.reading_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, reading_time: parseInt(e.target.value) || 5 }))}
                  min="1"
                />
              </div>

              <div>
                <Label htmlFor="featured-image">Featured Image URL</Label>
                <Input
                  id="featured-image"
                  value={formData.featured_image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured_image_url: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="card-neural">
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag"
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button onClick={addTag} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer">
                    {tag}
                    <X
                      className="w-3 h-3 ml-1"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          {formData.title && (
            <Card className="card-neural">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <h4 className="font-semibold">{formData.title}</h4>
                  {formData.excerpt && (
                    <p className="text-muted-foreground line-clamp-3">{formData.excerpt}</p>
                  )}
                  <div className="flex items-center space-x-2 text-xs">
                    <Badge variant="outline">{formData.reading_time} min read</Badge>
                    <Badge variant={formData.published ? "secondary" : "outline"}>
                      {formData.published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPostForm;