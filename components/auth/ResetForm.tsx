"use client";

import * as z from "zod";

import CardWrapper from "./CardWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormLabel,
  FormItem,
  FormField,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FormSuccess from "../common/FormSuccess";
import { useState, useTransition } from "react";
import { reset } from "@/actions/reset";
import FormError from "../common/FormError";

const ResetForm = () => {
  
  const [isPending, startTransition] = useTransition();
  
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  
  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });
  
  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      reset(values)
      .then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    }); 
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <CardWrapper
          headerLabel="Forgot Your Password?"
          backButtonLabel="Back to Login ?"
          backButtonHref="/auth/login"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-50">Email</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder="john.doe@example.com"
                          type="email"
                          className="bg-slate-800 text-slate-50 border-slate-700 focus:border-[#f059da] focus:ring-[#f059da]"
                        />
                      </FormControl>
                      <FormMessage className="text-sm text-orange-400 font-light" />
                    </FormItem>
                  )}
                />
              </div>
              <FormError message={error} />
              <FormSuccess message={success} />
              <Button
                variant="default"
                type="submit"
                className="w-full bg-[#f059da] hover:bg-[#f059da]/90 transition-colors"
                disabled={isPending}
              >
                Send Reset Email
              </Button>
            </form>
          </Form>
        </CardWrapper>
      </div>
    </div>
  );
};

export default ResetForm;
