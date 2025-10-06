import { cn } from '@/lib/utils';
import React from 'react';

interface ErrorTextProps {
	text: string;
	className?: string;
}

export const ErrorText: React.FC<ErrorTextProps> = ({ text, className }) => {
	return <p className={cn('mt-1 text-sm text-red-600', className)}>{text}</p>;
};
