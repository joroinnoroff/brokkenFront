// app/api/records/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface RecordType {
  id?: number;
  name: string;
  image: string;
  release_date: string;
  price: number;
  description: string;
}

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/records`);
    if (!res.ok) throw new Error("Failed to fetch records");
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch records" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const record: RecordType = await req.json();
    const res = await fetch(`${API_URL}/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });
    if (!res.ok) throw new Error("Failed to create record");
    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create record" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const res = await fetch(`${API_URL}/records?id=${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete record");
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete record" }, { status: 500 });
  }
}
