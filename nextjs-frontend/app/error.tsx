"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <>
      <section className="bg-white dark:bg-gray-900 w-full h-screen">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-red-500 dark:text-red-500/50">500</h1>
            <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Something Went Wrong.</p>
            <p className="mb-2 text-lg font-light text-gray-600 dark:text-gray-400">Oops, Things are a little <strong className="font-semibold">unstable</strong> here!. </p>
            <p className="mb-4 font-light text-gray-600 dark:text-gray-400">I suggest go back to homepage or come back later. </p>
            <div className="flex justify-center items-center gap-5 p-4">
              <Button onClick={() => reset()}>Try Again</Button>
              <Link href={`${process.env.NEXT_PUBLIC_APP_URL}`} className="inline-flex text-white bg-primary hover:bg-primary/80 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4">Back to Homepage</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
