import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
}

export function Button({ children, variant = 'primary', className, ...props }: ButtonProps) {
    return (
        <button
            className={twMerge(
                clsx(
                    'px-4 py-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
                    {
                        'bg-primary-purple text-white hover:bg-purple-500': variant === 'primary',
                        'bg-dark-surface border border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white': variant === 'secondary',
                        'bg-red-500/10 text-red-500 hover:bg-red-500/20': variant === 'danger',
                    },
                    className
                )
            )}
            {...props}
        >
            {children}
        </button>
    );
}
