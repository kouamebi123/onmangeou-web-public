import { t } from '@/lib/i18n';

interface SearchBarProps {
  initialQuery?: string;
}

export function SearchBar({ initialQuery = '' }: SearchBarProps) {
  return (
    <form className="search-bar" action="/recherche" method="get" role="search">
      <label className="visually-hidden" htmlFor="search-q">
        {t('search.label')}
      </label>
      <input
        id="search-q"
        className="search-bar__field"
        type="search"
        name="q"
        defaultValue={initialQuery}
        placeholder={t('search.placeholder')}
        maxLength={120}
        autoComplete="off"
      />
      <button className="button" type="submit">
        {t('search.submit')}
      </button>
    </form>
  );
}
