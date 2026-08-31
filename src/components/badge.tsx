interface BadgeProps {
  children: string;
  variant?: 'default' | 'accent' | 'warning';
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const className = variant === 'default' ? 'badge' : `badge badge--${variant}`;

  return <span className={className}>{children}</span>;
}
