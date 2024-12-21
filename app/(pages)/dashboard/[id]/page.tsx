"use client";

import { useToast } from "@/hooks/use-toast";
import { DeleteProject, GetProject } from "@/lib/appWriteHandlers";
import { ProjectType, tableColumns } from "@/lib/types";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import { Snippet } from "@nextui-org/snippet";
import { Divider } from "@nextui-org/divider";
import { Chip } from "@nextui-org/chip";
import TableData from "@/components/TableData";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const SingleProject = () => {

  const [project, setProject] = useState<ProjectType | null>(null);

  const [loading, setLoading] = useState(false);
  const params = useParams();
  const projectId = Array.isArray(params.id) ? params.id[0] : params.id; // Ensure projectId is a string
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
      setProject(project);
    }
  };

  const copyUrl =
    `${process.env.NEXT_PUBLIC_FRONTEND_URL}/feedbacks/create/${projectId}
  `.trim();

  useEffect(() => {
    setLoading(true);
    if (projectId) {
      GetProjectById(projectId)
        .catch((error) => {
          console.error("Error fetching project:", error);
        })
        .finally(() => {
          ("");
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
      <main
        className="w-[90%] flex flex-col min-h-[80vh] items-center justify-center px-5 
      py-7 mx-auto mt-5"
      >
        <Spinner size="lg" color="default" label="Loading..." />;
      </main>
    );
  }

  const deleteProject = async () => {
    if (projectId) {
      const { message, success, error } = await DeleteProject({
        projectId: projectId,
      });
      if (success) {
        toast({
          title: "Deleted",
          description: message,
        });
        window.location.href = "/dashboard";
      } else {
        toast({
          title: "Failed to delete",
          description: `${message} ${error}`,
        });
      }
    }
    toast({
      title: "Failed to delete the project",
      description: "Project Id Not Found",
    });
  };

  return (
    <main
      className="w-[90%] flex flex-col items-start justify-start gap-6 min-h-[80vh]
     text-black px-5 py-7 mx-auto mt-5"
    >
      <div className="flex w-full justify-between">
        <div className="flex items-end gap-6">
          <span className="text-4xl font-semibold">
            {project?.project_name}
          </span>
        </div>

      
      </div>
      <div className="flex w-full justify-between">
        <Snippet className="bg-slate-200 text-black rounded-full">
          {project?.project_url}
        </Snippet>
      
      </div>
      <Divider />
      <div className="flex items-start flex-col gap-5 my-5">
        <p className="text-base text-stone-900 my-4">
          {project?.project_description}
        </p>
      </div>
      <div className="flex flex-col items-center w-full gap-10">
        <Snippet className="bg-slate-900 flex mx-auto  text-white rounded-sm ">
          {copyUrl}
        </Snippet>

        {projectId && (
          <TableData
            projectId={projectId}
            tableLabel="Table for ALl Feedbacks"
          />
        )}
      </div>

      <Divider className="my-4" />
      <div className="flex justify-between items-center w-full ">
        <Link href={`/dashboard/${projectId}/update`}>
          <Button
            className="w-[240px] flex items-center justify-center bg-stone-950 hover:bg-stone-900 py-8 px-8  gap-3
            rounded-full"
          >
            <span className="text-xl font-semibold">Update Project</span>
          </Button>
        </Link>
        <Button
          onClick={deleteProject}
          className="w-[240px] bg-red-500 text-white hover:bg-red-600 py-8 flex items-center
           justify-center gap-3  
          rounded-full"
        >
          <span className="text-xl font-semibold">Delete Project</span>
        </Button>
      </div>
    </main>
  );
};

export default SingleProject;
