import { getUserSession } from '@/helpers/get-user-session';
import { notFound } from 'next/navigation';
import React from 'react';

const Page = async ({}) => {
	const user = await getUserSession();
	if (!user) notFound();

	return <main className="container py-12">main page</main>;
};

export default Page;
