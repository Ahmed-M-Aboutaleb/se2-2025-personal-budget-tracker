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
import { logout } from "@/lib/features/auth/auth-slice";
import { useRouter } from "next/navigation";
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
function EditAccount({
  id,
  setTrigger,
  dropdownRef,
  name,
  type,
}: {
  id: string;
  setTrigger: (trigger: boolean) => void;
  dropdownRef: React.RefObject<HTMLDivElement> | null;
  name: string;
  type: string;
}) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const formSchema = z.object({
    name: z.string().min(1, "Account name is required"),
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
      name: name,
      type: type as any,
    },
  });

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  };
  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      fetch(`${apiBase}/accounts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      }).then((response) => {
        if (!response.ok) {
          response.json().then((data) => console.log(data));
          toast.error("Account edit failed");
          localStorage.removeItem("accessToken");
          dispatch(logout());
          router.push("/");
        }
        response.json().then((data) => {
          setTrigger(true);
          setOpen(false);
          form.reset();
          toast.success("Account edited successful");
        });
      });
    } catch (error) {
      localStorage.removeItem("accessToken");
      dispatch(logout());
      router.push("/");
      toast.error("Account edit failed");
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
          <DialogTitle>Edit Account</DialogTitle>
          <DialogDescription>Edit your Account.</DialogDescription>
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
                Edit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditAccount;
