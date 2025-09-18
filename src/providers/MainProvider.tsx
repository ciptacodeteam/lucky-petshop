"use client";

import { Toaster } from "sonner";

type Props = {
  children: React.ReactNode;
};

const MainProvider = ({ children }: Props) => {
  return (
    <>
      {children}
      <Toaster position="top-center" richColors />
    </>
  );
};
export default MainProvider;
