type Props = {
  children: Readonly<React.ReactNode>;
};
const AuthLayout = ({ children }: Props) => {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center">
      {children}
    </div>
  );
};
export default AuthLayout;
