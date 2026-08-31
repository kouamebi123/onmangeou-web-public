/** Lien profond placeholder vers l'application mobile. */
export function restaurantAppLink(slug: string): string {
  return `onmangeou://restaurants/${encodeURIComponent(slug)}`;
}

export function homeAppLink(): string {
  return 'onmangeou://home';
}
