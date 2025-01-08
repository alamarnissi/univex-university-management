"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { EyeIcon, EyeOffIcon, UploadIcon } from 'lucide-react'
import { FetchUpdateMangerProfile } from '@/lib/fetch/Auth'
import { useToast } from '@/components/ui/toast/use-toast'
import { ManagerType } from '@/lib/types/manager'
import { useSWRConfig } from 'swr'
import { useRouter } from 'next/navigation'

type ProfileProps = {
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
    current_password: string;
    confirm_password: string;
    new_password: string;
}

const ManagerProfileSettingsForm = ({ userData, locale, domain }: { userData: ManagerType, locale: string, domain: string }) => {
    const { toast } = useToast();
    const { mutate } = useSWRConfig();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formValue, setFormValue] = useState<ProfileProps>({
        first_name: userData?.first_name || "",
        last_name: userData?.last_name || "",
        email: userData?.email || "",
        phone_number: userData?.phone_number || "",
        current_password: "",
        confirm_password: "",
        new_password: "",
    })

    const { first_name, last_name, email, phone_number, current_password, confirm_password, new_password } = formValue;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.currentTarget;
        setFormValue((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    }

    const handleSubmit = async (userData: ProfileProps) => {

        const { confirm_password, new_password, ...rest } = userData;
        if(new_password !== confirm_password) {
            toast({ variant: "destructive", description: "Passwords do not match" });
            return;
        }

        try {
            setIsLoading(true);
            const response = await FetchUpdateMangerProfile({...rest, new_password});

            if (response) {
                if (response.status >= 200 && response.status < 300) {
                    toast({ variant: "success", description: response.message });
                    mutate(process.env.NEXT_PUBLIC_AUTH_API_URL + `/v1/users/profile`)

                    router?.push(`/profile`)
                } else {
                    toast({ variant: "destructive", description: response.message });
                }
                
                setIsLoading(false);
            }
        } catch (error) {
            setIsLoading(false);
            toast({ variant: "destructive", description: "An Error Has Occurred" });
            console.error(error);
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <div className="flex items-center justify-between mb-6">
                <div className='flex items-center gap-4'>
                    <Avatar className="w-24 h-24 mr-4 bg-slate-400">
                        <AvatarImage src="/images/avatar.png" />
                        <AvatarFallback className='bg-slate-200'>UA</AvatarFallback>
                    </Avatar>
                    <p className="font-semibold">Your avatar</p>
                </div>
                <div>
                    <Button className="mt-2" variant="default">
                        Change avatar
                    </Button>
                </div>
            </div>
            <form 
                className="space-y-6" 
                onSubmit={(e) => {
                    e.preventDefault(); 
                    handleSubmit(formValue);
                }}
            >
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input 
                            id="first-name" 
                            name='first_name'
                            value={first_name}
                            placeholder="First Name" 
                            className='focus-visible:ring-offset-0 focus-visible:ring-0'
                            onChange={handleChange} 
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input 
                            id="last-name" 
                            name='last_name'
                            value={last_name}
                            placeholder="Last Name" 
                            className='focus-visible:ring-offset-0 focus-visible:ring-0' 
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                            id="email" 
                            name='email'
                            value={email}
                            placeholder="Email" 
                            type="email" 
                            className='focus-visible:ring-offset-0 focus-visible:ring-0' 
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone-number">Phone Number</Label>
                        <Input 
                            id="phone-number" 
                            name='phone_number'
                            value={phone_number}
                            placeholder="Phone Number" 
                            type="tel" 
                            className='focus-visible:ring-offset-0 focus-visible:ring-0' 
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 w-full md:w-1/2 md:pr-4 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="current-password">Change your Password</Label>
                        <div className="relative">
                            <Input 
                                id="current-password" 
                                name='current_password'
                                placeholder="Type your current password" 
                                type={showCurrentPassword ? "text" : "password"} 
                                className='focus-visible:ring-offset-0 focus-visible:ring-0' 
                                onChange={handleChange}
                            />
                            {showCurrentPassword ?
                                <EyeIcon onClick={() => setShowCurrentPassword(false)} className="cursor-pointer absolute right-2 top-2.5 w-4 h-4 text-muted-foreground" />
                                :
                                <EyeOffIcon onClick={() => setShowCurrentPassword(true)} className="cursor-pointer absolute right-2 top-2.5 w-4 h-4 text-muted-foreground" />
                            }
                        </div>
                        <div className="relative">
                            <Input 
                                id="new-password" 
                                name='new_password'
                                placeholder="Type your new password" 
                                type={showNewPassword ? "text" : "password"} 
                                className='focus-visible:ring-offset-0 focus-visible:ring-0' 
                                onChange={handleChange}
                            />
                            {showNewPassword ?
                                <EyeIcon onClick={() => setShowNewPassword(false)} className="cursor-pointer absolute right-2 top-2.5 w-4 h-4 text-muted-foreground" />
                                :
                                <EyeOffIcon onClick={() => setShowNewPassword(true)} className="cursor-pointer absolute right-2 top-2.5 w-4 h-4 text-muted-foreground" />
                            }
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password-confirmation">Password confirmation</Label>
                        <div className="relative">
                            <Input 
                                id="password-confirmation" 
                                name='confirm_password'
                                placeholder="Confirm your new password" 
                                type={showConfirmPassword ? "text" : "password"} 
                                className='focus-visible:ring-offset-0 focus-visible:ring-0' 
                                onChange={handleChange}
                            />
                            {showConfirmPassword ?
                                <EyeIcon onClick={() => setShowConfirmPassword(false)} className="cursor-pointer absolute right-2 top-2.5 w-4 h-4 text-muted-foreground" />
                                :
                                <EyeOffIcon onClick={() => setShowConfirmPassword(true)} className="cursor-pointer absolute right-2 top-2.5 w-4 h-4 text-muted-foreground" />
                            }
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="institution-logo">Change your Institution Logo</Label>
                        <div className="border-dashed border-2 border-gray-300 p-4 text-center">
                            <UploadIcon className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Drag and drop or click to upload</p>
                        </div>
                    </div>
                </div>
                <div className='w-full text-end'>
                    <Button 
                        type="submit" 
                        className="disabled:cursor-not-allowed disabled:opacity-90 inline-flex gap-3 items-center mt-4" 
                        variant="destructive"
                        disabled={isLoading}
                    >
                        Save Updates {isLoading && <span className='loading-spinner animate-spinner'></span>}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default ManagerProfileSettingsForm