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
import { useEffect, useState } from "react";
import { useGlobalContext } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { GetProject, UpdateProject } from "@/lib/appWriteHandlers";
import { ProjectType } from "@/lib/types";
import { Spinner } from "@nextui-org/spinner";
import { useParams } from "next/navigation";


const formSchema = z.object({
  project_name: z.string().min(2).max(50),
  project_url: z.string().url(),
  project_description: z.string().optional(),
});

const UpdatePage = () => {
  const { user, isLogged } = useGlobalContext();
  if (!isLogged) {
    window.location.href = "/login";
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project_description: "",
      project_name: "",
      project_url: "",
    },
  });
  const { setValue } = form;
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const projectId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { toast } = useToast();

  const GetProjectById = async (projectId: string) => {
    const { success, error, project } = await GetProject({
      projectId: projectId,
    });
    if (!success) {
      toast({
        title: "Failed to get the project",
        description: `${error}`,
      });
    }
    if (project) {
      // Populate form fields with fetched data
      setValue("project_name", project.project_name);
      setValue("project_url", project.project_url);
      setValue("project_description", project.project_description || "");
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    if (user) {
      const { success, message, error } = await UpdateProject({
        ...data,
        projectId: projectId!,
        userId: user?.$id,
      });
      setLoading(false);

      if (success) {
        toast({
          title: "Project Updated",
          description: message,
        });
        window.location.href = "/dashboard";
      } else {
        toast({
          title: "Update Failed",
          description: error || message,
          variant: "destructive",
        });
      }
    } else {
      setLoading(false);
      toast({
        title: "User Not Found",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    setLoading(true);
    if (projectId) {
      GetProjectById(projectId)
        .catch((error) => {
          console.error("Error fetching project:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      toast({
        title: "Failed to get the project ID",
        variant: "destructive",
      });
      setLoading(false);
    }
  }, [projectId]);

  if (loading) {
    return (
      <main className="w-[90%] flex flex-col min-h-[80vh] items-center justify-center px-5 py-7 mx-auto mt-5">
        <Spinner size="lg" color="default" label="Loading..." />;
      </main>
    );
  }

  return (
    <main className="h-full flex flex-col w-[60%] mx-auto gap-9 items-center justify-center">
      <h1 className="text-3xl font-semibold">Update Project</h1>
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
            disabled={loading}
            className="w-[120px] hover:bg-[#beb8b8] py-6 rounded-full"
            type="submit"
          >
            <span className="text-lg font-medium">
              {loading ? "Saving..." : "Submit"}
            </span>
          </Button>
        </form>
      </Form>
    </main>
  );
};

export default UpdatePage;
