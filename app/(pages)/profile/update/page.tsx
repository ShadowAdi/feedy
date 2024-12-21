"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useToast } from "@/hooks/use-toast";
import { useGlobalContext } from "@/context/UserContext";
import { GetUser, UpdateProfile } from "@/lib/appWriteHandlers";
import { uploadAvatar } from "@/lib/uploadFile";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Updated schema to handle File instead of FileList
const formSchema = z.object({
  username: z.string().min(2).max(50),
  bio: z.string().optional(),
  avatar: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const UpdatePage = () => {
  const { user, isLogged, setUser } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  // Redirect to login if the user is not logged in
  useEffect(() => {
    if (!isLogged && typeof window !== "undefined") {
      router.push("/login");
    }
  }, [isLogged, router]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      bio: "",
    },
  });

  const getUser = async () => {
    try {
      const { success, user: fetchedUser } = await GetUser();
      if (success && fetchedUser) {
        form.reset({
          username: fetchedUser.username || "",
          bio: fetchedUser.bio || "",
        });
        setPreviewUrl(fetchedUser.avatar || "");
        setUser(fetchedUser);
      } else {
        toast({
          title: "Failed to fetch user data",
        });
      }
      setLoading(false);
    } catch (error: any) {
      toast({
        title: "Error fetching user data",
        description: error.message,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      let avatarUrl = previewUrl;

      // Handle file upload if new avatar is provided
      if (selectedFile) {
        const uploadResult = await uploadAvatar(selectedFile);

        if (!uploadResult.success) {
          toast({
            title: "Error uploading avatar",
            description: uploadResult.error,
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }

        avatarUrl = uploadResult.fileUrl || "";
      }

      await UpdateProfile({
        avatar: avatarUrl,
        username: values.username,
        bio: values.bio || user?.bio || "",
      });

      toast({
        title: "Profile updated successfully",
      });

      router.push("/profile");
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <main className="w-[60%] mx-auto py-6 px-8 gap-4 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Update Profile</h1>
      <form
        className="w-[60%] mx-auto flex flex-col gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="mb-4">
          <Input
            label="Username"
            {...form.register("username")}
            placeholder="Enter your username"
            required
          />
        </div>

        <div className="mb-4 space-y-4">
          {previewUrl && (
            <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden">
              <Image
                src={previewUrl}
                alt="Avatar preview"
                fill
                className="object-cover"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setSelectedFile(file);
                if (previewUrl) {
                  URL.revokeObjectURL(previewUrl);
                }
                const newPreviewUrl = URL.createObjectURL(file);
                setPreviewUrl(newPreviewUrl);
              }
            }}
            className="flex w-full bg-default-100 rounded-medium min-h-unit-10 flex-col items-center justify-center gap-2 border-2 border-dashed border-default-300 p-4 text-foreground"
          />
        </div>

        <div className="mb-4">
          <Textarea
            label="Bio"
            {...form.register("bio")}
            placeholder="Tell us about yourself"
          />
        </div>

        <Button
          disabled={isSubmitting}
          className="w-[120px] hover:bg-[#beb8b8] py-6 rounded-full"
          type="submit"
        >
          <span className="text-lg font-medium">
            {isSubmitting ? "Updating..." : "Update"}
          </span>
        </Button>
      </form>
    </main>
  );
};

export default UpdatePage;
