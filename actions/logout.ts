'use server';

import { signOut } from "@/auth";
import { redirect } from "next/navigation";

export async function logout() {
  try {
    await signOut();
    redirect("/auth/login");
  } catch (error) {
    throw new Error("Failed to sign out");
  }
}
