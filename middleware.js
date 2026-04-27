import { NextResponse } from "next/server";

const SUPPORTED_LOCALES = ["en", "ur"];

function getLocaleFromPath(pathname) {
  const firstSegment = pathname.split("/")[1];
  return SUPPORTED_LOCALES.includes(firstSegment) ? firstSegment : null;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const localeFromPath = getLocaleFromPath(pathname);
  if (localeFromPath) {
    const url = request.nextUrl.clone();
    const strippedPath = pathname.replace(`/${localeFromPath}`, "") || "/";
    url.pathname = strippedPath;

    const response = NextResponse.redirect(url);
    response.cookies.set("agrocare_lang", localeFromPath, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
