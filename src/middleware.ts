import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";

const adminPublicRoutes: string[] = ["/admin/auth/*", "/trpc/admin.*"];

// const publicRoutes: string[] = [];

export async function middleware(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  console.log("🚀 ~ middleware ~ session:", session);

  const pathname = req.nextUrl.pathname;
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

    if (!!session && session.user.role !== "admin") {
      await auth.api.signOut({
        headers: await headers(),
      });
      return NextResponse.redirect(new URL("/admin/auth/login", req.url));
    }

    if (!!session && isAdminPublicRoute) {
      const redirectTo = req.nextUrl.clone();
      redirectTo.pathname = "/admin/dashboard";
      return NextResponse.redirect(redirectTo);
    }

    if (!session && !isAdminPublicRoute) {
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
  runtime: "nodejs",
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
