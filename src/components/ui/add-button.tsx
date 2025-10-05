"use client";

import { IconPlus } from "@tabler/icons-react";
import { Button, type ButtonProps } from "./button";

type Props = ButtonProps & {};

const AddButton = ({ ...props }: Props) => {
  return (
    <Button variant={"secondary"} {...props}>
      <IconPlus className="size-5" />
      Buat Baru
    </Button>
  );
};
export default AddButton;
