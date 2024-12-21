"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useGlobalContext } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "@/lib/appWriteHandlers";
import Link from "next/link";
const formSchema = z.object({
  email: z.string().email({ message: "Should Be A Valid Email" }),
  password: z.string().min(3, { message: "Must be more than 6 characters" }),
});
const LoginPage = () => {
  const { isLogged } = useGlobalContext();

  if (isLogged) {
    window.location.href = "/dashboard";
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      email: "",
    },
  });
  const { toast } = useToast();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const { message, success, error, session } = await signIn(
        values.email,
        values.password
      );

      if (!success) {
        toast({
          title: "Error on Logging In",
          description: `${message} ${error}`,
        });
      }
      toast({
        title: "Login Successfull",
        description: message,
      });
      window.location.href = "/dashboard";
    } catch (error: any) {
      toast({
        title: "Login Successfull",
        description: `${error}`,
      });
    }
  }

  return (
    <main className="w-[60%] mx-auto h-[80vh] my-auto  py-6 px-8 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-semibold">Login</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
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

          <Button disabled={isSubmitting} type="submit">
            Submit
          </Button>
        </form>
      </Form>
      <div className="flex w-full items-center justify-center">
        <p className="text-base ">Don{"'"}t Have an Account</p>
        <Link href="/register">Register</Link>
      </div>
    </main>
  );
};

export default LoginPage;
