"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { User } from "lucide-react";
import { setCredentials } from "@/lib/features/auth/auth-slice";
import { AppDispatch } from "@/lib/store";
import { useDispatch } from "react-redux";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import axios from "axios";

function NeedAuthDialog() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const dispatch = useDispatch<AppDispatch>();
  const formSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  function onLogin(values: z.infer<typeof formSchema>) {
    axios
      .post(`${apiBase}/auth/login`, values, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const data = response.data;

        if (data.token) {
          const user = data.user;
          const accessToken = data.token;

          localStorage.setItem("accessToken", accessToken);

          dispatch(
            setCredentials({
              id: user.id,
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              username: user.username,
              token: accessToken,
            })
          );

          form.reset();
          toast.success("Login successful");
        }
      })
      .catch((error) => {
        toast.error("Login failed");
      });
  }

  const formRegisterSchema = z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  });
  const formRegister = useForm<z.infer<typeof formRegisterSchema>>({
    resolver: zodResolver(formRegisterSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
  });
  function onRegister(values: z.infer<typeof formRegisterSchema>) {
    const formattedValues: any = {
      ...values,
    };
    formattedValues.username = values.email;
    axios
      .post(`${apiBase}/auth/register`, values, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const data = response.data;
        const user = data.user;
        const accessToken = data.token;
        localStorage.setItem("accessToken", accessToken);
        dispatch(
          setCredentials({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            username: user.username,
            token: accessToken,
          })
        );
        form.reset();
        toast.success("Register successful");
      })
      .catch((error) => {
        toast.error("Register failed");
      });
  }
  return (
    <Tabs defaultValue="login" className="!w-[450px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Log in</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Login to your account to access your profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onLogin)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter your email address to login
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
                        <Input
                          type="password"
                          placeholder="password"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter your password to login
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="flex !justify-center">
                  <Button type="submit" className="cursor-pointer">
                    Login
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="register">
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>
              Create a new account to access your profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Form {...formRegister}>
              <form
                onSubmit={formRegister.handleSubmit(onRegister)}
                className="space-y-8"
              >
                <FormField
                  control={formRegister.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="First Name"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter your first name to register
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formRegister.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Last Name" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter your last name to register
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formRegister.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter your email address to login
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formRegister.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="password"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter your password to login
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="flex !justify-center">
                  <Button type="submit" className="cursor-pointer">
                    Register
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function NeedAuth() {
  return (
    <>
      <h1 className="text-2xl font-bold">Authentication Required</h1>
      <p className="mt-4 text-gray-600">
        You need to be logged in to access this page.
      </p>
      <div className="mt-6">
        <NeedAuthDialog />
      </div>
    </>
  );
}

export default NeedAuth;
