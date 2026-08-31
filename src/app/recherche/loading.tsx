import { RestaurantListSkeleton } from '@/components/skeleton';

export default function SearchLoading() {
  return (
    <div className="page">
      <RestaurantListSkeleton count={4} />
    </div>
  );
}
