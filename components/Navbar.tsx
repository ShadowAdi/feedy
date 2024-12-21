"use client";

import { useGlobalContext } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { logout } from "@/lib/appWriteHandlers";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Navbar = () => {
  const { isLogged, user, setIsLogged, setUser } = useGlobalContext();
  const { toast } = useToast();

  if (isLogged === null) {
    return (
      <nav className="flex relative w-[80%] items-center justify-between py-8 mx-auto">
        <Link href={"/"}>
          <h1 className="text-5xl font-semibold">Feedy</h1>
        </Link>
        <Button isLoading={true} className="w-[150px] py-8 rounded-full">
          <span className="text-xl">Loading...</span>
        </Button>
      </nav>
    );
  }

  const LogoutButton = async () => {
    try {
      const { message, success, error } = await logout();
      if (!success) {
        toast({
          title: "Logging Out Failed",
          description: "Failed to Log out your account " + error,
          variant: "destructive",
        });
      }
      setIsLogged(false);
      setUser(null);
      toast({
        title: "Successfully Logout",
        variant: "default",
        description: message,
      });

      window.location.href = "/login";
    } catch (error: any) {
      console.log("Error in logging out: ", error);
      toast({
        title: "Logout Failed",
        description: "Failed to loggoing out " + error,
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="flex relative w-[90%] items-center justify-between py-8 mx-auto">
      <Link href={"/"}>
        <h1 className="text-5xl font-semibold">Feedy</h1>
      </Link>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="py-4 px-10 bg-[#dadada] rounded-full">
            <span className="text-2xl font-medium">Profile</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[300px]"
            aria-label="Static Actions"
          >
            <DropdownMenuItem className="cursor-pointer" key="profile">
              <Link href={"/profile"}>Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" key="dashbaorf">
              <Link href={"/dashboard"}>dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" key="create">
              <Link href={"/dashboard/create"}>Create Project</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => LogoutButton()}
              key="logout"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex gap-5 items-center">
          <Button
            color="secondary"
            className="w-[150px] bg-black text-white py-8 rounded-full"
          >
            <span className="text-2xl">Signin</span>
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
