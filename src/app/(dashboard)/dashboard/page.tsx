import Button from '@/components/ui/Button/Button';
import { authOptions } from '@/constants/auth-options';
import { getServerSession } from 'next-auth';
import React from 'react';

const Page = async ({}) => {
	const session = await getServerSession(authOptions);

	return (
		<main className="p-8">
			<input
				type="email"
				className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm"
			/>
		</main>
	);
};

export default Page;
