import { HelmetProvider } from "react-helmet-async";
import type { PropsWithChildren } from "react";

export function SeoProvider({ children }: PropsWithChildren) {
  return <HelmetProvider>{children}</HelmetProvider>;
}