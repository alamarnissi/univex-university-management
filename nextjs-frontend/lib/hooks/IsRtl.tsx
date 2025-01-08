import { useLangLocale } from "@/stores/useGlobalStore";
import useStore from "@/stores/useStore";

const IsRtl = () => {
    // const pathname = usePathname();
    // let firstPart = pathname.split("/")[1];
    // const locales = ["en", "fr", "ar"];
    // locales.includes(firstPart);
  
    const localeState = useStore(useLangLocale, state => state.localeState);
  
    return localeState === "ar" ? true : false;
  }

export default IsRtl