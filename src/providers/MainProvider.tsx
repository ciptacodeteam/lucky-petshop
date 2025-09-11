"use client";

type Props = {
  children: React.ReactNode;
};

const MainProvider = ({ children }: Props) => {
  return <>{children}</>;
};
export default MainProvider;
