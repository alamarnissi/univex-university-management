
import {create} from "zustand"

interface ModalProps{
    modalOpenState: boolean,
    modalTypeState: string,
    actionTypeState: string,
    openToolbarBoolState: boolean,
    openToolbarStringState: null | string,
    setOpenToolbarBoolState: (value: boolean) => void,
    setOpenToolbarStringState: (value: null | string) => void,
    setModalTypeState: (value: string) => void,
    setModalOpenState: (value: boolean) => void
    setActionTypeState: (value: string) => void
}


export const useModalStore = create<ModalProps>()((set) => ({
    modalOpenState: false,
    modalTypeState: "",
    openToolbarBoolState: false,
    openToolbarStringState: null,
    actionTypeState: "",
    setModalTypeState: (value) => set(() => ({modalTypeState: value})),
    setModalOpenState: (value) => set(() => ({modalOpenState: value})),
    setOpenToolbarBoolState: (value) => set(() => ({openToolbarBoolState: value})),
    setOpenToolbarStringState: (value) => set(() => ({openToolbarStringState: value})),
    setActionTypeState: (value) => set(() => ({actionTypeState: value})),
}))