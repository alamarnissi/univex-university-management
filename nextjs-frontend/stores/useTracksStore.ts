import { TrackDataType } from "@/lib/types/dataTypes"
import {create} from "zustand"


interface TracksControlProps {
    isActiveValue: string,
    statusValue: string,
    sortValue: string,
    searchValue: string,
    setIsActiveValue: (value: string) => void
    setStatusValue: (value: string) => void
    setSortValue: (value: string) => void
    setSearchValue: (value: string) => void
}

interface TrackStepsProps {
    modalOpenState: boolean
    currentStep: number
    nextStep: number
    previousStep: number
    setModalOpenState: (value: boolean) => void
    setCurrentStep: (value: number) => void
    setNextStep: () => void
    setPreviousStep: () => void
}

interface TrackDataProps {
    track : TrackDataType,
    updateTrackState : (data: TrackDataType) => void,
    initializeTrackState: () => void
}

const initialTrackData : TrackDataType = {
    track_name: "",
    track_description: "",
    courses: []
}

export const useTracksControlsStore = create<TracksControlProps>((set) => ({
    isActiveValue: "all",
    statusValue: "",
    sortValue: "most-recent",
    searchValue: "",
    setStatusValue: (value) => set((state) => ({statusValue: value})),
    setIsActiveValue: (value) => set((state) => ({isActiveValue: value})),
    setSortValue: (value) => set((state) => ({sortValue: value})),
    setSearchValue: (value) => set((state) => ({searchValue: value})),
}))

export const useTrackStepsStore = create<TrackStepsProps>()((set) => ({
    modalOpenState: false,
    currentStep: 1, // is "1" -> "2" means steps for 1 to 2, if "3" means it's processing
    nextStep: 1,
    previousStep: 1,
    setModalOpenState: (value) => set(() => ({modalOpenState: value})),
    setCurrentStep: (value) => set(() => ({currentStep: value})),
    setNextStep: () => set((state) => ({currentStep: state.currentStep + 1})),
    setPreviousStep: () => set((state) => ({currentStep: state.currentStep - 1})),
}))

export const useTrackCreationStore = create<TrackDataProps>()((set) => ({
    track: initialTrackData,
    updateTrackState: (data) => set((state) => ({track: data})),
    initializeTrackState: () => set(() => ({track: initialTrackData}))
}))