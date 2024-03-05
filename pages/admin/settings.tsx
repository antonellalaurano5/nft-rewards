import React from "react";

// components

import { CardProfile, CardSettings } from "@/components/Cards";


// layout for page


import { AdminLayout } from "@/layouts/Admin";
import { useUser } from "@/hooks/user";


export default function Settings() {
  const { user } = useUser();
  return (
    <>
      <div className="flex flex-wrap mt-40">
        <div className="w-full lg:w-8/12 px-4">
          <CardSettings />
        </div>
        <div className="w-full lg:w-4/12 px-4">
          <CardProfile user={user} />
        </div>
      </div>
    </>
  );
}

Settings.layout = AdminLayout;
