import { fetchEventById, fetchRecordById, updateEvent, updateRecord } from "@/lib/api";
import Image from "next/image";
import EditSelected from "../../components/EditSelected";

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const { id } = await params;

  if (!id) return;
  const event = await fetchEventById(id);
  const record = !event ? await fetchRecordById(id) : null;

  if (!event && !record) {
    return <div className="p-4">❌ Nothing found with ID {id}</div>;
  }

  const item = event || record;
  const isEvent = !!event;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">
        Editing {isEvent ? "Event" : "Record"}: {item.name}
      </h1>




      {isEvent ? (
        <EditSelected
          item={item}
          type="record"
          onSave={async (data) => {
            await updateRecord(data.id!, data);
            alert("Record updated!");
          }}
        />
      ) : (
        <EditSelected
          item={item}
          type="event"
          onSave={async (data) => {
            await updateEvent(data.id!, data);
            alert("Event updated!");
          }}
        />
      )}

      <div className="mt-4">
        <p><strong>ID:</strong> {item.id}</p>
        <p><strong>Description:</strong> {item.description}</p>

        {isEvent ? (
          <>
            <p><strong>Start date:</strong> {item.start_date}</p>
            <p><strong>End date:</strong> {item.end_date}</p>
            <p><strong>Location:</strong> {item.location}</p>
          </>
        ) : (
          <>
            <p><strong>Release date:</strong> {item.release_date}</p>
            <p><strong>Price:</strong> {item.price} NOK</p>
          </>
        )}
      </div>
    </div>
  );
}
