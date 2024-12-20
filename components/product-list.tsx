import ProductCard from "@/components/ui/product-card";
import { Product } from "@/types";
import NoResults from "@/components/ui/no-results";

interface ProductListProps {
  title: string;
  items: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ title, items }) => {
  console.log("items", items);
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-2xl">{title}</h3>
      {items.length === 0 && <NoResults />}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-6 gap-4">
        {items.map((item) =>
          !item?.isChildProduct ? (
            <ProductCard key={item._id} data={item} />
          ) : null
        )}
      </div>
    </div>
  );
};

export default ProductList;
