import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function proxy(request: NextRequest) {

  const { pathname } = request.nextUrl;

  //apply only to admin rooutes 
  if (pathname.startsWith("/admin")) {
    const loggedIn = request.cookies.get("loggedIn")?.value;


    //if no cookie redirect to login 

    if (!loggedIn || loggedIn !== "true") {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);

      return NextResponse.redirect(loginUrl)
    }
  }



  //add custom header to successful response 
  const response = NextResponse.next();

  response.headers.set("X-Custom-header", "Successful");
  return response;


}


export const config = {
  matcher: ['/admin', '/api/:admin*'],
}