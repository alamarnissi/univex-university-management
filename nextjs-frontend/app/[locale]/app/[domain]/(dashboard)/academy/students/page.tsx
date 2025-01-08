

import { cookies } from 'next/headers';
import PageControls from '../_components/page-parts/studentsListPage/PageControls'
import StudentsList from '../_components/page-parts/studentsListPage/StudentsList'
import dynamic from 'next/dynamic';
import { getStudentsData } from '@/lib/fetch/students/get-students';
import AlertBox from '@/components/Common/AlertBox';

const Header = dynamic(() => import('../_components/page-parts/studentsListPage/Header'), { ssr: false })
const AddStudentModal = dynamic(() => import('../_components/modals/AddStudentModal'))

const StudentsPage = async () => {
    const token = (cookies()?.get("access_token")?.value as string) ?? "";

    const allStudentsData = await getStudentsData({ token });

    return (
        <div>
            <Header />
            {allStudentsData?.data?.total !== 0 ?
                <>
                    <PageControls />

                    <StudentsList prefetchedData={allStudentsData} />
                </>
                :
                <AlertBox type='error' message='No Students found' />
            }
            <AddStudentModal />
        </div>
    )
}

export default StudentsPage