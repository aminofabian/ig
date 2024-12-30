import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  adminRoutes,
  isAdminEmail,
} from "@/routes";
import { NextResponse } from "next/server";

const extendedAuthConfig = {
  ...authConfig,
  trustProxy: true,
};

export const { auth } = NextAuth(extendedAuthConfig);

// Helper function to check if a pathname matches any of the routes
function isPathnameInRoutes(pathname: string, routes: string[]): boolean {
  return routes.some(route => {
    // Check for exact match
    if (route === pathname) return true;
    
    // Check for dynamic routes
    if (route.includes('[postSlug]')) {
      const routePattern = route.replace('[postSlug]', '([^/]+)');
      const regex = new RegExp(`^${routePattern}$`);
      return regex.test(pathname);
    }
    
    return false;
  });
}

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = isPathnameInRoutes(nextUrl.pathname, publicRoutes);
  const isAuthRoute = isPathnameInRoutes(nextUrl.pathname, authRoutes);
  const isAdminRoute = adminRoutes.some(route => nextUrl.pathname.startsWith(route));

  if (isApiAuthRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  if (isAdminRoute) {
    if (!isLoggedIn) {
      console.log("Admin route - User not logged in");
      return Response.redirect(new URL("/auth/login", nextUrl));
    }
    const userEmail = req.auth?.user?.email;
    console.log("Admin route check:", {
      userEmail,
      isAdmin: userEmail ? isAdminEmail(userEmail) : false
    });
    
    if (!userEmail || !isAdminEmail(userEmail)) {
      console.log("Admin route - User not admin:", userEmail);
      return NextResponse.redirect(new URL("/unauthorized", nextUrl));
    }
  }

  return;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};