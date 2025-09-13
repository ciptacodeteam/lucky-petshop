import MainHeader from "@/components/headers/MainHeader";

type Props = {
  children: React.ReactNode;
};

const ClientLayout = ({ children }: Props) => {
  return (
    <>
      <MainHeader withAnnouncement />
      {children}
    </>
  );
};
export default ClientLayout;
