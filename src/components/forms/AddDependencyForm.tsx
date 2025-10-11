import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const dependencySchema = z.object({
  type: z.enum(["blocks", "blocked-by", "relates-to", "depends-on", "required-by"], { 
    required_error: "Dependency type is required" 
  }),
  linkedEntity: z.string()
    .trim()
    .min(1, { message: "Linked entity is required" })
    .max(200, { message: "Linked entity must be less than 200 characters" }),
  linkedEntityType: z.enum(["project", "initiative", "task", "milestone"], { 
    required_error: "Entity type is required" 
  }),
  description: z.string()
    .trim()
    .max(500, { message: "Description must be less than 500 characters" })
    .optional(),
  externalUrl: z.string()
    .trim()
    .max(500, { message: "URL must be less than 500 characters" })
    .optional()
    .refine((val) => {
      if (!val || val === "") return true;
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    }, { message: "Invalid URL format" }),
});

interface AddDependencyFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AddDependencyForm = ({ onSuccess, onCancel }: AddDependencyFormProps) => {
  const [formData, setFormData] = useState({
    type: "",
    linkedEntity: "",
    linkedEntityType: "",
    description: "",
    externalUrl: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    try {
      setErrors({});
      dependencySchema.parse(formData);
      
      // In a real app, this would save to a database
      toast({
        title: "Success",
        description: "Dependency added successfully!",
      });
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
        toast({
          title: "Error",
          description: "Please fix the errors in the form",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dependency-type">Dependency Type *</Label>
          <Select 
            value={formData.type} 
            onValueChange={(value) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger id="dependency-type" className={errors.type ? "border-destructive" : ""}>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blocks">Blocks</SelectItem>
              <SelectItem value="blocked-by">Blocked By</SelectItem>
              <SelectItem value="relates-to">Relates To</SelectItem>
              <SelectItem value="depends-on">Depends On</SelectItem>
              <SelectItem value="required-by">Required By</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && (
            <p className="text-sm text-destructive">{errors.type}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="entity-type">Entity Type *</Label>
          <Select 
            value={formData.linkedEntityType} 
            onValueChange={(value) => setFormData({ ...formData, linkedEntityType: value })}
          >
            <SelectTrigger id="entity-type" className={errors.linkedEntityType ? "border-destructive" : ""}>
              <SelectValue placeholder="Select entity type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="project">Project</SelectItem>
              <SelectItem value="initiative">Initiative</SelectItem>
              <SelectItem value="task">Task</SelectItem>
              <SelectItem value="milestone">Milestone</SelectItem>
            </SelectContent>
          </Select>
          {errors.linkedEntityType && (
            <p className="text-sm text-destructive">{errors.linkedEntityType}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="linked-entity">Linked Entity Name *</Label>
        <Input
          id="linked-entity"
          value={formData.linkedEntity}
          onChange={(e) => setFormData({ ...formData, linkedEntity: e.target.value })}
          placeholder="Enter name of the linked item"
          className={errors.linkedEntity ? "border-destructive" : ""}
        />
        {errors.linkedEntity && (
          <p className="text-sm text-destructive">{errors.linkedEntity}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the relationship or dependency"
          rows={3}
          className={errors.description ? "border-destructive" : ""}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="external-url">External URL (Optional)</Label>
        <Input
          id="external-url"
          type="url"
          value={formData.externalUrl}
          onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
          placeholder="https://example.com/link"
          className={errors.externalUrl ? "border-destructive" : ""}
        />
        {errors.externalUrl && (
          <p className="text-sm text-destructive">{errors.externalUrl}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Link to external documentation, tickets, or related resources
        </p>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          Add Dependency
        </Button>
      </div>
    </div>
  );
};
