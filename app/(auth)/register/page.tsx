"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@nextui-org/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { createUser } from "@/lib/appWriteHandlers";
import { useToast } from "@/hooks/use-toast";
import { useGlobalContext } from "@/context/UserContext";
import { uploadAvatar } from "@/lib/uploadFile";
import { Divider } from "@nextui-org/divider";
import Link from "next/link";

// Define the form schema with proper types
const formSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(8, { message: "Must be more than 8 characters" }),
  email: z.string().email({ message: "Pass a valid Mail" }),
  bio: z.string().optional(),
  avatar: z
    .custom<FileList>()
    .optional()
    .transform((val) => (val && val.length > 0 ? val[0] : undefined)),
});

// Define type for form values
type FormValues = z.infer<typeof formSchema>;

const Register = () => {
  const { setUser, setIsLogged, isLogged } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  if (isLogged) {
    window.location.href = "/dashboard";
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      bio: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    let avatarUrl = "";

    // Handle file upload if avatar is provided
    if (values.avatar) {
      const uploadResult = await uploadAvatar(values.avatar);

      if (!uploadResult.success) {
        toast.toast({
          title: "Error uploading avatar",
          description: uploadResult.error,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      avatarUrl = uploadResult.fileUrl || "";
    }

    const { message, success, error, user, session } = await createUser({
      avatar: avatarUrl,
      email: values.email,
      password: values.password,
      username: values.username,
      bio: values.bio || "",
    });

    if (!success) {
      console.log(error);
      toast.toast({
        title: message,
        description: `This is the following error: ${error}`,
        variant: "destructive",
      });
    } else {
      setIsLogged(true);
      setUser(user);
      toast.toast({
        title: message,
      });
      window.location.href = "/dashboard";
    }

    setIsSubmitting(false);
  }

  return (
    <main className="w-[60%] mx-auto py-6 px-8 gap-4 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Create Your Account</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          {/* Username, email, password, and bio fields remain the same */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="adi@gmail.com" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display Email.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="****" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display Password.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Adi" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea type="text" placeholder="Goog Bio" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="avatar"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Avatar</FormLabel>
                <FormControl></FormControl>
                <FormDescription>
                  Upload your profile picture (max 5MB)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="avatar"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Avatar</FormLabel>
                <FormControl>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files?.length) {
                        onChange(files);
                      }
                    }}
                    className="flex w-full bg-default-100 rounded-medium min-h-unit-10 flex-col items-center justify-center gap-2 border-2 border-dashed border-default-300 p-4 text-foreground"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Upload your profile picture (max 5MB)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={isSubmitting}
            className="w-[120px] hover:bg-[#beb8b8] py-6 rounded-full"
            type="submit"
          >
            <span className="text-lg font-medium">
              {isSubmitting ? "Uploading..." : "Submit"}
            </span>
          </Button>
        </form>
      </Form>
      <Divider />
      <div className="flex w-full items-center gap-3 justify-center">
        <p className="text-base ">Already Have an Account</p>
        <Link href="/login">Login</Link>
      </div>
    </main>
  );
};

export default Register;
