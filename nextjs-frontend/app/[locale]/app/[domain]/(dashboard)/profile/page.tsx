
import { Button } from '@/components/ui/button';
import { authOptions } from '@/lib/authOptions';
import { getUserData } from '@/lib/fetch/managers/get-manager';
import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';
import Link from 'next/link';
import React from 'react'

const ProfilePage = async ({ params }: { params: { locale: string, domain: string } }) => {
    const session = await getServerSession(authOptions);

    const token = (cookies()?.get("access_token")?.value as string) ?? "";
    const role = (session?.user?.role as string) || "";

    const userData = await getUserData({ token });

    return (
        <>
            {role === "manager" ?
                <div className="container mx-auto p-4">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold mb-4">Profile</h2>
                        <div>
                            <Button className="mt-2" variant="default">
                                <Link href={`/profile/settings`}>
                                    Edit Profile
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <p className='font-semibold'>First name</p>
                            <p>{userData.first_name}</p>
                        </div>
                        <div className="space-y-2">
                            <p className='font-semibold'>Last name</p>
                            <p>{userData.last_name}</p>
                        </div>

                        <div className="space-y-2">
                            <p className='font-semibold'>Email</p>
                            <p>{userData.email}</p>
                        </div>
                        <div className="space-y-2">
                            <p className='font-semibold'>Phone Number</p>
                            <p>{userData.phone_number}</p>
                        </div>
                    </div>
                </div>
                :
                null
            }

        </>
    )
}

export default ProfilePage