import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "../lib/AuthContext";

import AuthWrapper from "@/components/AuthWrapper"; 

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <AuthWrapper>
        <Component {...pageProps} />
      </AuthWrapper>
    </UserProvider>
  );
}
