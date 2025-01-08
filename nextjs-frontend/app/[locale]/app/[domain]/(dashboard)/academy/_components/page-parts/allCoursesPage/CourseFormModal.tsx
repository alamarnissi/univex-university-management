"use client"

import { useCourseStepsStore } from '@/stores/useCourseStore';
import StepsModal from './courseSteps/StepsModal';

const CourseFormModal = () => {

  const {
    modalOpenState,
    currentStep, // is "1" -> "3" means steps for 1 to 3, if "4" means it's processing
    setModalOpenState,
    setCurrentStep,
  } = useCourseStepsStore();

  return (
    <>
      {/* Course Creation Form */}
      {modalOpenState && <StepsModal
        currentStep={currentStep}
        modalOpen={modalOpenState}
        setModalOpen={setModalOpenState}
        setCurrentStep={setCurrentStep}
      />}
    </>
  )
}

export default CourseFormModal