import { t } from '@/lib/i18n';

interface OpenInAppButtonProps {
  href: string;
}

export function OpenInAppButton({ href }: OpenInAppButtonProps) {
  return (
    <a className="button button--accent" href={href}>
      {t('restaurant.openInApp')}
    </a>
  );
}
