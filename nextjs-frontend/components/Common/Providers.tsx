"use client";

import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import RefreshTokenHandler from "./RefreshTokenHandler";


type Props = {
  children?: React.ReactNode;
};

export const NextAuthProvider =  ({ children }: Props) => {
  const [interval, setInterval] = useState(0);

  return (
    <SessionProvider refetchInterval={interval}>
        {children}
        <RefreshTokenHandler setInterval={setInterval} />
    </SessionProvider>
  );
};

