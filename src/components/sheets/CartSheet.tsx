import { IconShoppingCart } from "@tabler/icons-react";
import { Button } from "../ui/button";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import UnauthenticatedCart from "../carts/UnauthenticatedCart";
import { Badge } from "../ui/badge";

type Props = {
  children?: React.ReactNode;
};

const CartSheet = ({ children }: Props) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {children || (
          <Button
            variant={"ghost"}
            size={"icon"}
            className="relative hover:bg-inherit"
          >
            <IconShoppingCart />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="border-b">
          <SheetTitle>Keranjang</SheetTitle>
          <SheetDescription>
            Berikut adalah item di keranjang Anda.
          </SheetDescription>
        </SheetHeader>

        <main className="mt-4 flex-1 overflow-y-auto">
          <UnauthenticatedCart />
        </main>

        <SheetFooter className="mt-4 flex justify-end gap-2 border-t pt-4">
          <SheetClose asChild>
            <Button variant="outline">Lanjutkan Belanja</Button>
          </SheetClose>
          <Button>
            <Badge className="bg-accent text-accent-foreground h-4 min-w-4 rounded-full px-1 font-mono tabular-nums">
              1
            </Badge>
            Checkout
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
export default CartSheet;
