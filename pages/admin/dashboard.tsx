import React from "react";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { useQuery } from "react-query";
import axios from "axios";

// components
import { AdminLayout } from "@/layouts/Admin";
import { UserType } from "@/interfaces/user";
import { CardProfile } from "@/components/Cards";

export default function Dashboard() {

  const {
		data: users,
		//isLoading,
	} = useQuery<UserType[] | undefined>('USERS', async () => {
    const response = await axios.get('/api/users');
    if (response?.data?.usersData) {
      return response.data.usersData
    } else {
      return [];
    }
  }, {
		refetchOnWindowFocus: false,
	});

  return (
    <>
      <div className="flex flex-wrap">
        <div className="mt-40 w-full">
          <h1 className="w-full text-center text-4xl font-bold" >
            Users
          </h1>
          <div className="flex gap-x-4 gap-12">
            {users?.map((user) => (
              <CardProfile key={user.id} user={user} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
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
Dashboard.layout = AdminLayout;
