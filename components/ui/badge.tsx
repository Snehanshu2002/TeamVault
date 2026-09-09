'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  className,
  dot = false,
}) => {
  const base = 'inline-flex items-center gap-1.5 font-medium rounded-full px-2.5 py-0.5 text-xs';
  const variants = {
    primary: 'bg-indigo-50 text-indigo-700 border border-indigo-200/60',
    secondary: 'bg-slate-100 text-slate-700 border border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    info: 'bg-blue-50 text-blue-700 border border-blue-200',
    outline: 'border border-slate-300 text-slate-600 bg-white',
  };

  const dotColors = {
    primary: 'bg-indigo-500',
    secondary: 'bg-slate-400',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-blue-500',
    outline: 'bg-slate-400',
  };

  return (
    <span className={twMerge(clsx(base, variants[variant], className))}>
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </span>
  );
};
