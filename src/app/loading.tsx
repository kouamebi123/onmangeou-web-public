import { RestaurantListSkeleton } from '@/components/skeleton';

export default function HomeLoading() {
  return (
    <div className="page">
      <RestaurantListSkeleton />
    </div>
  );
}
