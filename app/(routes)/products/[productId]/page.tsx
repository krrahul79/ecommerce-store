import { ProductForm } from "./components/product-form";

import getProduct from "@/actions/get-product";

import getCategories from "@/actions/get-categories";

const ProductPage = async ({ params }: { params: { productId: string } }) => {
  const product = await getProduct(params.productId);

  console.log("product in productpage", product);

  const categories = await getCategories();

  console.log("get categories", categories);
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm categories={categories} initialData={product} />
      </div>
    </div>
  );
};

export default ProductPage;
