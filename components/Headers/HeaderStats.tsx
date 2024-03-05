import React from "react";
// import { CardStats } from "../Cards";
// import { useQuery } from "react-query";
// import { UserType } from "@/interfaces/user";
// import axios from "axios";

// components



export default function HeaderStats() {
  // const [usersRole, setUsersRole] = useState<number>(0);
  // const {
	// 	data: users,
	// 	//isLoading,
	// } = useQuery<UserType[] | undefined>('USERS', async () => {
  //   const response = await axios.get('/api/users');
  //   if (response?.data?.usersData) {
  //     const roleIsUser = response?.data?.usersData?.filter((user: UserType) => user.role == 'user');
  //     setUsersRole(roleIsUser.length);
  //     return response.data.usersData
  //   } else {
  //     return [];
  //   }
  // }, {
	// 	refetchOnWindowFocus: false,
	// });

  return (
    <>
      {/* Header */}
      <div className="relative bg-blueGray-800 pt-20">
        <div className="px-4 md:px-10 mx-auto w-full">
          <div>
            {/* Card stats
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Users"
                  statTitle={users?.length ? users?.length.toString()  :  '0'}
                  // statArrow="up"
                  // statPercent="3.48"
                  // statPercentColor="text-emerald-500"
                  statDescripiron=""
                  statIconName="far fa-chart-bar"
                  statIconColor="bg-red-500"
                />
              </div> */}
              {/* <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="NEW USERS"
                  statTitle="2,356"
                  statArrow="down"
                  statPercent="3.48"
                  statPercentColor="text-red-500"
                  statDescripiron="Since last week"
                  statIconName="fas fa-chart-pie"
                  statIconColor="bg-orange-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="SALES"
                  statTitle="924"
                  statArrow="down"
                  statPercent="1.10"
                  statPercentColor="text-orange-500"
                  statDescripiron="Since yesterday"
                  statIconName="fas fa-users"
                  statIconColor="bg-pink-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="PERFORMANCE"
                  statTitle="49,65%"
                  statArrow="up"
                  statPercent="12"
                  statPercentColor="text-emerald-500"
                  statDescripiron="Since last month"
                  statIconName="fas fa-percent"
                  statIconColor="bg-lightBlue-500"
                />
              </div> */}
            {/* </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
