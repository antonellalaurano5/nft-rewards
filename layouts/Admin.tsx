import React from "react";

// components

import { AdminNavbar } from "@/components/Navbars";
import Sidebar from "@/components/Sidebar/Sidebar";
import HeaderStats from "@/components/Headers/HeaderStats";
//import { FooterAdmin } from "@/components/Footers/FooterAdmin";

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100 min-h-screen">
        <AdminNavbar />
        {/* Header */}
        <HeaderStats />
        <div 
          className="px-4 md:px-10 mx-auto w-full -m-24 min-h-screen"
          style={{
            backgroundImage: "url('/img/dashboard_bg.png')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPositionX: "right",
            backgroundPositionY: "bottom",
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
};
