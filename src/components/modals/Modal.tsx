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
import { cn } from "@/lib/utils";

type Props = {
  title?: string;
  description?: string;
  children: React.ReactNode;
  triggerChildren?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const Modal = ({
  title,
  description,
  children,
  triggerChildren,
  size,
  className,
}: Props) => {
  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-3xl",
  };
  const dialogSize = size ? sizes[size] : sizes.md;

  return (
    <Dialog>
      <DialogTrigger asChild>{triggerChildren || <AddButton />}</DialogTrigger>
      <DialogContent className={cn("w-[450px]", dialogSize, className)}>
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
