import React from "react";
import { User, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ProfileCardProps {
  avatarUrl: string;
  fullName: string;
  location: string | null;
  bio: string | null;
  highlights: string[];
}

/**
 * ProfileCard Component
 * Displays avatar, bio, and key highlights
 */
const ProfileCard: React.FC<ProfileCardProps> = ({
  avatarUrl,
  fullName,
  location,
  bio,
  highlights,
}) => {
  return (
    <div className="mb-16">
      <Card className="card-neural neural-glow max-w-5xl mx-auto">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-[minmax(280px,320px)_1fr] lg:grid-cols-[minmax(320px,380px)_1fr] xl:grid-cols-[minmax(400px,460px)_1fr] 2xl:grid-cols-[minmax(480px,540px)_1fr] gap-0">
            {/* Avatar Side */}
            <div className="relative bg-gradient-to-br from-secondary/20 via-accent/20 to-neural/20 p-8 flex items-center justify-center">
              <div className="relative">
                {/* Decorative rings */}
                <div className="absolute inset-0 rounded-full bg-gradient-neural opacity-20 blur-xl animate-pulse"></div>
                <div className="absolute -inset-4 rounded-full border-2 border-secondary/30"></div>
                <div className="absolute -inset-8 rounded-full border border-accent/20"></div>

                {/* Avatar */}
                <div className="relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 xl:w-80 xl:h-80 2xl:w-96 2xl:h-96 rounded-full overflow-hidden border-4 border-background shadow-2xl">
                  <img
                    src={avatarUrl}
                    alt={`${fullName} - Professional headshot`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    width="384"
                    height="384"
                  />
                </div>
              </div>
            </div>

            {/* Info Side */}
            <div className="p-8 flex flex-col justify-center">
              <div className="flex items-center space-x-2 mb-4">
                <User className="w-5 h-5 text-secondary" />
                <h3 className="text-2xl font-bold text-neural">{fullName}</h3>
              </div>

              {location && (
                <div className="flex items-center space-x-2 text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{location}</span>
                </div>
              )}

              {bio && (
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {bio}
                </p>
              )}

              {highlights && highlights.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground mb-3">
                    Key Highlights
                  </h4>
                  <div className="grid gap-2">
                    {highlights.slice(0, 4).map((highlight, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-muted-foreground">
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default React.memo(ProfileCard);
