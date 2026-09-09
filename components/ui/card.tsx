'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, hoverable = false, children, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs transition-all duration-200',
          hoverable && 'hover:shadow-md hover:border-slate-300',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={twMerge(clsx('flex items-center justify-between pb-4 mb-4 border-b border-slate-100', className))} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, children, ...props }) => (
  <h3 className={twMerge(clsx('text-base font-semibold text-slate-900', className))} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, children, ...props }) => (
  <p className={twMerge(clsx('text-xs text-slate-500 mt-0.5', className))} {...props}>
    {children}
  </p>
);
