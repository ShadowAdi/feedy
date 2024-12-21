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
import { Input, Textarea } from "@nextui-org/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@nextui-org/button";
import { useState } from "react";
import { CreateProject } from "@/lib/appWriteHandlers";
import { useGlobalContext } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  project_name: z.string().min(2).max(50),
  project_url: z.string().url(),
  project_description: z.string().optional(),
});

const CreatePage = () => {
  const { user } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project_description: "",
      project_name: "",
      project_url: "",
    },
  });
  const { toast } = useToast();

  const createProject = async (
    project_url: string,
    project_description: string,
    project_name: string
  ) => {
    if (user) {
      const { message, success, error, projectId } = await CreateProject({
        project_name: project_name,
        project_url: project_url,
        project_description: project_description || "",
        userId: user.$id,
      });
      if (!success) {
        console.log("Error: ", error);
        console.log("Message: ", message);
        toast({
          title: "Project Creation Failed",
          description: `${error} ${message}`,
        });
      } else {
        toast({
          title: "Project Created",
          description: message,
        });
        window.location.href = `/dashboard/`;
      }
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    createProject(
      values.project_url,
      values.project_description || "",
      values.project_name
    );
    setIsLoading(false);
  }

  return (
    <main className="h-full flex flex-col w-[60%] mx-auto gap-9 items-center justify-center">
      <h1 className="text-3xl font-semibold">Create Project</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          {/* Project Name Field */}
          <FormField
            control={form.control}
            name="project_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input placeholder="Project Name" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display project name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Project Description Field */}
          <FormField
            control={form.control}
            name="project_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Project description" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display project description.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Project URL Field */}
          <FormField
            control={form.control}
            name="project_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project URL</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="http://" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Widget Position Select Field */}
        

          {/* Submit Button */}
          <Button
            disabled={isLoading}
            className="w-[120px] hover:bg-[#beb8b8] py-6  rounded-full"
            type="submit"
          >
            <span className="text-lg font-medium">Submit</span>
          </Button>
        </form>
      </Form>
    </main>
  );
};

export default CreatePage;
