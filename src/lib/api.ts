const API_PATH_RECORDS = "/api/records";
const API_PATH_EVENTS = "/api/events";
export interface RecordType {
  id?: number;
  name: string;
  image: string;
  release_date: string;
  price: number;
  description: string;
}

export interface EventType {
  id?: number;
  name: string;
  image: string;
  start_date: string;
  end_date: string;
  location: string;


  description: string;
}

export async function fetchRecords(): Promise<RecordType[]> {
  const res = await fetch(API_PATH_RECORDS);
  if (!res.ok) throw new Error("Failed to fetch records");
  return res.json();
}

export async function fetchEvents(): Promise<EventType[]> {
  const res = await fetch(API_PATH_EVENTS);
  if (!res.ok) throw new Error("Failed to fetch records");
  return res.json();
}

export async function createRecord(record: RecordType): Promise<RecordType> {
  const res = await fetch(API_PATH_RECORDS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(record),
  });
  if (!res.ok) throw new Error("Failed to create record");
  return res.json();
}
export async function createEvent(event: EventType): Promise<EventType> {
  const res = await fetch(API_PATH_EVENTS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
  if (!res.ok) throw new Error("Failed to create event");
  return res.json();
}

export async function deleteRecord(id: number): Promise<RecordType> {
  const res = await fetch(`${API_PATH_RECORDS}?id=${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete record");
  return res.json();
}
