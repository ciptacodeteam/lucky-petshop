"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import AddButton from "../ui/add-button";

type Props = {
  title?: string;
  description?: string;
  children: React.ReactNode;
  triggerChildren?: React.ReactNode;
};

const Modal = ({ title, description, children, triggerChildren }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{triggerChildren || <AddButton />}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <main className="pt-2">{children}</main>
      </DialogContent>
    </Dialog>
  );
};
export default Modal;
