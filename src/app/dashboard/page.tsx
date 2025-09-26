import Button from '@/components/ui/Button/Button';
import React from 'react';

interface Props {
	className?: string;
}

const Page: React.FC<Props> = ({ className }) => {
	return (
		<div className={className}>
			<Button variant={'default'}>btn</Button>
		</div>
	);
};

export default Page;
