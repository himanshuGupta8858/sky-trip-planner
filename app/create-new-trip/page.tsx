"use client"
import { Suspense } from 'react'
import Chatbox from './_component/chatbox'
import Itinerary from './_component/Itinerary'

const CreateNewTrip = () => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 sm:p-6 md:p-10 mb-6 md:mb-10 items-start">
        <Suspense fallback={
          <div className='h-[70vh] md:h-[84vh] w-full bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-xl rounded-2xl p-4 flex items-center justify-center'>
            <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
        }>
          <Chatbox />
        </Suspense>
        <div className='h-[60vh] md:h-[85vh] col-span-1 md:col-span-2'>
          <Itinerary />
        </div>
      </div>
    </div>
  )
}

export default CreateNewTrip