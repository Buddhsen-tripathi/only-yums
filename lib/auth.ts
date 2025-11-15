import { auth, currentUser } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

export type UserRole = "user" | "admin";

export interface AppUser {
  id: string;
  clerkUserId: string;
  displayName: string;
  role: UserRole;
}

export async function getOptionalUser(): Promise<AppUser | null> {
  const { userId } = auth();
  if (!userId) return null;

  const user = await currentUser();
  if (!user) return null;

  const role = ((user.publicMetadata.role as string | undefined) ?? "user") as UserRole;

  return {
    id: userId,
    clerkUserId: userId,
    displayName: user.username || user.fullName || "Member",
    role,
  };
}

export async function requireUser(): Promise<AppUser> {
  const user = await getOptionalUser();

  if (!user) {
    redirect("/sign-in");
  }

  return user;
}

export async function requireAdmin(): Promise<AppUser> {
  const user = await requireUser();

  if (user.role !== "admin") {
    notFound();
  }

  return user;
}
