
import {create} from "zustand"

interface ManagerModalProps{
    modalOpenState: string,
    setModalOpenState: (value: string) => void
}

interface ManagerVerifyEmail {
    emailToVerify: string,
    setEmailToVerify: (email: string) => void
}

export const useManagerModalStore = create<ManagerModalProps>()((set) => ({
    modalOpenState: "",
    setModalOpenState: (value) => set(() => ({modalOpenState: value})),
}))

export const useEmailToVerify = create<ManagerVerifyEmail>()((set) => ({
    emailToVerify: "",
    setEmailToVerify: (email) => set(() => ({emailToVerify: email}))
}))
