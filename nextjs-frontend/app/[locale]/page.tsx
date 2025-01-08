import Contact from "@/components/Contact/Contact";
import Features from "@/components/Features/Features";
import Help from "@/components/Help/Help";
import Hero from "@/components/Hero/Hero";
import Platform from "@/components/Platform/Platform";
import Pricing from "@/components/Pricing/Pricing";
import Testimonials from "@/components/Testimonials/Testimonials";
import Footer from "@/components/footer/Footer";
import { useTranslations} from 'next-intl';
import { unstable_setRequestLocale } from "next-intl/server";
import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("@/components/navbar/Navbar"))

export default function Home({params: {locale}}: {params: {locale: string}}) {
  unstable_setRequestLocale(locale);
  
  const translations = useTranslations('LandingPage');

  return (
    <>
      <Navbar locale={locale} />
      <main>
        <Hero t={translations} locale={locale} />
      </main>
      <Footer />
    </>
  )
}
