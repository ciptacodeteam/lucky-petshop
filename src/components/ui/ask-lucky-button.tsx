"use client";

import { IconPaw } from "@tabler/icons-react";
import Link from "next/link";

const AskLuckyButton = () => {
  return (
    <Link
      href={"#"}
      className="text-primary bg-warning/20 flex items-center gap-2 rounded-full p-1 pr-4 text-sm"
    >
      <div className="bg-warning relative flex size-7 items-center justify-center rounded-full p-1">
        <IconPaw size={20} className="rotate-45 text-white" />
        <span className="bg-warning absolute inline-flex h-full w-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full opacity-75"></span>
      </div>
      <span className="text-sm font-bold">Ask Lucky</span>
    </Link>
  );
};
export default AskLuckyButton;
