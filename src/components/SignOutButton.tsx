'use client';

import { ButtonHTMLAttributes, useCallback, useState } from 'react';
import Button from './ui/Button/Button';
import toast from 'react-hot-toast';
import { Loader2, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const SignOutButton = ({ ...props }: SignOutButtonProps) => {
	const [isSignedOut, setIsSignedOut] = useState<boolean>(false);

	const handleSignOut = useCallback(async () => {
		setIsSignedOut(true);
		try {
			await signOut();
		} catch (error) {
			toast.error('Ошибка при выходе из аккаунта');
		} finally {
			setIsSignedOut(false);
		}
	}, []);

	return (
		<Button
			{...props}
			variant={'ghost'}
			onClick={handleSignOut}
		>
			{isSignedOut ? (
				<Loader2 className="animate-spin h-4 w-4" />
			) : (
				<LogOut className="h-4 w-4" />
			)}
		</Button>
	);
};
