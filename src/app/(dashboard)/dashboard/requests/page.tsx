import { FriendRequests } from '@/components/FriendRequests';
import { getUserSession } from '@/helpers/get-user-session';
import { fetchRedis } from '@/helpers/redis';
import { notFound } from 'next/navigation';
import React from 'react';

const Page = async () => {
	const user = await getUserSession();
	if (!user) notFound();

	// id людей, которые отправили запрос на добавление в друзья
	const incomingFriendsIds = (await fetchRedis(
		'smembers',
		`user:${user.id}:incoming_friend_requests`
	)) as string[];

	const incomingFriendRequests = await Promise.all(
		incomingFriendsIds.map(async (senderId) => {
			const sender = (await fetchRedis(
				'get',
				`user:${senderId}`
			)) as string;
			const senderData = JSON.parse(sender);

			return {
				senderId,
				senderEmail: senderData.email,
			};
		})
	);

	return (
		<main className="pt-8">
			<h1 className="font-bold text-5xl mb-8">Добавить друга</h1>
			<div className="flex flex-col gap-4">
				<FriendRequests
					incomingRequests={incomingFriendRequests}
					sessionId={user.id}
				/>
			</div>
		</main>
	);
};

export default Page;
