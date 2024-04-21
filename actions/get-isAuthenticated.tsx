import { Admin } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/authentication`;

const getAdmin = async (): Promise<Admin> => {
  const res = await fetch(URL);
  return res.json();
};

export default getAdmin;
