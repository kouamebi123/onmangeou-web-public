import messages from '@/i18n/fr-CI.json';

type Messages = typeof messages;

type NestedKey<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends string
    ? `${Prefix}${K}`
    : T[K] extends readonly unknown[]
      ? never
      : NestedKey<T[K], `${Prefix}${K}.`>;
}[keyof T & string];

export type MessageKey = NestedKey<Messages>;

function lookup(key: string): string | undefined {
  const parts = key.split('.');
  let current: unknown = messages;

  for (const part of parts) {
    if (typeof current !== 'object' || current === null || !(part in current)) {
      return undefined;
    }

    current = (current as Record<string, unknown>)[part];
  }

  return typeof current === 'string' ? current : undefined;
}

export function t(key: MessageKey, vars?: Record<string, string>): string {
  const template = lookup(key);

  if (template === undefined) {
    throw new Error(`Missing i18n key: ${key}`);
  }

  if (vars === undefined) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (_match, name: string) => {
    return vars[name] ?? `{${name}}`;
  });
}

export function getMessages(): Messages {
  return messages;
}

export function serviceLabel(service: string): string {
  switch (service) {
    case 'DINE_IN':
      return t('service.DINE_IN');
    case 'TAKEAWAY':
      return t('service.TAKEAWAY');
    case 'DELIVERY':
      return t('service.DELIVERY');
    case 'RESERVATION':
      return t('service.RESERVATION');
    default:
      return service;
  }
}

export function weekdayLabel(weekDay: string): string {
  switch (weekDay) {
    case 'MONDAY':
      return t('weekday.MONDAY');
    case 'TUESDAY':
      return t('weekday.TUESDAY');
    case 'WEDNESDAY':
      return t('weekday.WEDNESDAY');
    case 'THURSDAY':
      return t('weekday.THURSDAY');
    case 'FRIDAY':
      return t('weekday.FRIDAY');
    case 'SATURDAY':
      return t('weekday.SATURDAY');
    case 'SUNDAY':
      return t('weekday.SUNDAY');
    default:
      return weekDay;
  }
}
