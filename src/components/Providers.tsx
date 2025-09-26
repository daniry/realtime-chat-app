'use client';

// import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import NextTopLoader from 'nextjs-toploader';
import { FC, PropsWithChildren } from 'react';

export const Providers: FC<PropsWithChildren> = ({ children }) => {
	return (
		<>
			{/* <SessionProvider>{children}</SessionProvider> */}
			{children}
			<Toaster
				position="top-center"
				reverseOrder={false}
			/>
			<NextTopLoader />
		</>
	);
};
