
import AllEvents from '@/components/AllEvents'

import React from 'react'

export default function page() {

  return (
    <div className='min-h-screen w-full'>
      <div className='px-8 pt-20'>
        <h1>All events</h1>


        <div className="container">
          <AllEvents />
        </div>

      </div>
    </div>
  )
}
