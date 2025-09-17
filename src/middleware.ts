import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "./env";

const adminPublicRoutes: string[] = ["/admin/auth/*", "/trpc/adminAuth.*"];

// const publicRoutes: string[] = [];

export async function middleware(req: NextRequest) {
  const sessionCookie = getSessionCookie(req, {
    cookieName: env.BETTER_AUTH_COOKIE_NAME,
  });
  console.log("🚀 ~ middleware ~ sessionCookie:", sessionCookie);

  const pathname = req.nextUrl.pathname;
  console.log("🚀 ~ middleware ~ pathname:", pathname);
  const isAdminRoute = pathname.startsWith("/admin");
  //   const isPublicRoute = publicRoutes.includes(pathname);

  if (isAdminRoute) {
    const isAdminPublicRoute = adminPublicRoutes.some((route) => {
      if (route.endsWith("/*")) {
        const baseRoute = route.replace("/*", "");
        return pathname.startsWith(baseRoute);
      }
      if (route.endsWith(".*")) {
        const baseRoute = route.replace(".*", "");
        return pathname.startsWith(baseRoute);
      }

      return pathname === route;
    });
    console.log("🚀 ~ middleware ~ pathname:", pathname, isAdminPublicRoute);

    if (!!sessionCookie && isAdminPublicRoute) {
      console.log("run A: ", pathname, !!sessionCookie, isAdminPublicRoute);
      const redirectTo = req.nextUrl.clone();
      redirectTo.pathname = "/admin/dashboard";
      return NextResponse.redirect(redirectTo);
    }

    if (!sessionCookie && !isAdminPublicRoute) {
      console.log("run B: ", pathname, !sessionCookie, !isAdminPublicRoute);
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/admin/auth/login";
      if (pathname !== "/admin/auth/login" && pathname !== "/admin/dashboard") {
        loginUrl.searchParams.set("from", pathname);
      }
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
