import { format } from "date-fns";
import getProducts from "@/actions/get-products";

import { formatter } from "@/lib/utils";

import { ProductsClient } from "./components/client";
import { ProductColumn } from "./components/columns";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const products = await getProducts({});

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item._id.toString(),
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    isOutOfStock: item.isOutOfStock,
    oldprice: item.oldprice,
    newprice: item.newprice,
    calculateSize: item.calculateSize,
    typeToDisplay: item.typeToDisplay,
    showSize: item.showSize,
    //createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductsClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
