import { IconLogin, IconShoppingCart } from "@tabler/icons-react";
import { Button } from "../ui/button";

const UnauthenticatedCart = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <IconShoppingCart className="size-20 text-gray-300" />
      <p className="text-muted-foreground text-center text-sm">
        Silakan masuk untuk melihat keranjang Anda.
      </p>

      <footer className="flex w-full justify-center gap-4 pt-4">
        <Button variant="outline" size="sm">
          <IconLogin className="size-5" />
          Masuk
        </Button>
        <Button variant="ghost" size="sm">
          Daftar
        </Button>
      </footer>
    </div>
  );
};
export default UnauthenticatedCart;
