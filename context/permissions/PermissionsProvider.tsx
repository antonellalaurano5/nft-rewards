import React from "react";
import { PermissionsContext } from "./PermissionsContext";

export const PermissionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [BandResultUser, setBandResultUser] = React.useState<any>(false);
  const [BandResultAdmin, setBandResulAdmin] = React.useState<any>(false);
  return (
    <PermissionsContext.Provider
      value={
       { BandResultUser, setBandResultUser, BandResultAdmin, setBandResulAdmin}
      }
    >
      {children}
    </PermissionsContext.Provider>
  );
};
