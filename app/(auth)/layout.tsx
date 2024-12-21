import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const AuthLayout = ({ children }: Props) => {
  return (
    <div className="w-full  flex flex-col items-center justify-start">
      {children}
    </div>
  );
};

export default AuthLayout;
