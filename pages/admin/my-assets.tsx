import { AdminLayout } from "@/layouts/Admin";

import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { MyAssetsComponent } from "@/components/my-assets";

const Myassets = () => {
	
  return (
    <AdminLayout>
      <MyAssetsComponent></MyAssetsComponent>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default Myassets;
