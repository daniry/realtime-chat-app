'use client';

import { FC, useState } from 'react';
import Button from './ui/Button/Button';
import { addFriendSchema } from '@/constants/validations/add-friend';
import axios, { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { set, z } from 'zod';
import { ErrorText } from './ErrorText';

interface AddFriendButtonProps {}

type FormData = z.infer<typeof addFriendSchema>;

export const AddFriendButton: FC<AddFriendButtonProps> = ({}) => {
	const [showSuccess, setShowSuccess] = useState<boolean>(false);

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(addFriendSchema),
	});

	const onSubmit = (data: FormData) => {
		addFriend(data.email);
	};

	const addFriend = async (email: string) => {
		try {
			const validatedEmail = addFriendSchema.parse({ email });

			await axios.post('/api/friends/add', {
				email: validatedEmail,
			});

			setShowSuccess(true);
		} catch (error) {
			if (error instanceof z.ZodError) {
				setError('email', { message: error.message });
				return;
			}
			if (error instanceof AxiosError) {
				setError('email', { message: error.response?.data });
				return;
			}

			setError('email', { message: 'Что-то пошло не так' });
		}
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="max-w-sm"
		>
			<label
				htmlFor="email"
				className="block text-sm font-medium leading-6 text-gray-900"
			>
				Добавить друга по email
			</label>
			<div className="mt-2 flex gap-4">
				<input
					{...register('email')}
					type="text"
					className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					placeholder="email@example.com"
				/>
				<Button>Добавить</Button>
			</div>
			{errors.email?.message && <ErrorText text={errors.email.message} />}
			{showSuccess && (
				<p className="mt-1 text-sm text-green-600">
					Запрос на добавление успешно отправлен!
				</p>
			)}
		</form>
	);
};
