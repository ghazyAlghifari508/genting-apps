import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase-middleware";

export async function proxy(request: NextRequest) {
  const { supabaseResponse: response, user, role: dbRole } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const guestOnlyRoutes = ["/login", "/register", "/register-doctor"];
  const publicPathPrefixes = ["/auth", "/api/auth", "/api/seed-users"];

  const isLandingPage = pathname === "/";
  const isPublicPrefix = publicPathPrefixes.some((prefix) => pathname.startsWith(prefix));
  const isGuestOnly = guestOnlyRoutes.includes(pathname);

  const isPublicRoute = isLandingPage || isPublicPrefix || isGuestOnly;

  if (user) {
    const role = dbRole || "user";
    const homeRoutes: Record<string, string> = {
      admin: "/admin/dashboard",
      doctor: "/doctor",
      user: "/dashboard",
    };

    const isBasicGuestRoute = guestOnlyRoutes.includes(pathname) || pathname === "/";
    const isOnboardingRoute = pathname === "/onboarding";
    const onboardingCompleted = user.user_metadata?.onboarding_completed;

    if (isBasicGuestRoute) {
      const targetUrl = new URL(homeRoutes[role] || "/dashboard", request.url);
      if (targetUrl.pathname === pathname) return response;
      return NextResponse.redirect(targetUrl);
    }

    if (isOnboardingRoute) {
      if (role === "user" && !onboardingCompleted) {
        return response;
      }
      return NextResponse.redirect(new URL(homeRoutes[role] || "/dashboard", request.url));
    }

    const isAdminRoute = pathname.startsWith("/admin");
    const isDoctorRoute = pathname.startsWith("/doctor") && !pathname.startsWith("/doctors");

    if (pathname.startsWith("/api")) {
      return response;
    }

    const currentHome = homeRoutes[role];
    if (pathname === currentHome) {
      return response;
    }

    if (role === "admin") {
      if (!isAdminRoute) return NextResponse.redirect(new URL(homeRoutes.admin, request.url));
    } else if (role === "doctor") {
      const isDoctorApprovalPage = pathname.startsWith("/onboarding/doctor-approved");
      if (!isDoctorRoute && !isDoctorApprovalPage) return NextResponse.redirect(new URL(homeRoutes.doctor, request.url));
    } else if (role === "user") {
      if (isAdminRoute || isDoctorRoute) return NextResponse.redirect(new URL(homeRoutes.user, request.url));
    }
  } else if (!isPublicRoute) {
    const isAction = request.headers.has("next-action");
    const isRSC = request.headers.get("accept") === "text/x-component";

    if (isAction || isRSC) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|.*\\..*).*)"],
};
