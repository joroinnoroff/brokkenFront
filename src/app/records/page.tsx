
import AllRecords from '@/components/AllRecords'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function page() {

  return (
    <div className='min-h-screen w-full'>

      <div className='px-8 pt-20'>
        <Link href={"/"} className=''><ArrowLeft /></Link>
        <h1 className='text-3xl font-bold my-8'>All records</h1>


        <div className="container">
          <AllRecords />
        </div>

      </div>
    </div>
  )
}
