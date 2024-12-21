"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGlobalContext } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { GetUserProjects } from "@/lib/appWriteHandlers";
import { Card } from "@nextui-org/card";
import { Briefcase } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const { user } = useGlobalContext();

  const { toast } = useToast();
  const [totalProjects, setTotalProjects] = useState(0);
  const getUserProjects = async () => {
    try {
      if (user) {
        const { success, error, totalProjects } = await GetUserProjects(
          user?.$id
        );
        if (!success) {
          toast({
            title: "Failed to get projects",
            description: error,
          });
        } else {
          if (totalProjects) {
            setTotalProjects(totalProjects);
          }
        }
      }
    } catch (error: any) {
      toast({
        title: "Failed to gey Projects",
        description: error,
      });
    }
  };
  useEffect(() => {
    getUserProjects();
  }, [user]);

  return (
    <main className="  py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Profile Card */}
        <Card className="bg-[#f3f3f3] border-2 border-stone-950/10 shadow-sm p-8">
          <div className="flex flex-col items-center space-y-6">
            {/* Avatar Section */}
            <div className="relative">
              <Avatar className="w-32 h-32">
                {user?.avatar && <AvatarImage src={user?.avatar} />}
                <AvatarFallback>{user?.username.slice(0, 3)}</AvatarFallback>
              </Avatar>
            </div>

            {/* Name and Email */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {user?.username}
              </h1>
              <p className="text-gray-500 mt-1">{user?.email}</p>
            </div>

            {/* Project Count Badge */}
            <Badge
              className="px-4 py-2   border
             border-blue-100 flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              {totalProjects === 1 ? "Project" : "Projects"}
            </Badge>

            {/* Bio Section */}
            {user?.bio && (
              <div className="w-full max-w-lg">
                <p className="text-gray-600 text-center leading-relaxed">
                  {user.bio}
                </p>
              </div>
            )}

            {/* Edit Profile Button */}
            <Link href={`/profile/update`}>
              <Button
                className="mt-4 px-6 py-2 bg-gray-900
               text-white rounded-md hover:bg-gray-800 transition-colors duration-200"
              >
                Edit Profile
              </Button>
            </Link>
          </div>
        </Card>

        {/* Stats Section */}
        <div className="mt-8 flex items-center justify-center ">
          <Card className="p-6 bg-gradient-to-br px-14  bg-neutral-100">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">
                Active Projects
              </h3>
              <p className="mt-2 text-3xl font-semibold text-black">
                {totalProjects}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
