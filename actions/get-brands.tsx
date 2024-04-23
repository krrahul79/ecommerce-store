import { Brand } from "@/types";
import qs from "query-string";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/brands`;

interface Query {
  isFeatured?: boolean;
}

const getBrands = async (query: Query): Promise<Brand[]> => {
  const url = qs.stringifyUrl({
    url: URL,
    query: {
      isFeatured: query.isFeatured,
    },
  });
  const res = await fetch(url, { cache: "no-store" });
  // const res = await fetch(URL);

  return res.json();
};

export default getBrands;
