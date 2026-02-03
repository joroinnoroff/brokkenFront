import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface RecordType {
  id?: number;
  name?: string;
  image?: string[];
  release_date?: string;
  price?: number;
  description?: string;
  genre?: string[];
}


interface ErrorResponse {
  error: string;
}



export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // If ID is provided, fetch a single record
    if (id) {
      const res = await fetch(`${API_URL}/records/${id}`);
      if (!res.ok) throw new Error(`Failed to fetch record with id ${id}`);
      const data = await res.json();
      return NextResponse.json(data);
    }

    // Else fetch all records
    const res = await fetch(`${API_URL}/records`);
    if (!res.ok) throw new Error("Failed to fetch records");
    const data = await res.json();
    return NextResponse.json(data);

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch records";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const record: RecordType = await req.json();
    const res = await fetch(`${API_URL}/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });
    if (!res.ok) throw new Error("Failed to create record");
    const data: RecordType = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create record";
    const error: ErrorResponse = { error: message };
    return NextResponse.json(error, { status: 500 });
  }
}


export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const updateRecord: RecordType = await req.json();


    const res = await fetch(`${API_URL}/records?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateRecord),
    });

    if (!res.ok) throw new Error("Failed to update record");

    const data: RecordType = await res.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update record";
    const error: ErrorResponse = { error: message };
    return NextResponse.json(error, { status: 500 });
  }
}


export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const res = await fetch(`${API_URL}/records?id=${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete record");
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete record";
    const error: ErrorResponse = { error: message };
    return NextResponse.json(error, { status: 500 });
  }
}
