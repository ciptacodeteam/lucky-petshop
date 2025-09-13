"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { IconSearch } from "@tabler/icons-react";

type Props = {
  placeholder?: string;
};

const GlobalSearchBar = ({ placeholder }: Props) => {
  const [value, setValue] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className="relative w-full max-w-[424px]">
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder || "Cari sesuatu..."}
        className="bg-muted w-full rounded-lg border-none p-6"
      />
      <Button
        size={"icon"}
        className="absolute top-0 right-0 size-12 rounded-l-none rounded-r-lg [&_svg]:!size-5"
      >
        <IconSearch />
      </Button>
    </div>
  );
};
export default GlobalSearchBar;
