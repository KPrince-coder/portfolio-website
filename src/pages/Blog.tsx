import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  Tag,
  Share2,
  BookOpen,
  Search,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import BlogNavigation from "@/components/BlogNavigation";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string;
  published_at: string;
  reading_time: number;
  tags: string[];
  published: boolean;
}

const Blog: React.FC = () => {
  const { slug } = useParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags || [])));

  useEffect(() => {
    loadPosts();
    if (slug) {
      loadPost(slug);
    }
  }, [slug]);

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadPost = async (postSlug: string) => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", postSlug)
        .eq("published", true)
        .single();

      if (error) throw error;
      setCurrentPost(data);
    } catch (error) {
      console.error("Error loading post:", error);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag =
      !selectedTag || (post.tags && post.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <BlogNavigation />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-muted-foreground">Loading blog posts...</p>
          </div>
        </div>
      </div>
    );
  }

  // Individual blog post view
  if (slug && currentPost) {
    return (
      <div className="min-h-screen bg-background">
        <BlogNavigation />
        <div className="pt-20">
          {/* Hero Section */}
          <div className="container mx-auto px-6 mb-12">
            <div className="max-w-4xl mx-auto">
              {currentPost.featured_image_url && (
                <div className="aspect-video mb-8 overflow-hidden rounded-xl">
                  <img
                    src={currentPost.featured_image_url}
                    alt={currentPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="text-center mb-8">
                <h1 className="heading-xl mb-6">{currentPost.title}</h1>

                <div className="flex items-center justify-center space-x-6 text-muted-foreground mb-6">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(currentPost.published_at)}</span>
                  </div>

                  {currentPost.reading_time && (
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{currentPost.reading_time} min read</span>
                    </div>
                  )}
                </div>

                {currentPost.tags && currentPost.tags.length > 0 && (
                  <div className="flex items-center justify-center space-x-2 mb-8">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <div className="flex flex-wrap gap-2">
                      {currentPost.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Button variant="outline" className="neural-glow">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Article
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="container mx-auto px-6 pb-16">
            <div className="max-w-4xl mx-auto">
              <Card className="card-neural">
                <CardContent className="p-8 lg:p-12">
                  <div
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: currentPost.content }}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Blog listing view
  return (
    <div className="min-h-screen bg-background">
      <BlogNavigation />
      <div className="pt-20">
        {/* Hero Section */}
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="heading-xl mb-6">
            <span className="gradient-text">Engineering Insights</span>
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto mb-8">
            Exploring the intersection of data engineering, AI, and software
            development through practical insights and real-world experiences.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="container mx-auto px-6 mb-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setSelectedTag(null)}
                className={selectedTag ? "" : "neural-glow"}
              >
                <Filter className="w-4 h-4 mr-2" />
                All Topics
              </Button>
            </div>

            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? "default" : "secondary"}
                    className="cursor-pointer hover:bg-secondary/80 transition-colors"
                    onClick={() =>
                      setSelectedTag(selectedTag === tag ? null : tag)
                    }
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="container mx-auto px-6 pb-16">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-muted mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedTag
                  ? "Try adjusting your search or filter criteria"
                  : "Blog posts will appear here once published"}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="card-neural hover-scale group cursor-pointer"
                >
                  <Link to={`/blog/${post.slug}`}>
                    {post.featured_image_url && (
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img
                          src={post.featured_image_url}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <CardHeader>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(post.published_at)}</span>
                        </div>

                        {post.reading_time && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{post.reading_time} min</span>
                          </div>
                        )}
                      </div>

                      <CardTitle className="group-hover:text-secondary transition-colors">
                        {post.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent>
                      {post.excerpt && (
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}

                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {post.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{post.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
