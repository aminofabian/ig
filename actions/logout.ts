'use server';

import { signOut } from "@/auth";

export async function logout() {
  try {
    await signOut();
  } catch (error) {
    throw new Error("Failed to sign out");
  }
}
