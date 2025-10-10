const API_PATH = "/api/records";

export interface RecordType {
  id?: number;
  name: string;
  image: string;
  release_date: string;
  price: number;
  description: string;
}

export async function fetchRecords(): Promise<RecordType[]> {
  const res = await fetch(API_PATH);
  if (!res.ok) throw new Error("Failed to fetch records");
  return res.json();
}

export async function createRecord(record: RecordType): Promise<RecordType> {
  const res = await fetch(API_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(record),
  });
  if (!res.ok) throw new Error("Failed to create record");
  return res.json();
}

export async function deleteRecord(id: number): Promise<RecordType> {
  const res = await fetch(`${API_PATH}?id=${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete record");
  return res.json();
}
