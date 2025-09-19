import { cn } from "@/lib/utils";

type Props = {
  title: string;
  description?: string;
  children?: React.ReactNode;
  withBorder?: boolean;
};
const AppSectionHeader = ({
  title,
  description,
  children,
  withBorder,
}: Props) => {
  return (
    <header
      className={cn(
        "mb-6 flex items-center justify-between pb-4",
        withBorder && "border-b",
      )}
    >
      <div className="flex flex-col">
        <h2 className="mb-2 text-lg font-semibold">{title}</h2>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </div>
      {children}
    </header>
  );
};
export default AppSectionHeader;
