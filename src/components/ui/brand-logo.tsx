import SiteLogo from "@/assets/icons/logo/logo.svg";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Props = {
  clickable?: boolean;
  className?: string;
};

const AppLogo = ({ clickable, className }: Props) => {
  return (
    <div className="flex items-center">
      <span className="sr-only">Lucky Petshop</span>
      {clickable ? (
        <Link href="/" className="flex items-center">
          <SiteLogo className={cn("h-16 w-44", className)} />
        </Link>
      ) : (
        <SiteLogo className={cn("h-16 w-44", className)} />
      )}
    </div>
  );
};
export default AppLogo;
