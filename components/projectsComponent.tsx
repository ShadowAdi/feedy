"use client";
import { useToast } from "@/hooks/use-toast";
import { GetAllProjects } from "@/lib/appWriteHandlers";
import { ProjectType } from "@/lib/types";
import { Snippet } from "@nextui-org/snippet";
import { Chip } from "@nextui-org/chip";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import Link from "next/link";
import { useGlobalContext } from "@/context/UserContext";
const ProjectsComponent = () => {
  const { user } = useGlobalContext();
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalProjects, setTotalProjects] = useState<number | undefined>(0);
  const { toast } = useToast();

  const getAllProjects = async () => {
    setLoading(true);
    if (user) {
      const { message, success, allProjects, error, totalProjects } =
        await GetAllProjects(user.$id);
        console.log(allProjects)
      if (!success) {
        toast({
          title: "Failed to Get Projects",
          description: `The message is this ${message} and the error is ${error}`,
          variant: "destructive",
        });
        setProjects([]);
      }
      if (allProjects) {
        setProjects(allProjects);
      }
      setTotalProjects(totalProjects);
    }
    setLoading(false)
  };

  useEffect(() => {
    getAllProjects();
  }, [user?.$id]);

  if (loading) {
    return (
      <section className="w-full flex items-center justify-center py-6 px-4">
        <Spinner size="lg" color="default" label="Loading..." />;
      </section>
    );
  }

  if (totalProjects === 0) {
    return (
      <section className="w-full gap-8 grid my-4 grid-cols-1  sm:grid-cols-3 lg:grid-cols-4">
        <Card
          className="border-stone-800/20 border  flex items-center justify-center bg-[#f8f7f7]"
          radius="lg"
        >
          <CardBody className="flex items-center justify-center w-full py-6">
            <h2 className="text-lg font-semibold">No Project Exists</h2>
          </CardBody>
        </Card>
      </section>
    );
  }

  return (
    <section className="w-full gap-6 grid my-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {projects.map((project, i) => {
        return (
          <Card
            key={i}
            className="border-stone-800/20 border bg-[#f8f7f7]"
            radius="lg"
          >
            <CardHeader className="flex gap-3 py-5 w-full justify-between items-center">
              <div className="flex flex-col gap-1">
                <p className="text-xl font-medium">{project.project_name}</p>
              </div>
              
            </CardHeader>
            <Divider />
            <CardBody className="flex flex-col gap-2">
              <p>{project.project_description}</p>
              <Snippet className="bg-slate-200 text-black rounded-full overflow-hidden">
                {project.project_url}
              </Snippet>
            </CardBody>
            <CardFooter className="flex w-full ">
              <Link href={`/dashboard/${project.$id}`}>
                <Button className="rounded-full py-5 px-8 " variant="ghost">
                  <span className="text-lg font-medium">Details</span>
                </Button>
              </Link>
            </CardFooter>
          </Card>
        );
      })}
    </section>
  );
};

export default ProjectsComponent;
