'use client';

import clsx from 'clsx';
import {useRouter} from 'next/navigation';
import {useLocale, useTranslations} from 'next-intl';
import {ChangeEvent, useTransition} from 'react';
import { usePathname } from '@/lib/navigation';
import Image from 'next/image';
import { useLangLocale } from '@/stores/useGlobalStore';
import { setCookie } from 'cookies-next';

import globeIcon from "./assets/globe.png"
import { ChevronDown } from 'lucide-react';

const SetLocaleCookie = (locale: string) => {
      // set cookie for next-i18n-router
      setCookie("NEXT_LOCALE", locale)
}

const LocaleSwitcher = () => {
  const {setLocaleState} = useLangLocale();
  const t = useTranslations('LocaleSwitcher');
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    SetLocaleCookie(event.target.value);
    setLocaleState(event.target.value);

    startTransition(() => {
      router.replace(`/${event.target.value}${pathname}`);
    });
  }

  return (
    <div
      className={clsx(
        'flex items-center justify-center text-dark border rounded-3xl px-3 h-10',
        isPending && 'transition-opacity [&:disabled]:opacity-30',
        locale === "ar" && "flex-row-reverse"
      )}
    >
      <p className="sr-only">{t('label')}</p>
      <Image 
        src={globeIcon}
        alt='global'
        width={18}
        height={18}
      />
      <div className='relative hover:opacity-90'>
        <select
          className="w-full text-start inline-flex appearance-none bg-transparent py-3 pr-6 pl-2 outline-none cursor-pointer dark:text-gray-900"
          defaultValue={locale}
          disabled={isPending}
          onChange={onSelectChange}
        >
          {['en', 'fr', 'ar'].map((cur: string) => (
            <option key={cur} value={cur}>
              {t('locale', {locale: cur})}
            </option>
          ))}
        </select>
        <ChevronDown size={18} className='pointer-events-none absolute top-4 right-0 dark:text-gray-900 cursor-pointer' />
        {/* <span className="pointer-events-none absolute top-[8px] right-2 dark:text-gray-900">⌄</span> */}
      </div>
    </div>
  );
}

export default LocaleSwitcher