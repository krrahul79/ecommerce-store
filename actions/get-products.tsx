import { Product } from "@/types";
import qs from "query-string";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

interface Query {
  categoryId?: string;
  brandId?: string;
  isFeatured?: boolean;
}

const getProducts = async (query: Query): Promise<Product[]> => {
  const url = qs.stringifyUrl({
    url: URL,
    query: {
      categoryId: query.categoryId,
      isFeatured: query.isFeatured,
      brandId: query.brandId,
    },
  });

  const res = await fetch(url, { cache: "no-store" });

  //const res = await fetch(url);

  return res.json();
};

export default getProducts;
