import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;

  if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

  try {
    const updatedFields = await req.json();

    if (!Object.keys(updatedFields).length) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const res = await fetch(`${API_URL}/records/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFields),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to update record");
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update record";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
