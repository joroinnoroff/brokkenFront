// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface RecordType {
  id?: number;
  name: string;
  image: string;
  release_date: string;
  price: number;
  description: string;
}

export async function fetchRecords() {
  const res = await fetch(`${API_URL}/records`);
  if (!res.ok) throw new Error("Failed to fetch records");
  return res.json();
}

export async function createRecord(record: RecordType) {
  const res = await fetch(`${API_URL}/records`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(record),
  });
  if (!res.ok) throw new Error("Failed to create record");
  return res.json();
}

export async function deleteRecord(id: number) {
  const res = await fetch(`${API_URL}/records?id=${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete record");
  return res.json();
}
