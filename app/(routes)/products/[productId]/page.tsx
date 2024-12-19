import { ProductForm } from "./components/product-form";

import getProduct from "@/actions/get-product";

import getCategories from "@/actions/get-categories";
import { Product } from "@/types";

const ProductPage = async ({ params }: { params: { productId: string } }) => {
  console.log("params", params);
  // const product = await getProduct(params.productId);

  let product: Product | null = null;
  //console.log("params", params.categoryId);
  if (params.productId !== undefined && params.productId !== "new") {
    product = await getProduct(params.productId);
  } else {
    product = null;
  }

  console.log("product in productpage", product);

  const categories = await getCategories();

  const categoriesArray = categories.map((category) => ({
    value: category._id.toString(),
    label: category.name,
  }));

  console.log("get categories", categories);
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm categories={categoriesArray} initialData={product} />
      </div>
    </div>
  );
};

export default ProductPage;
