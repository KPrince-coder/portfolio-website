import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings2, Palette, Globe, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const PreferencesSection: React.FC = () => {
  const { toast } = useToast();
  const [theme, setTheme] = useState<string>("system");
  const [language, setLanguage] = useState<string>("en");
  const [timezone, setTimezone] = useState<string>("UTC");
  const [dateFormat, setDateFormat] = useState<string>("MM/DD/YYYY");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Load preferences from localStorage
    const savedTheme = localStorage.getItem("admin-theme") || "system";
    const savedLanguage = localStorage.getItem("admin-language") || "en";
    const savedTimezone = localStorage.getItem("admin-timezone") || "UTC";
    const savedDateFormat =
      localStorage.getItem("admin-dateFormat") || "MM/DD/YYYY";

    setTheme(savedTheme);
    setLanguage(savedLanguage);
    setTimezone(savedTimezone);
    setDateFormat(savedDateFormat);
  }, []);

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem("admin-theme", theme);
    localStorage.setItem("admin-language", language);
    localStorage.setItem("admin-timezone", timezone);
    localStorage.setItem("admin-dateFormat", dateFormat);

    // Apply theme
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // System preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }

    setHasChanges(false);
    toast({
      title: "Preferences saved",
      description: "Your preferences have been updated successfully",
    });
  };

  const handleReset = () => {
    setTheme("system");
    setLanguage("en");
    setTimezone("UTC");
    setDateFormat("MM/DD/YYYY");
    setHasChanges(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Palette className="w-5 h-5 text-primary" />
            <CardTitle>Appearance</CardTitle>
          </div>
          <CardDescription>
            Customize how the admin panel looks and feels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select
              value={theme}
              onValueChange={(value) => {
                setTheme(value);
                setHasChanges(true);
              }}
            >
              <SelectTrigger id="theme">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Choose your preferred color scheme
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-primary" />
            <CardTitle>Localization</CardTitle>
          </div>
          <CardDescription>
            Set your language and regional preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select
              value={language}
              onValueChange={(value) => {
                setLanguage(value);
                setHasChanges(true);
              }}
            >
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="pt">Português</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select
              value={timezone}
              onValueChange={(value) => {
                setTimezone(value);
                setHasChanges(true);
              }}
            >
              <SelectTrigger id="timezone">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                <SelectItem value="America/New_York">
                  Eastern Time (GMT-5)
                </SelectItem>
                <SelectItem value="America/Chicago">
                  Central Time (GMT-6)
                </SelectItem>
                <SelectItem value="America/Denver">
                  Mountain Time (GMT-7)
                </SelectItem>
                <SelectItem value="America/Los_Angeles">
                  Pacific Time (GMT-8)
                </SelectItem>
                <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                <SelectItem value="Europe/Paris">Paris (GMT+1)</SelectItem>
                <SelectItem value="Asia/Tokyo">Tokyo (GMT+9)</SelectItem>
                <SelectItem value="Australia/Sydney">
                  Sydney (GMT+10)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-primary" />
            <CardTitle>Date & Time Format</CardTitle>
          </div>
          <CardDescription>
            Choose how dates and times are displayed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date-format">Date Format</Label>
            <Select
              value={dateFormat}
              onValueChange={(value) => {
                setDateFormat(value);
                setHasChanges(true);
              }}
            >
              <SelectTrigger id="date-format">
                <SelectValue placeholder="Select date format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MM/DD/YYYY">
                  MM/DD/YYYY (12/31/2024)
                </SelectItem>
                <SelectItem value="DD/MM/YYYY">
                  DD/MM/YYYY (31/12/2024)
                </SelectItem>
                <SelectItem value="YYYY-MM-DD">
                  YYYY-MM-DD (2024-12-31)
                </SelectItem>
                <SelectItem value="DD MMM YYYY">
                  DD MMM YYYY (31 Dec 2024)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handleReset} disabled={!hasChanges}>
          Reset to Defaults
        </Button>
        <Button onClick={handleSave} disabled={!hasChanges}>
          Save Preferences
        </Button>
      </div>
    </div>
  );
};
