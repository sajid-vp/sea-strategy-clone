import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const riskSchema = z.object({
  description: z.string()
    .trim()
    .min(1, { message: "Description is required" })
    .max(500, { message: "Description must be less than 500 characters" }),
  likelihood: z.enum(["low", "medium", "high"], { required_error: "Likelihood is required" }),
  impact: z.enum(["low", "medium", "high"], { required_error: "Impact is required" }),
  mitigation: z.string()
    .trim()
    .min(1, { message: "Mitigation strategy is required" })
    .max(1000, { message: "Mitigation strategy must be less than 1000 characters" }),
  owner: z.string()
    .trim()
    .min(1, { message: "Owner is required" })
    .max(100, { message: "Owner name must be less than 100 characters" }),
});

interface AddRiskFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AddRiskForm = ({ onSuccess, onCancel }: AddRiskFormProps) => {
  const [formData, setFormData] = useState({
    description: "",
    likelihood: "",
    impact: "",
    mitigation: "",
    owner: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    try {
      setErrors({});
      riskSchema.parse(formData);
      
      // In a real app, this would save to a database
      toast.success("Risk added successfully!");
      onSuccess();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast.error("Please fix the errors in the form");
      }
    }
  };

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="risk-description">Risk Description *</Label>
        <Textarea
          id="risk-description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the potential risk"
          rows={3}
          className={errors.description ? "border-destructive" : ""}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="likelihood">Likelihood *</Label>
          <Select 
            value={formData.likelihood} 
            onValueChange={(value) => setFormData({ ...formData, likelihood: value })}
          >
            <SelectTrigger id="likelihood" className={errors.likelihood ? "border-destructive" : ""}>
              <SelectValue placeholder="Select likelihood" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          {errors.likelihood && (
            <p className="text-sm text-destructive">{errors.likelihood}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="impact">Impact *</Label>
          <Select 
            value={formData.impact} 
            onValueChange={(value) => setFormData({ ...formData, impact: value })}
          >
            <SelectTrigger id="impact" className={errors.impact ? "border-destructive" : ""}>
              <SelectValue placeholder="Select impact" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          {errors.impact && (
            <p className="text-sm text-destructive">{errors.impact}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mitigation">Mitigation Strategy *</Label>
        <Textarea
          id="mitigation"
          value={formData.mitigation}
          onChange={(e) => setFormData({ ...formData, mitigation: e.target.value })}
          placeholder="Describe how to mitigate this risk"
          rows={3}
          className={errors.mitigation ? "border-destructive" : ""}
        />
        {errors.mitigation && (
          <p className="text-sm text-destructive">{errors.mitigation}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="risk-owner">Risk Owner *</Label>
        <Input
          id="risk-owner"
          value={formData.owner}
          onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
          placeholder="Enter owner name"
          className={errors.owner ? "border-destructive" : ""}
        />
        {errors.owner && (
          <p className="text-sm text-destructive">{errors.owner}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          Add Risk
        </Button>
      </div>
    </div>
  );
};
