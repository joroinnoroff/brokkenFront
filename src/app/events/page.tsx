
import AllEvents from '@/components/AllEvents'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import React from 'react'

export default function page() {

  return (
    <div className='min-h-screen w-full'>
      <div className='px-8 pt-20'>
        <Link href={"/"} className=''><ArrowLeft /></Link>
        <h1 className='text-3xl font-bold my-8'>All events</h1>


        <div className="container max-w-5xl mx-auto">
          <AllEvents />
        </div>

      </div>
    </div>
  )
}
