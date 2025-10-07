import { NextResponse } from "next/server";


export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const res = NextResponse.json({ success: true });
    res.cookies.set("loggedIn", "true", {
      path: "/",
      httpOnly: false,
      sameSite: "strict"
    });

    return res;

  }
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}