// app/api/records/route.ts
import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db"; // adjust path

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM records ORDER BY release_date DESC");
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.error();
  }
}

export async function POST(req: NextRequest) {
  const { name, image, release_date, price, description } = await req.json();

  if (!name || !price) return NextResponse.json({ error: "Name and price required" }, { status: 400 });

  try {
    const result = await pool.query(
      `INSERT INTO records (name, image, release_date, price, description)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [name, image, release_date, price, description]
    );
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.error();
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    await pool.query("DELETE FROM records WHERE id = $1", [id]);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.error();
  }
}
