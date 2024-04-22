import { Brand } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/brands`;

const getCategories = async (): Promise<Brand[]> => {
  const res = await fetch(URL, { cache: "no-store" });
  // const res = await fetch(URL);

  return res.json();
};

export default getCategories;
