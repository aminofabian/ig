import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  adminRoutes
} from "@/routes";

const { auth: middleware } = NextAuth(authConfig);

export default middleware((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  
  // Add debug logging
  console.log("Debug middleware:", {
    pathname: nextUrl.pathname,
    isLoggedIn,
    userRole: req.auth?.user?.role,
    userEmail: req.auth?.user?.email,
    isApiAuthRoute: nextUrl.pathname.startsWith(apiAuthPrefix),
    isPublicRoute: publicRoutes.includes(nextUrl.pathname),
    isAuthRoute: authRoutes.includes(nextUrl.pathname),
    isAdminRoute: adminRoutes.some(route => nextUrl.pathname.startsWith(route))
  });

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isAdminRoute = adminRoutes.some(route => 
    nextUrl.pathname.startsWith(route)
  );

  // Check if it's the Instagram API endpoint
  const isInstagramApi = nextUrl.pathname.startsWith('/api/instagram');
  if (isInstagramApi) {
    return;
  }

  // Handle API routes
  if (isApiAuthRoute) {
    return;
  }

  // Handle public routes
  if (isPublicRoute) {
    return;
  }

  // Handle auth routes
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl.origin));
    }
    return;
  }

  // Handle admin routes
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return Response.redirect(new URL("/auth/login", nextUrl.origin));
    }

    const userRole = req.auth?.user?.role;
    if (userRole !== "ADMIN") {
      return Response.redirect(new URL("/", nextUrl.origin));
    }

    return;
  }

  // Handle protected routes
  if (!isLoggedIn) {
    return Response.redirect(new URL("/auth/login", nextUrl.origin));
  }

  return;
});

// Update the config to ensure it catches all admin routes
export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
    "/reddit-analytics/:path*"  // Add specific admin route patterns
  ]
};