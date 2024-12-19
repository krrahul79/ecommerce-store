import Container from "@/components/ui/container";
import getCategories from "@/actions/get-categories";

import getProducts from "@/actions/get-products";
import getCategory from "@/actions/get-category";
import ProductList from "@/components/product-list";
import CategoryList from "@/components/category-list";
import { CategoryColumn } from "./components/columns";
import { CategoriesClient } from "./components/client";

export const revalidate = 0;

interface CategoryPageProps {
  params: {
    categoryId: string;
  };
  searchParams: {
    colorId: string;
    sizeId: string;
  };
}

const CategoryPage: React.FC<CategoryPageProps> = async ({
  params,
  searchParams,
}) => {
  const categories = await getCategories();

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item._id.toString(),
    name: item.name,
  }));

  // const category = await getCategory(params.categoryId);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoriesClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoryPage;
