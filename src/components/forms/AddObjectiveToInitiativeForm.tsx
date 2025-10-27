import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const objectiveSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(100, { message: "Title must be less than 100 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(500, { message: "Description must be less than 500 characters" }),
  year: z
    .number()
    .min(2024, { message: "Year must be 2024 or later" })
    .max(2030, { message: "Year must be 2030 or earlier" }),
  owner: z
    .string()
    .min(2, { message: "Owner name must be at least 2 characters" })
    .max(100, { message: "Owner name must be less than 100 characters" }),
});

type ObjectiveFormValues = z.infer<typeof objectiveSchema>;

interface AddObjectiveToInitiativeFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initiativeId: number;
}

export function AddObjectiveToInitiativeForm({
  onSuccess,
  onCancel,
  initiativeId,
}: AddObjectiveToInitiativeFormProps) {
  const { toast } = useToast();
  
  const form = useForm<ObjectiveFormValues>({
    resolver: zodResolver(objectiveSchema),
    defaultValues: {
      title: "",
      description: "",
      year: new Date().getFullYear(),
      owner: "",
    },
  });

  const onSubmit = (data: ObjectiveFormValues) => {
    console.log("Creating objective for initiative:", initiativeId, data);
    
    toast({
      title: "Objective Created",
      description: `"${data.title}" has been added to the initiative`,
    });

    onSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Objective Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter objective title" {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe what this objective aims to achieve"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Year</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={2024}
                  max={2030}
                  placeholder="2025"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
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
              <FormLabel>Objective Owner</FormLabel>
              <FormControl>
                <Input placeholder="Enter owner name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Add Objective</Button>
        </div>
      </form>
    </Form>
  );
}
