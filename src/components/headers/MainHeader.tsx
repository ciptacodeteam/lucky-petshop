import { IconShoppingCart, IconUser } from "@tabler/icons-react";
import GlobalSearchBar from "../search/GlobalSearchBar";
import AppLogo from "../ui/brand-logo";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import AnnouncementBar from "./AnnouncementBar";
import MobileSidebar from "../sidebars/MobileSidebar";

type Props = {
  withAnnouncement?: boolean;
};

const MainHeader = ({ withAnnouncement }: Props) => {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 min-h-24">
      <div className="w-full bg-white shadow-md">
        {withAnnouncement && <AnnouncementBar />}

        <div className="container mx-auto grid grid-cols-2 px-4 py-3">
          <div className="flex w-full items-center gap-4">
            <AppLogo className="h-16 w-44" />
            <span className="text-primary ml-2 hidden text-lg font-bold md:block xl:ml-10">
              #YourPetDeservesTheBest
            </span>
          </div>
          <div className="hidden w-full items-center justify-end gap-6 lg:flex">
            <div className="mr-0 hidden w-full md:flex md:justify-end xl:mr-10">
              <GlobalSearchBar placeholder="Search your products..." />
            </div>
            <Button
              variant={"ghost"}
              size={"icon"}
              className="hover:bg-inherit"
            >
              <IconUser />
            </Button>
            <Button
              variant={"ghost"}
              size={"icon"}
              className="relative hover:bg-inherit"
            >
              <Badge className="bg-accent text-accent-foreground absolute -top-0 -right-0 h-4 min-w-4 rounded-full px-1 font-mono tabular-nums">
                1
              </Badge>
              <IconShoppingCart />
            </Button>
          </div>

          {/* Mobile Sidebar */}
          <MobileSidebar />
        </div>
      </div>
    </header>
  );
};
export default MainHeader;
