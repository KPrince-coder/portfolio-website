import React, { useMemo } from "react";
import {
  Download,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";
import { useResumeData } from "./hooks/useResumeData";
import ResumeSkeleton from "./ResumeSkeleton";
import {
  formatPeriod,
  formatEducationPeriod,
  formatCertificationDate,
  isCertificationExpired,
  splitTitle,
} from "./utils";

/**
 * Resume Component
 * Displays professional resume with work experience, education, and certifications
 * Optimized for SEO and performance
 */
const Resume: React.FC = () => {
  const { data, loading, error } = useResumeData();

  // Split title into main and highlight parts (must be before conditional returns)
  const fullTitle = data.title || "Professional Resume";
  const { title: mainTitle, titleHighlight } = useMemo(
    () => splitTitle(fullTitle),
    [fullTitle]
  );

  if (loading) {
    return <ResumeSkeleton />;
  }

  if (error) {
    return (
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground">
            Unable to load resume data. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  const {
    experiences,
    education,
    certifications,
    stats,
    description,
    resume_url,
  } = data;

  return (
    <section id="resume" className="py-20 bg-card/50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <SectionHeader
          title={mainTitle}
          titleHighlight={titleHighlight}
          description={
            description ||
            "A comprehensive overview of my professional journey, education, and certifications."
          }
          align="center"
        />

        {resume_url && (
          <div className="text-center mb-12">
            <Button className="neural-glow" size="lg" asChild>
              <a
                href={resume_url}
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                <Download className="w-5 h-5 mr-2" />
                Download PDF Resume
              </a>
            </Button>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Work Experience */}
            {experiences.length > 0 && (
              <Card className="card-neural">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Briefcase className="w-6 h-6 text-secondary" />
                    <span>Professional Experience</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {experiences.map((exp, index) => (
                    <article key={exp.id} className="relative">
                      {index !== experiences.length - 1 && (
                        <div className="absolute left-0 top-8 w-px h-full bg-border" />
                      )}
                      <div className="flex items-start space-x-4">
                        <div className="w-3 h-3 bg-secondary rounded-full mt-2 relative z-10" />
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                            <h3 className="font-semibold text-lg text-neural">
                              {exp.title}
                            </h3>
                            <div className="flex items-center space-x-2 text-sm text-muted">
                              <Calendar
                                className="w-4 h-4"
                                aria-hidden="true"
                              />
                              <time>
                                {formatPeriod(
                                  exp.start_date,
                                  exp.end_date,
                                  exp.is_current
                                )}
                              </time>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 mb-3">
                            {exp.company_url ? (
                              <a
                                href={exp.company_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-secondary hover:underline"
                              >
                                {exp.company}
                              </a>
                            ) : (
                              <span className="font-medium text-secondary">
                                {exp.company}
                              </span>
                            )}
                            {exp.location && (
                              <div className="flex items-center space-x-1 text-sm text-muted">
                                <MapPin
                                  className="w-4 h-4"
                                  aria-hidden="true"
                                />
                                <span>{exp.location}</span>
                              </div>
                            )}
                            {exp.employment_type && (
                              <Badge variant="outline" className="text-xs">
                                {exp.employment_type}
                              </Badge>
                            )}
                          </div>
                          {exp.description && (
                            <p className="text-muted mb-4">{exp.description}</p>
                          )}
                          {exp.achievements && exp.achievements.length > 0 && (
                            <ul className="space-y-2" role="list">
                              {exp.achievements.map((achievement, achIndex) => (
                                <li
                                  key={achIndex}
                                  className="flex items-start space-x-2"
                                >
                                  <div className="w-1 h-1 bg-accent rounded-full mt-2 flex-shrink-0" />
                                  <span className="text-sm text-muted-foreground">
                                    {achievement}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Education */}
            {education.length > 0 && (
              <Card className="card-neural">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <GraduationCap className="w-6 h-6 text-accent" />
                    <span>Education</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {education.map((edu, index) => (
                    <article key={edu.id} className="relative">
                      {index !== education.length - 1 && (
                        <div className="absolute left-0 top-8 w-px h-16 bg-border" />
                      )}
                      <div className="flex items-start space-x-4">
                        <div className="w-3 h-3 bg-accent rounded-full mt-2 relative z-10" />
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                            <h3 className="font-semibold text-lg text-neural">
                              {edu.degree}
                              {edu.field_of_study &&
                                ` in ${edu.field_of_study}`}
                            </h3>
                            {(edu.start_date || edu.end_date) && (
                              <div className="flex items-center space-x-2 text-sm text-muted">
                                <Calendar
                                  className="w-4 h-4"
                                  aria-hidden="true"
                                />
                                <time>
                                  {formatEducationPeriod(
                                    edu.start_date,
                                    edu.end_date
                                  )}
                                </time>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 mb-2">
                            {edu.school_url ? (
                              <a
                                href={edu.school_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-accent hover:underline"
                              >
                                {edu.school}
                              </a>
                            ) : (
                              <span className="font-medium text-accent">
                                {edu.school}
                              </span>
                            )}
                            {edu.location && (
                              <div className="flex items-center space-x-1 text-sm text-muted">
                                <MapPin
                                  className="w-4 h-4"
                                  aria-hidden="true"
                                />
                                <span>{edu.location}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 mb-2">
                            {edu.gpa && (
                              <Badge variant="secondary" className="text-xs">
                                GPA: {edu.gpa}
                              </Badge>
                            )}
                            {edu.grade && (
                              <Badge variant="secondary" className="text-xs">
                                {edu.grade}
                              </Badge>
                            )}
                          </div>
                          {edu.description && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {edu.description}
                            </p>
                          )}
                          {edu.activities && edu.activities.length > 0 && (
                            <ul className="space-y-1" role="list">
                              {edu.activities.map((activity, actIndex) => (
                                <li
                                  key={actIndex}
                                  className="flex items-start space-x-2"
                                >
                                  <div className="w-1 h-1 bg-accent rounded-full mt-2 flex-shrink-0" />
                                  <span className="text-sm text-muted-foreground">
                                    {activity}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Certifications */}
            {certifications.length > 0 && (
              <Card className="card-neural neural-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-6 h-6 text-warning" />
                    <span>Certifications</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3" role="list">
                    {certifications.map((cert) => {
                      const expired = isCertificationExpired(
                        cert.expiry_date,
                        cert.does_not_expire
                      );
                      return (
                        <li
                          key={cert.id}
                          className="flex items-start space-x-2"
                        >
                          <div className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0" />
                          <div className="flex-1">
                            {cert.credential_url ? (
                              <a
                                href={cert.credential_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-muted-foreground hover:text-foreground hover:underline flex items-center gap-1"
                              >
                                {cert.name}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                {cert.name}
                              </span>
                            )}
                            <div className="text-xs text-muted mt-1">
                              {cert.issuing_organization}
                            </div>
                            {cert.issue_date && (
                              <div className="text-xs text-muted mt-1">
                                Issued{" "}
                                {formatCertificationDate(cert.issue_date)}
                                {cert.does_not_expire
                                  ? " • No Expiration"
                                  : cert.expiry_date
                                    ? ` • ${
                                        expired ? "Expired" : "Expires"
                                      } ${formatCertificationDate(
                                        cert.expiry_date
                                      )}`
                                    : ""}
                              </div>
                            )}
                            {expired && (
                              <Badge
                                variant="destructive"
                                className="text-xs mt-1"
                              >
                                Expired
                              </Badge>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            {stats.show_resume_stats && (
              <Card className="card-neural neural-glow">
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stats.years_of_experience !== undefined &&
                    stats.years_of_experience > 0 && (
                      <div className="text-center">
                        <div className="text-3xl font-bold text-secondary mb-1">
                          {stats.years_of_experience}+
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Years Experience
                        </div>
                      </div>
                    )}
                  {stats.projects_completed !== undefined &&
                    stats.projects_completed > 0 && (
                      <div className="text-center">
                        <div className="text-3xl font-bold text-accent mb-1">
                          {stats.projects_completed}+
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Projects Completed
                        </div>
                      </div>
                    )}
                  {stats.technologies_mastered !== undefined &&
                    stats.technologies_mastered > 0 && (
                      <div className="text-center">
                        <div className="text-3xl font-bold text-warning mb-1">
                          {stats.technologies_mastered}+
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Technologies Mastered
                        </div>
                      </div>
                    )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resume;
