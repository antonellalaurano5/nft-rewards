import { UserType } from '@/interfaces/user';
import axios from 'axios';
import { useQuery } from 'react-query';
import { useAccount } from 'wagmi';

export const useUser = () => {
  const { address, isConnected } = useAccount();

	const {
		data: userData,
		refetch,
		isLoading,
	} = useQuery<UserType | undefined>('USER', async () => {
		const response = await axios.get(`/api/user/${address}`);
		return response?.data;
	}, {
		refetchOnWindowFocus: false,
    enabled: isConnected
	});

	return {
		user: userData,
		isLoading,
		refetch,
	};
};
