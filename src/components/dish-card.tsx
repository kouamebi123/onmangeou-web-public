import { Badge } from '@/components/badge';
import { Price } from '@/components/price';
import { t } from '@/lib/i18n';
import type { MenuProduct } from '@/lib/types';

interface DishCardProps {
  dish: MenuProduct;
}

export function DishCard({ dish }: DishCardProps) {
  return (
    <article className={dish.available ? 'dish-card' : 'dish-card dish-card--unavailable'}>
      {dish.imageUrl !== null ? <img className="card-cover" src={dish.imageUrl} alt="" /> : null}
      <div className="card-meta">
        <Price value={dish.price} />
        {dish.available ? null : <Badge variant="warning">{t('dish.unavailable')}</Badge>}
      </div>
      <h3>{dish.name}</h3>
      {dish.description !== null ? <p className="muted">{dish.description}</p> : null}
      <div className="card-meta">
        {dish.vegetarian ? <Badge>{t('dish.vegetarian')}</Badge> : null}
        {dish.halal ? <Badge>{t('dish.halal')}</Badge> : null}
        {dish.spicyLevel !== null && dish.spicyLevel > 0 ? <Badge variant="accent">{t('dish.spicy')}</Badge> : null}
        {dish.preparationMinutes !== null ? <Badge>{t('dish.prepTime', { minutes: String(dish.preparationMinutes) })}</Badge> : null}
      </div>
      {dish.allergens.length > 0 ? <p className="muted">{t('dish.allergens', { list: dish.allergens.join(', ') })}</p> : null}
    </article>
  );
}
