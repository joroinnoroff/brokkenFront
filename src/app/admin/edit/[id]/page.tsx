import { fetchEventsById } from '@/lib/api'
import React from 'react'

interface AdminEditProps {
  params: { id: string }
}
export default async function IdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await fetchEventsById(id);




  return (
    <div>

      <p>{event.name || record.name}</p>
    </div>
  )
}


