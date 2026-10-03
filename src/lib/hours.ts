const MINUTES_PER_DAY = 24 * 60;

export const WEEK_DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'] as const;

export interface HoursSlot {
  weekDay: string;
  opensAtMinutes: number;
  closesAtMinutes: number;
}

export interface DaySchedule {
  weekDay: string;
  /** Plages du jour, triées, par exemple `11:00 – 23:00`. Vide : jour de fermeture. */
  ranges: string[];
}

export function formatClockMinutes(totalMinutes: number): string {
  const normalized = ((totalMinutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/**
 * Semaine complète, du lundi au dimanche.
 *
 * L'API n'envoie que les jours d'ouverture : un jour absent est un jour de
 * fermeture et doit rester visible, sinon le visiteur ne sait pas s'il est
 * fermé ou simplement non renseigné.
 */
export function weekSchedule(hours: readonly HoursSlot[]): DaySchedule[] {
  return WEEK_DAYS.map((weekDay) => ({
    weekDay,
    ranges: hours
      .filter((slot) => slot.weekDay === weekDay)
      .sort((left, right) => left.opensAtMinutes - right.opensAtMinutes)
      .map((slot) => `${formatClockMinutes(slot.opensAtMinutes)} – ${formatClockMinutes(slot.closesAtMinutes)}`),
  }));
}

/** Jour de la semaine à l'heure du restaurant, et non à celle du serveur. */
export function weekDayInZone(instant: Date, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone }).format(instant).toUpperCase();
  } catch {
    return new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: 'UTC' }).format(instant).toUpperCase();
  }
}
