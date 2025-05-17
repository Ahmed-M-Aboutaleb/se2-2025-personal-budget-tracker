"use client";

import { setCredentials } from "@/lib/features/auth/auth-slice";
import { AppDispatch, RootState } from "@/lib/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
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
import { Button } from "./ui/button";

function EditCategory({
  id,
  setTrigger,
  dropdownRef,
  name,
}: {
  id: string;
  setTrigger: (trigger: boolean) => void;
  dropdownRef: React.RefObject<HTMLDivElement> | null;
  name: string;
}) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);
  const [open, setOpen] = useState(false);
  const formSchema = z.object({
    name: z.string().min(1, "Category name is required"),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name,
    },
  });

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  };
  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      fetch(`${apiBase}/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      }).then((response) => {
        if (!response.ok) {
          response.json().then((data) => console.log(data));
          toast.error("Category edit failed");
          throw new Error("Network response was not ok");
        }
        response.json().then((data) => {
          setTrigger(true);
          setOpen(false);
          form.reset();
          toast.success("Category edited successful");
        });
      });
    } catch (error) {
      toast.error("Category edit failed");
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={handleEditClick} className="w-full cursor-pointer">
        <Button className="cursor-pointer w-full" variant={"ghost"}>
          Edit
        </Button>
      </div>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(event) => {
          if (dropdownRef?.current?.contains(event.target as Node)) {
            event.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>Edit your category.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Name" {...field} />
                  </FormControl>
                  <FormDescription>Enter category name to edit</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex !justify-center">
              <Button type="submit" className="cursor-pointer">
                Edit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditCategory;
