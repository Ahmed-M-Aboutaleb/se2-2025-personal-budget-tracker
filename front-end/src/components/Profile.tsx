"use client";

import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
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
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { setCredentials } from "@/lib/features/auth/auth-slice";

function Profile() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const dispatch = useDispatch<AppDispatch>();
  const { token, first_name, last_name, id, email, username } = useSelector(
    (state: RootState) => state.auth
  );
  const formSchema = z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    password: z.string().min(6, "Password is required"),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: first_name,
      last_name: last_name,
      password: "",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      fetch(`${apiBase}/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      }).then((response) => {
        if (!response.ok) {
          response.json().then((data) => console.log(data));
          toast.error("Category creation failed");
          throw new Error("Network response was not ok");
        }
        response.json().then((data) => {
          dispatch(
            setCredentials({
              token: localStorage.getItem("accessToken") as any,
              email: email,
              id: id as any,
              username: username,
              first_name: data.first_name,
              last_name: data.last_name,
            })
          );
          form.reset();
          toast.success("Category created successful");
        });
      });
    } catch (error) {
      toast.error("Category creation failed");
    }
  }
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="First Name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter first name to update profile
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Last Name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter last name to update profile
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
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter password to update profile
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="cursor-pointer">
              Update Profile
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default Profile;
