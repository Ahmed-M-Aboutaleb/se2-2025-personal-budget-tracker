"use client";

import { setCredentials } from "@/lib/features/auth/auth-slice";
import { AppDispatch, RootState } from "@/lib/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
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
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Checkbox } from "./ui/checkbox";
import { Textarea } from "./ui/textarea";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";

function EditEntry({
  id,
  setTrigger,
  dropdownRef,
  categoryID,
  description,
  date,
  amount,
  expense,
}: {
  id: string;
  setTrigger: (trigger: boolean) => void;
  dropdownRef: React.RefObject<HTMLDivElement> | null;
  categoryID: number;
  description?: string;
  date: string;
  amount: number;
  expense: boolean;
}) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  useEffect(() => {
    fetch(`${apiBase}/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const formatData = data.map((category: any) => ({
          value: category.id,
          label: category.id + " - " + category.name,
        }));
        setCategories(formatData);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, [apiBase, token]);
  const formSchema = z.object({
    amount: z.number().min(1, "Amount is required"),
    categoryId: z.number().min(1, "Category ID is required"),
    date: z.date(),
    description: z.string().optional(),
    expense: z.boolean().optional(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: amount,
      categoryId: categoryID,
      date: new Date(date),
      description: description,
      expense: expense,
    },
  });

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  };
  function onSubmit(values: z.infer<typeof formSchema>) {
    const formatedValues = { ...values };
    formatedValues.date = values.date.toISOString().split("T")[0] as any;
    try {
      fetch(`${apiBase}/entries/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formatedValues),
      }).then((response) => {
        if (!response.ok) {
          response.json().then((data) => console.log(data));
          toast.error("Entry edit failed");
          throw new Error("Network response was not ok");
        }
        response.json().then((data) => {
          setTrigger(true);
          setOpen(false);
          form.reset();
          toast.success("Entry edited successful");
        });
      });
    } catch (error) {
      toast.error("Entry edit failed");
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
        className="sm:max-w-[425px]  overflow-y-auto max-h-[calc(100vh-4rem)]"
        onInteractOutside={(event) => {
          if (dropdownRef?.current?.contains(event.target as Node)) {
            event.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Edit Entry</DialogTitle>
          <DialogDescription>Edit your Entry.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      {...form.register("amount", { valueAsNumber: true })}
                      placeholder="Balance"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter entry amount to create
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? categories.find(
                                (category) => category.value === field.value
                              )?.label
                            : "Select category"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search categories..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No category found.</CommandEmpty>
                          <CommandGroup>
                            {categories.map((category) => (
                              <CommandItem
                                value={category.label}
                                key={category.value}
                                onSelect={() => {
                                  form.setValue(
                                    "categoryId",
                                    category.value as any
                                  );
                                }}
                              >
                                {category.label}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    category.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>Select category to create</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of entry</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Select date of entry to create
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter entry description to create
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expense"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox
                      checked={field.value === true}
                      onCheckedChange={(checked) => {
                        field.onChange(checked === true);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Is this entry an expense?</FormLabel>
                    <FormDescription>
                      Is this entry an expense or income?
                    </FormDescription>
                  </div>
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

export default EditEntry;
