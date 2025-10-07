'use client';

import axios from 'axios';
import { Check, UserPlus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface FriendRequestsProps {
	incomingRequests: IncomingFriendRequest[];
	sessionId: string;
}

export const FriendRequests = ({
	incomingRequests,
	sessionId,
}: FriendRequestsProps) => {
	const router = useRouter();
	const [requests, setRequests] =
		useState<IncomingFriendRequest[]>(incomingRequests);

	const handleAccept = async (senderId: string) => {
		try {
			await axios.post('/api/friends/accept', { id: senderId });
			setRequests((prev) =>
				prev.filter((request) => request.senderId !== senderId)
			);
			router.refresh();
		} catch (error) {
			toast.error('Ошибка при принятии запроса');
			console.error(error);
		}
	};

	const handleDeny = async (senderId: string) => {
		try {
			await axios.post('/api/friends/deny', { id: senderId });
			setRequests((prev) =>
				prev.filter((request) => request.senderId !== senderId)
			);
			router.refresh();
		} catch (error) {
			toast.error('Ошибка при отклонении запроса');
			console.error(error);
		}
	};

	return (
		<>
			{!requests || requests.length === 0 ? (
				<p className="text-sm text-zinc-500">Здесь пусто</p>
			) : (
				requests.map((request) => (
					<div
						key={request.senderId}
						className="flex gap-4 items-center"
					>
						<UserPlus className="text-black" />
						<p className="font-medium text-lg">
							{request.senderEmail}
						</p>
						<button
							aria-label="Принять запрос"
							className="cursor-pointer w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md"
							onClick={() => handleAccept(request.senderId)}
						>
							<Check className="font-semibold text-white w-3/4 h-3/4" />
						</button>
						<button
							aria-label="Отклонить запрос"
							className="cursor-pointer w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md"
							onClick={() => handleDeny(request.senderId)}
						>
							<X className="font-semibold text-white w-3/4 h-3/4" />
						</button>
					</div>
				))
			)}
		</>
	);
};
