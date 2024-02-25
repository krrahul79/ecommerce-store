import CategoryCard from "@/components/ui/category-card";
import { Category } from "@/types";
import NoResults from "@/components/ui/no-results";

interface CategoryListProps {
  title: string;
  items: Category[];
}

const CategoryList: React.FC<CategoryListProps> = ({ items }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-3xl">Featured Categories</h3>
      {items.length === 0 && <NoResults />}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <CategoryCard key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
