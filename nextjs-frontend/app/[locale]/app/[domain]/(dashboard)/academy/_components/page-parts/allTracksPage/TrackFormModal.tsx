"use client"

import { useTrackStepsStore } from '@/stores/useTracksStore';
import TrackStepsModal from './TrackSteps/TrackStepsModal';

const TrackFormModal = () => {

  const {
    modalOpenState,
    currentStep, // is "1" -> "2" means steps for 1 to 2, if "3" means it's processing
    setModalOpenState,
    setCurrentStep,
  } = useTrackStepsStore();

  return (
    <>
      {/* Course Creation Form */}
      {modalOpenState && <TrackStepsModal
        currentStep={currentStep}
        modalOpen={modalOpenState}
        setModalOpen={setModalOpenState}
        setCurrentStep={setCurrentStep}
      />}
    </>
  )
}

export default TrackFormModal