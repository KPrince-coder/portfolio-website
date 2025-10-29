import React, { useState } from "react";
import { Plus, Trash2, Edit2, Save, X, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { ImpactMetric, ImpactMetricsSectionProps } from "./types";

const ImpactMetricsSection: React.FC<ImpactMetricsSectionProps> = ({
  formData,
  onInputChange,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newMetric, setNewMetric] = useState<ImpactMetric>({
    label: "",
    value: "",
  });

  const metrics = (formData.impact_metrics as unknown as ImpactMetric[]) || [];

  const handleAddMetric = () => {
    if (!newMetric.label || !newMetric.value) {
      return;
    }

    onInputChange("impact_metrics", [...metrics, newMetric]);
    setNewMetric({ label: "", value: "" });
  };

  const handleUpdateMetric = (index: number) => {
    const updated = [...metrics];
    updated[index] = newMetric;
    onInputChange("impact_metrics", updated);
    setEditingIndex(null);
    setNewMetric({ label: "", value: "" });
  };

  const handleEditMetric = (index: number) => {
    setEditingIndex(index);
    setNewMetric(metrics[index]);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setNewMetric({ label: "", value: "" });
  };

  const handleRemoveMetric = (index: number) => {
    onInputChange(
      "impact_metrics",
      metrics.filter((_, i) => i !== index)
    );
  };

  return (
    <Card className="card-neural">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5" />
          <span>Impact Metrics</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Metrics */}
        <div className="grid md:grid-cols-2 gap-3">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="p-4 border border-border rounded-lg bg-muted/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-2xl font-bold text-neural mb-1">
                    {metric.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {metric.label}
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditMetric(index)}
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveMetric(index)}
                    className="text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Form */}
        <div className="p-4 border-2 border-dashed border-border rounded-lg space-y-3">
          <h4 className="font-medium text-sm">
            {editingIndex !== null ? "Edit Metric" : "Add New Metric"}
          </h4>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="metric_value">Value</Label>
              <Input
                id="metric_value"
                value={newMetric.value}
                onChange={(e) =>
                  setNewMetric({ ...newMetric, value: e.target.value })
                }
                placeholder="50+"
              />
              <p className="text-xs text-muted-foreground mt-1">
                e.g., 50+, 100K, 5 years
              </p>
            </div>
            <div>
              <Label htmlFor="metric_label">Label</Label>
              <Input
                id="metric_label"
                value={newMetric.label}
                onChange={(e) =>
                  setNewMetric({ ...newMetric, label: e.target.value })
                }
                placeholder="AI Models Deployed"
              />
            </div>
          </div>

          <div className="flex space-x-2">
            {editingIndex !== null ? (
              <>
                <Button
                  size="sm"
                  onClick={() => handleUpdateMetric(editingIndex)}
                >
                  <Save className="w-3 h-3 mr-1" />
                  Update
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                  <X className="w-3 h-3 mr-1" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={handleAddMetric}>
                <Plus className="w-3 h-3 mr-1" />
                Add Metric
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImpactMetricsSection;
