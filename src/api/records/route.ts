const API_URL = "https://brokken-back.vercel.app/api"

export async function fetchRecords() {
  const res = await fetch(`${API_URL}/records`);

  if (!res.ok) throw new Error("failed to fetch records");

  return await res.json();
}


//create new record (Admin )

export async function createRecord(record: {
  name: string;
  image: string;
  release_date: string;
  price: number;
  description: string;
}) {
  const res = await fetch(`${API_URL}/records`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(record)
  });
  if (!res.ok) throw new Error("failed to create new record");
  return await res.json();
}