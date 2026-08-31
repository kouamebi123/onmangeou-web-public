const CURRENCY_LABEL = 'FCFA';

/**
 * Format d'affichage de repli lorsque l'API n'envoie pas `formatted`.
 * Entiers uniquement, exemple : `12 500 FCFA`.
 */
export function formatFcfa(amount: string): string {
  if (!/^\d+$/.test(amount)) {
    return '';
  }

  const grouped = amount.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${grouped} ${CURRENCY_LABEL}`;
}

export function displayMoney(price: { formatted?: string; amount?: string } | null | undefined): string {
  if (price?.formatted !== undefined && price.formatted.trim() !== '') {
    return price.formatted;
  }

  if (price?.amount !== undefined && price.amount.trim() !== '') {
    return formatFcfa(price.amount);
  }

  return '';
}
