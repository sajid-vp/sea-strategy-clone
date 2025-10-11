import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const issueSchema = z.object({
  description: z.string()
    .trim()
    .min(1, { message: "Description is required" })
    .max(500, { message: "Description must be less than 500 characters" }),
  priority: z.enum(["low", "medium", "high", "critical"], { required_error: "Priority is required" }),
  resolution: z.string()
    .trim()
    .min(1, { message: "Resolution plan is required" })
    .max(1000, { message: "Resolution plan must be less than 1000 characters" }),
  owner: z.string()
    .trim()
    .min(1, { message: "Owner is required" })
    .max(100, { message: "Owner name must be less than 100 characters" }),
  dueDate: z.string()
    .min(1, { message: "Due date is required" }),
});

interface AddIssueFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AddIssueForm = ({ onSuccess, onCancel }: AddIssueFormProps) => {
  const [formData, setFormData] = useState({
    description: "",
    priority: "",
    resolution: "",
    owner: "",
    dueDate: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    try {
      setErrors({});
      issueSchema.parse(formData);
      
      // In a real app, this would save to a database
      toast.success("Issue added successfully!");
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
        <Label htmlFor="issue-description">Issue Description *</Label>
        <Textarea
          id="issue-description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the issue"
          rows={3}
          className={errors.description ? "border-destructive" : ""}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="priority">Priority *</Label>
          <Select 
            value={formData.priority} 
            onValueChange={(value) => setFormData({ ...formData, priority: value })}
          >
            <SelectTrigger id="priority" className={errors.priority ? "border-destructive" : ""}>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
          {errors.priority && (
            <p className="text-sm text-destructive">{errors.priority}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date *</Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className={errors.dueDate ? "border-destructive" : ""}
          />
          {errors.dueDate && (
            <p className="text-sm text-destructive">{errors.dueDate}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="resolution">Resolution Plan *</Label>
        <Textarea
          id="resolution"
          value={formData.resolution}
          onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
          placeholder="Describe the resolution plan"
          rows={3}
          className={errors.resolution ? "border-destructive" : ""}
        />
        {errors.resolution && (
          <p className="text-sm text-destructive">{errors.resolution}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="issue-owner">Issue Owner *</Label>
        <Input
          id="issue-owner"
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
          Add Issue
        </Button>
      </div>
    </div>
  );
};
