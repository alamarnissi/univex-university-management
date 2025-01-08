const styles = {
    boxWidth: "xl:max-w-[1280px] w-full",
  
    heading2: "font-bold text-2xl sm:text-3xl text-black leading-[55px]",
    paragraph: "font-normal text-[#637381] text-base leading-[25px]",
  
    flexCenter: "flex justify-center items-center",
    flexStart: "flex justify-center items-start",

    gridFour: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  
    paddingX: "sm:px-16 px-6",
    paddingY: "sm:py-16 py-6",
    padding: "sm:px-16 px-6 py-16",
  
    marginX: "sm:mx-16 mx-6",
    marginY: "sm:my-16 my-6",
  };
  
  export const layout = {
    section: `flex md:flex-row flex-col ${styles.paddingY}`,
    sectionReverse: `flex md:flex-row flex-col-reverse ${styles.paddingY}`,
  
    sectionImgReverse: `flex-1 flex ${styles.flexCenter} md:mr-10 mr-0 md:mt-0 mt-10 relative`,
    sectionImg: `flex-1 flex ${styles.flexCenter} md:ml-10 ml-0 md:mt-0 mt-10 relative`,
  
    sectionInfo: `flex-1 ${styles.flexStart} flex-col`,
  };
  
  export default styles;
  