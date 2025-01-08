"use client"

import ListData from './ListData';
import { SWRConfig } from 'swr';
import { useCoursesControlsStore } from '@/stores/useCourseStore';


const CoursesList = ({ coursesData, role, workspace_subdomain }: { coursesData: any, role: string, workspace_subdomain: string }) => {

  const {
    setIsActiveValue,
    statusValue,
    sortValue,
    searchValue
  } = useCoursesControlsStore()

  return (
    <SWRConfig value={coursesData}>
      <ListData
        prefetchedData={coursesData}
        setIsActive={setIsActiveValue}
        sortValue={sortValue}
        statusValue={statusValue}
        searchValue={searchValue}
        role={role}
        workspace_subdomain={workspace_subdomain}
      />
    </SWRConfig>
  )
}

export default CoursesList