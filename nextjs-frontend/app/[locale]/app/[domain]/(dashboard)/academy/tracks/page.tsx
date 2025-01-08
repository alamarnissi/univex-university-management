
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import Header from '../_components/page-parts/allTracksPage/Header'
import AllTracksControls from '../_components/page-parts/allTracksPage/AllTracksControls'
import TracksList from '../_components/page-parts/allTracksPage/tracksList/TracksList'
import CourseCardSkeleton from '@/components/skeletons/CourseCardSkeleton'

const TrackFormModal = dynamic(() => import('../_components/page-parts/allTracksPage/TrackFormModal'), { ssr: false })

const TracksPage = () => {
  return (
    <div>
      <Header />

      <AllTracksControls />

      <Suspense fallback={
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
          {[1, 2, 3].map(el => (
              <CourseCardSkeleton key={el} />
            ))}
        </div>
      }>
        <TracksList />
      </Suspense>

      <TrackFormModal />
    </div>
  )
}

export default TracksPage