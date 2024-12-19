import CategoryCard from "@/components/ui/category-card";
import { Brand } from "@/types";
import NoResults from "@/components/ui/no-results";
import BrandCard from "./ui/brand-card";

interface BrandListProps {
  title: string;
  items: Brand[];
}

const BrandList: React.FC<BrandListProps> = ({ items }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-2xl">Popular Brands</h3>
      {items.length === 0 && <NoResults />}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-6 gap-4">
        {items.map((item) => (
          <BrandCard key={item._id} data={item} />
        ))}
      </div>
    </div>
  );
};

export default BrandList;
