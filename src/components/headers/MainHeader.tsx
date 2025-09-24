import { IconShoppingCart, IconUser } from "@tabler/icons-react";
import GlobalSearchBar from "../search/GlobalSearchBar";
import CartSheet from "../sheets/CartSheet";
import MobileSidebar from "../sidebars/MobileSidebar";
import { Badge } from "../ui/badge";
import AppLogo from "../ui/brand-logo";
import { Button } from "../ui/button";
import AnnouncementBar from "./AnnouncementBar";
import CategoryBar from "./CategoryBar";

type Props = {
  withAnnouncement?: boolean;
  withCategoryBar?: boolean;
};

const MainHeader = ({ withAnnouncement, withCategoryBar }: Props) => {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 min-h-24">
      <div className="w-full bg-white">
        {withAnnouncement && <AnnouncementBar />}

        <div className="container mx-auto grid grid-cols-2 px-4 py-3">
          <div className="flex w-full items-center gap-4">
            <AppLogo className="h-16 w-44" />
            <span className="text-primary ml-2 hidden text-lg font-bold lg:block xl:ml-10">
              #YourPetDeservesTheBest
            </span>
          </div>
          <div className="flex w-full items-center justify-end gap-2">
            <div className="mr-0 hidden w-full sm:mr-4 lg:flex lg:justify-end xl:mr-10">
              <GlobalSearchBar placeholder="Search your products..." />
            </div>
            <Button
              variant={"ghost"}
              size={"icon"}
              className="hover:bg-inherit"
            >
              <IconUser />
            </Button>
            <CartSheet>
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
            </CartSheet>
            <div className="ml-1 lg:hidden">
              <MobileSidebar />
            </div>
          </div>
        </div>

        {withCategoryBar && (
          <div className="hidden lg:block">
            <CategoryBar />
          </div>
        )}
      </div>
    </header>
  );
};
export default MainHeader;
