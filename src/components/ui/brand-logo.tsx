import SiteLogo from "@/assets/icons/logo/logo.svg";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Props = {
  clickable?: boolean;
  logoClassName?: string;
};

const AppLogo = ({ clickable, logoClassName }: Props) => {
  return (
    <div className="flex items-center">
      <span className="sr-only">Lucky Petshop</span>
      {clickable ? (
        <Link href="/" className="flex items-center">
          <SiteLogo className={cn("h-16 w-44", logoClassName)} />
        </Link>
      ) : (
        <SiteLogo className={cn("h-16 w-44", logoClassName)} />
      )}
    </div>
  );
};
export default AppLogo;
