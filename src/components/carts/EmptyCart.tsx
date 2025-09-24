import { IconShoppingCart } from "@tabler/icons-react";

const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <IconShoppingCart className="size-20 text-gray-300" />
      <p className="text-muted-foreground text-center text-sm">
        Keranjang Anda kosong.
      </p>
    </div>
  );
};
export default EmptyCart;
