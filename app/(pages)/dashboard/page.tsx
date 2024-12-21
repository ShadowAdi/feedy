import ProjectsComponent from "@/components/projectsComponent";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const Dashboard = () => {
  return (
    <main className="w-[90%] flex flex-col min-h-[80vh]  px-5 py-7 mx-auto mt-5 ">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-4xl font-semibold">Projects</h1>
        <Link href={"/dashboard/create"}>
        <Button variant="ghost" className="px-10 rounded-full py-8">
          <span className="text-lg font-semibold rounded-full">
            Create Project
          </span>
          <PlusIcon size={20}/>
        </Button>
        </Link>
      </div>
      <Divider className="my-4" />
      <ProjectsComponent />
    </main>
  );
};

export default Dashboard;
