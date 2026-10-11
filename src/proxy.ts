import { NextResponse, type NextRequest } from "next/server";

type SessionCookie = {
  id?: string;
  role?: "TENANT" | "LANDLORD" | "ADMIN";
};

function dashboardPathFor(role: SessionCookie["role"]): string {
  switch (role) {
    case "LANDLORD":
      return "/dashboard/landlord";
    case "ADMIN":
      return "/dashboard/admin";
    default:
      return "/dashboard/tenant";
  }
}

function readSessionUser(req: NextRequest): SessionCookie | null {
  const raw = req.cookies.get("rn_user")?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as SessionCookie;
    if (parsed && typeof parsed === "object" && parsed.role) return parsed;
  } catch {
    // malformed cookie -> treat as signed out
  }
  return null;
}

/**
 * Route protection for the dashboard area.
 * The cookie only drives UI routing; the API still enforces the real
 * authorization through JWTs + role checks on every request.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const user = readSessionUser(request);

  if (pathname.startsWith("/auth")) {
    if (user) {
      return NextResponse.redirect(
        new URL(dashboardPathFor(user.role), request.url)
      );
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard")) {
    if (!user) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const [, , segment] = pathname.split("/");
    const requiredRole = segment?.toUpperCase();
    if (
      requiredRole === "TENANT" ||
      requiredRole === "LANDLORD" ||
      requiredRole === "ADMIN"
    ) {
      if (user.role !== requiredRole) {
        return NextResponse.redirect(new URL("/no-access", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
