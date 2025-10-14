import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const objectiveSchema = z.object({
  title: z.string().trim().min(3, { message: "Title must be at least 3 characters" }).max(100, { message: "Title must be less than 100 characters" }),
  description: z.string().trim().max(500, { message: "Description must be less than 500 characters" }).optional(),
  owner: z.string().trim().min(2, { message: "Owner must be at least 2 characters" }).max(100, { message: "Owner must be less than 100 characters" }),
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().min(1, { message: "End date is required" }),
  status: z.enum(["todo", "in-progress", "in-review", "blocked", "done"]),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end >= start;
}, {
  message: "End date must be after or equal to start date",
  path: ["endDate"],
});

type ObjectiveFormValues = z.infer<typeof objectiveSchema>;

interface AddObjectiveFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddObjectiveForm({ onSuccess, onCancel }: AddObjectiveFormProps) {
  const form = useForm<ObjectiveFormValues>({
    resolver: zodResolver(objectiveSchema),
    defaultValues: {
      title: "",
      description: "",
      owner: "",
      startDate: "",
      endDate: "",
      status: "todo",
    },
  });

  function onSubmit(data: ObjectiveFormValues) {
    const startYear = new Date(data.startDate).getFullYear();
    const endYear = new Date(data.endDate).getFullYear();
    const yearSpan = endYear - startYear + 1;
    
    console.log("New objective:", {
      ...data,
      yearSpan,
      years: `${startYear}-${endYear}`
    });
    
    toast.success(`Objective added successfully! (${yearSpan} year${yearSpan > 1 ? 's' : ''})`);
    onSuccess();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Objective Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Expand to new markets" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Objective description..." rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="owner"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Owner</FormLabel>
              <FormControl>
                <Input placeholder="Owner name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="in-review">In Review</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Add Objective</Button>
        </div>
      </form>
    </Form>
  );
}
