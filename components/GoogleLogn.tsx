import React from "react";
import { Button } from "./ui/button";
import { loginWithGoogle } from "@/lib/appWriteHandlers";
import { useToast } from "@/hooks/use-toast";

const GoogleLogn = () => {
  const { toast } = useToast();
  const onGoogleLogin = async () => {
    const { message, error, success, session } = await loginWithGoogle();
    console.log("Sessin: ", session);
    if (!success) {
      toast({
        title: "Failed to Login with google",
        description: `${message} ${error}`,
      });
    }
    toast({
      title: "Google Login Successfull",
      description: message,
    });
  };
  return (
    <Button className="flex px-6 py-4 rounded-md" onClick={onGoogleLogin}>
      Google Login
    </Button>
  );
};

export default GoogleLogn;
