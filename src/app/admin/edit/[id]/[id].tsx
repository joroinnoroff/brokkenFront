import { fetchEventById, fetchRecordById } from "@/lib/api";

interface AdminEditProps {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function IdPage({ params }: AdminEditProps) {
  const { id } = params;
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
