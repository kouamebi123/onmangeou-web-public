import { DishCard } from '@/components/dish-card';
import { EmptyState } from '@/components/empty-state';
import { t } from '@/lib/i18n';
import type { RestaurantMenu as RestaurantMenuType } from '@/lib/types';

interface RestaurantMenuProps {
  menus: RestaurantMenuType[];
}

export function RestaurantMenu({ menus }: RestaurantMenuProps) {
  const hasProducts = menus.some((menu) => menu.categories.some((category) => category.products.length > 0));

  if (!hasProducts) {
    return <EmptyState title={t('restaurant.emptyMenuTitle')} detail={t('restaurant.emptyMenuDetail')} />;
  }

  return (
    <div className="stack">
      {menus.map((menu) => (
        <section className="menu-block" key={menu.id}>
          <h2>{menu.name}</h2>
          {menu.categories.map((category) => (
            <div className="menu-block" key={category.id}>
              <h3>{category.name}</h3>
              {category.description !== null ? <p className="muted">{category.description}</p> : null}
              <div className="dish-grid">
                {category.products.map((product) => (
                  <DishCard key={product.id} dish={product} />
                ))}
              </div>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
