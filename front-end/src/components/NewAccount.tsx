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
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";

const account_types = [
  {
    value: "BANK_ACCOUNT",
    label: "Bank Account",
  },
  {
    value: "CREDIT_CARD_ACCOUNT",
    label: "Credit Card Account",
  },
  {
    value: "CASH_ACCOUNT",
    label: "Cash",
  },
  {
    value: "GENERAL_ACCOUNT",
    label: "General Account",
  },
  {
    value: "SAVINGS_ACCOUNT",
    label: "Savings Account",
  },
  {
    value: "BONUS_ACCOUNT",
    label: "Bonus Account",
  },
  {
    value: "LOANS_ACCOUNT",
    label: "Loans Account",
  },
  {
    value: "INVESTMENT_ACCOUNT",
    label: "Investment Account",
  },
];

function NewAccount({
  setTrigger,
}: {
  setTrigger: (trigger: boolean) => void;
}) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);
  const [open, setOpen] = useState(false);
  const formSchema = z.object({
    name: z.string().min(1, "Account name is required"),
    balance: z.number().min(0, "Account balance must be a positive number"),
    type: z.enum(
      [
        "BANK_ACCOUNT",
        "CREDIT_CARD_ACCOUNT",
        "CASH_ACCOUNT",
        "GENERAL_ACCOUNT",
        "SAVINGS_ACCOUNT",
        "BONUS_ACCOUNT",
        "LOANS_ACCOUNT",
        "INVESTMENT_ACCOUNT",
      ],
      {
        errorMap: () => ({ message: "Account type is required" }),
      }
    ),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      balance: 0,
      type: "BANK_ACCOUNT",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    try {
      fetch(`${apiBase}/accounts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      }).then((response) => {
        if (!response.ok) {
          response.json().then((data) => console.log(data));
          toast.error("Account creation failed");
          throw new Error("Network response was not ok");
        }
        response.json().then((data) => {
          setTrigger(true);
          setOpen(false);
          form.reset();
          toast.success("Account created successful");
        });
      });
    } catch (error) {
      toast.error("Account creation failed");
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">Create New Account</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Account</DialogTitle>
          <DialogDescription>
            Create a new account by entering the name and type of account.
          </DialogDescription>
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
                  <FormDescription>
                    Enter account name to create
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Balance</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      {...form.register("balance", { valueAsNumber: true })}
                      placeholder="Balance"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter account balance to create
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
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
                            ? account_types.find(
                                (account) => account.value === field.value
                              )?.label
                            : "Select account type"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search Account Types..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No account type found.</CommandEmpty>
                          <CommandGroup>
                            {account_types.map((account) => (
                              <CommandItem
                                value={account.label}
                                key={account.value}
                                onSelect={() => {
                                  form.setValue("type", account.value as any);
                                }}
                              >
                                {account.label}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    account.value === field.value
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
                  <FormDescription>
                    Select account type to create
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex !justify-center">
              <Button type="submit" className="cursor-pointer">
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default NewAccount;
