import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

const adminPublicRoutes: string[] = ["/admin/auth/*"];

// const publicRoutes: string[] = [];

export async function middleware(req: NextRequest) {
  const sessionCookie = getSessionCookie(req);

  const pathname = req.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  //   const isPublicRoute = publicRoutes.includes(pathname);

  if (isAdminRoute) {
    const isAdminPublicRoute = adminPublicRoutes.some((route) => {
      if (route.endsWith("/*")) {
        const baseRoute = route.replace("/*", "");
        return pathname.startsWith(baseRoute);
      }
      return pathname === route;
    });

    if (!!sessionCookie && isAdminPublicRoute) {
      const redirectTo = req.nextUrl.clone();
      redirectTo.pathname = "/admin/dashboard";
      return NextResponse.redirect(redirectTo);
    }
    if (!sessionCookie && !isAdminPublicRoute) {
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
