
import AllRecords from '@/components/AllRecords'
import React from 'react'

export default function page() {

  return (
    <div className='min-h-screen w-full'>
      <div className='px-8 pt-20'>
        <h1>All records</h1>


        <div className="container">
          <AllRecords />
        </div>

      </div>
    </div>
  )
}
