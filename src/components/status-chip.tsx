import { t } from '@/lib/i18n';

interface StatusChipProps {
  open: boolean;
  closesInMinutes?: number | null;
  opensInMinutes?: number | null;
}

export function StatusChip({ open, closesInMinutes, opensInMinutes }: StatusChipProps) {
  let label = open ? t('status.open') : t('status.closed');

  if (open && closesInMinutes !== null && closesInMinutes !== undefined && closesInMinutes <= 45) {
    label = t('status.closesIn', { minutes: String(closesInMinutes) });
  } else if (!open && opensInMinutes !== null && opensInMinutes !== undefined && opensInMinutes <= 45) {
    label = t('status.opensIn', { minutes: String(opensInMinutes) });
  }

  return <span className={open ? 'status-chip status-chip--open' : 'status-chip status-chip--closed'}>{label}</span>;
}
