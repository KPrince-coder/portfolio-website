import React, { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

interface SkillCategory {
  id: string;
  name: string;
  label: string;
  icon: string;
  display_order: number;
}

interface Skill {
  id: string;
  category_id: string;
  name: string;
  proficiency: number;
  description: string;
  icon: string;
  color: string;
  display_order: number;
  is_featured: boolean;
  category_name: string;
  category_label: string;
}

interface LearningGoal {
  id: string;
  title: string;
  status: "learning" | "exploring" | "researching";
  color: string;
  is_active: boolean;
}

interface ProfileSkillsData {
  skills_title: string;
  skills_description: string;
}

const Skills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [learningGoals, setLearningGoals] = useState<LearningGoal[]>([]);
  const [profileData, setProfileData] = useState<ProfileSkillsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load profile skills data
      const { data: profile } = await supabase
        .from("profiles")
        .select("skills_title, skills_description")
        .single();

      if (profile) {
        setProfileData(profile);
      }

      // Load categories
      const { data: categoriesData } = await supabase
        .from("skill_categories")
        .select("*")
        .order("display_order", { ascending: true });

      if (categoriesData) {
        setCategories(categoriesData);
      }

      // Load skills with category info
      const { data: skillsData } = await supabase
        .from("skills_with_categories")
        .select("*")
        .order("display_order", { ascending: true });

      if (skillsData) {
        setSkills(skillsData as unknown as Skill[]);
      }

      // Load learning goals
      const { data: goalsData } = await supabase
        .from("learning_goals")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (goalsData) {
        setLearningGoals(goalsData as LearningGoal[]);
      }
    } catch (error) {
      console.error("Error loading skills data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSkills =
    activeCategory === "all"
      ? skills
      : skills.filter((skill) => skill.category_id === activeCategory);

  // Get icon component dynamically
  const getIcon = (iconName: string) => {
    const Icon = Icons[iconName as keyof typeof Icons] as React.ComponentType<{
      className?: string;
    }>;
    return Icon || Icons.Code;
  };

  // Skeleton Loading Component
  const SkillsSkeleton = () => (
    <div className="space-y-12">
      {/* Header Skeleton */}
      <div className="text-center space-y-4">
        <Skeleton className="h-12 w-64 mx-auto" />
        <Skeleton className="h-1 w-24 mx-auto" />
        <Skeleton className="h-20 w-full max-w-3xl mx-auto" />
      </div>

      {/* Category Filter Skeleton */}
      <div className="flex flex-wrap justify-center gap-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-32" />
        ))}
      </div>

      {/* Skills Grid Skeleton */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="card-neural">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-5 w-12" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-2 w-full rounded-full" />
              <div className="flex justify-between items-center">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, j) => (
                    <Skeleton key={j} className="w-2 h-2 rounded-full" />
                  ))}
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <section
        id="skills"
        className="py-20 bg-gradient-to-b from-background/50 to-background"
      >
        <div className="container mx-auto px-6">
          <SkillsSkeleton />
        </div>
      </section>
    );
  }

  const STATUS_LABELS = {
    learning: "Currently learning",
    exploring: "Exploring",
    researching: "Researching",
  };

  const STATUS_COLORS = {
    learning: "text-secondary",
    exploring: "text-accent",
    researching: "text-success",
  };

  return (
    <section
      id="skills"
      className="py-20 bg-gradient-to-b from-background/50 to-background"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="heading-xl mb-6">
            {profileData?.skills_title || "Technical"}{" "}
            <span className="text-neural">Expertise</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-secondary mx-auto mb-8"></div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {profileData?.skills_description ||
              "A comprehensive toolkit for building intelligent systems, from data pipelines to user interfaces."}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => {
            const CategoryIcon = getIcon(category.icon);
            return (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                onClick={() => setActiveCategory(category.id)}
                className={`neural-glow ${
                  activeCategory === category.id ? "shadow-glow-secondary" : ""
                }`}
              >
                <CategoryIcon className="w-4 h-4 mr-2" />
                {category.label}
              </Button>
            );
          })}
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill, index) => {
            const SkillIcon = getIcon(skill.icon);
            return (
              <Card
                key={skill.id}
                className="card-neural neural-glow group hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-gradient-neural`}>
                        <SkillIcon className={`w-6 h-6 ${skill.color}`} />
                      </div>
                      <span className="text-lg">{skill.name}</span>
                    </div>
                    <span className="text-sm font-mono text-secondary">
                      {skill.proficiency}%
                    </span>
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {skill.description}
                  </p>

                  {/* Proficiency Bar */}
                  <div className="space-y-2">
                    <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-secondary rounded-full transition-all duration-1000 ease-out group-hover:shadow-glow-secondary"
                        style={{
                          width: `${skill.proficiency}%`,
                          animation: `data-flow 3s ease-in-out infinite`,
                          animationDelay: `${index * 0.2}s`,
                        }}
                      />
                    </div>

                    {/* Neural Network Visualization */}
                    <div className="flex justify-between items-center pt-2">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-all duration-500 ${
                              i < Math.floor(skill.proficiency / 20)
                                ? "bg-secondary shadow-glow-secondary"
                                : "bg-border"
                            }`}
                            style={{ animationDelay: `${i * 0.1}s` }}
                          />
                        ))}
                      </div>
                      <div className="text-xs text-muted font-mono">
                        Expert Level
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Learning Goals Section */}
        {learningGoals.length > 0 && (
          <div className="mt-16 text-center">
            <Card className="card-neural max-w-4xl mx-auto">
              <CardContent className="p-8">
                <h3 className="heading-md mb-6">Continuous Learning</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  The field of AI and data engineering evolves rapidly. I
                  dedicate time each week to exploring new frameworks,
                  contributing to open source projects, and experimenting with
                  cutting-edge technologies.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  {learningGoals.map((goal) => (
                    <div
                      key={goal.id}
                      className={`flex items-center space-x-2 text-sm ${
                        STATUS_COLORS[goal.status]
                      }`}
                    >
                      <div
                        className={`w-2 h-2 ${goal.color} rounded-full animate-pulse`}
                      ></div>
                      <span>
                        {STATUS_LABELS[goal.status]}: {goal.title}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;
