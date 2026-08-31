import { t } from '@/lib/i18n';
import { displayMoney } from '@/lib/money';
import type { MoneyView } from '@/lib/types';

interface PriceProps {
  value: MoneyView | null | undefined;
  prefix?: string;
}

export function Price({ value, prefix }: PriceProps) {
  const formatted = displayMoney(value);

  if (formatted === '') {
    return <span className="price">{t('price.unavailable')}</span>;
  }

  return (
    <span className="price">
      {prefix === undefined ? formatted : `${prefix} ${formatted}`}
    </span>
  );
}
