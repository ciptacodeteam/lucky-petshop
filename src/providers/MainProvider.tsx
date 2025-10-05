"use client";

import { ConfirmDialogProvider } from "@/components/ui/confirm-dialog";
import { Toaster } from "sonner";

type Props = {
  children: React.ReactNode;
};

const MainProvider = ({ children }: Props) => {
  return (
    <>
      <ConfirmDialogProvider>
        {children}
        <Toaster position="top-center" richColors />
      </ConfirmDialogProvider>
    </>
  );
};
export default MainProvider;
