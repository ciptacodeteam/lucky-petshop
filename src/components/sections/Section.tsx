import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

type Props = {
  title?: string;
  description?: string;
  children?: React.ReactNode;
};

const Section = ({ title, description, children }: Props) => {
  return (
    <Card className="gap-4 border-none pt-2 shadow-none">
      <CardHeader className="px-2">
        <CardTitle>{title || "Daftar Data"}</CardTitle>
        <CardDescription>
          {description || "Kelola data Anda di sini."}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2">{children}</CardContent>
    </Card>
  );
};
export default Section;
