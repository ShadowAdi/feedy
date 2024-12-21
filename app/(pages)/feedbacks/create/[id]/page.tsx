"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@nextui-org/button";
import { useState } from "react";
import { CreateFeedback } from "@/lib/appWriteHandlers";
import { useGlobalContext } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Define enums for feedback type and status
export enum FeedbackType {
  BUG = "bug",
  GENERAL_INFORMATION = "generalInformation",
  FEATURE = "feature",
}

export enum FeedbackStatus {
  NEW = "new",
  IN_PROGRESS = "inProgress",
  RESOLVED = "resolved",
}

const formSchema = z.object({
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  feedback_type: z.nativeEnum(FeedbackType),
  rating: z.number().min(1).max(5),
  username: z.string(),
  userEmail: z.string(),
  pageUrl: z.string().url(),
});

const SubmitFeedback = () => {
  const { user } = useGlobalContext();

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const params = useParams();
  const projectId = params.id as string;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      feedback_type: FeedbackType.GENERAL_INFORMATION,
      rating: 3,
      pageUrl: "",
      userEmail: "",
      username: "",
    },
  });

  const submitFeedback = async (values: z.infer<typeof formSchema>) => {
 

    try {
      const response = await CreateFeedback({
        description: values.description,
        username: values.username || "",
        userEmail: values.userEmail || "",
        page_url: values.pageUrl,
        feedback_type: values.feedback_type,
        status: FeedbackStatus.NEW,
        rating: values.rating,
        project_id: projectId,
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      toast({
        title: "Success",
        description: "Feedback submitted successfully",
      });

      // Reset form
      form.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit feedback",
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    await submitFeedback(values);
    setIsLoading(false);
  };

  return (
    <main className="w-[60%] flex flex-col items-start justify-start gap-6 min-h-[80vh] text-black px-5 py-7 mx-auto mt-5">
      <h1 className="text-3xl font-semibold">Submit Feedback</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="feedback_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Feedback Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select feedback type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={FeedbackType.BUG}>
                        Bug Report
                      </SelectItem>
                      <SelectItem value={FeedbackType.GENERAL_INFORMATION}>
                        General Information
                      </SelectItem>
                      <SelectItem value={FeedbackType.FEATURE}>
                        Feature Request
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  Select the type of feedback you want to provide
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Page Url</FormLabel>
                <FormControl>
                  <Input placeholder="Page Url" {...field} />
                </FormControl>
                <FormDescription>Page Where you have issue</FormDescription>
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
                  <Textarea placeholder="Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description Field */}
          <FormField
            control={form.control}
            name="userEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Name</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Rating Field */}
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormDescription>Rate from 1 to 5 stars</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            disabled={isLoading}
            className="w-[120px] hover:bg-[#beb8b8] py-6 rounded-full"
            type="submit"
          >
            <span className="text-lg font-medium">
              {isLoading ? "Submitting..." : "Submit"}
            </span>
          </Button>
        </form>
      </Form>
    </main>
  );
};

export default SubmitFeedback;
