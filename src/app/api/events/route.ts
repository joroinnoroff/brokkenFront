import { EventType } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://brokken-back.vercel.app/api";



interface ErrorResponse {
  error: string;
}



export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // If ID is provided, fetch a single record
    if (id) {
      const res = await fetch(`${API_URL}/events?id=${id}`);
      if (!res.ok) throw new Error(`Failed to fetch event with id ${id}`);
      const data = await res.json();
      return NextResponse.json(data);
    }

    // Else fetch all records
    const res = await fetch(`${API_URL}/events`);
    if (!res.ok) throw new Error("Failed to fetch events");
    const data = await res.json();
    return NextResponse.json(data);

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch records";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    if (!API_URL) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_API_URL is not configured" },
        { status: 500 }
      );
    }
    const event: EventType = await req.json();
    const backendUrl = API_URL.endsWith("/") ? `${API_URL}events` : `${API_URL}/events`;
    const res = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
    if (!res.ok) {
      let backendError = "";
      try {
        const errBody = await res.json();
        backendError = errBody?.error || errBody?.message || JSON.stringify(errBody);
      } catch {
        backendError = await res.text().catch(() => "");
      }
      return NextResponse.json(
        {
          error: backendError || `Backend returned ${res.status}`,
          status: res.status,
        },
        { status: res.status >= 500 ? 502 : res.status }
      );
    }
    const data: EventType = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create event";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const updateEvent: EventType = await req.json();


    const res = await fetch(`${API_URL}/events?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateEvent),
    });

    if (!res.ok) throw new Error("Failed to update event");

    const data: EventType = await res.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update event";
    const error: ErrorResponse = { error: message };
    return NextResponse.json(error, { status: 500 });
  }
}


export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const res = await fetch(`${API_URL}/events?id=${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete record");
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete record";
    const error: ErrorResponse = { error: message };
    return NextResponse.json(error, { status: 500 });
  }
}
