import { Config } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/config`;

const getConfig = async (): Promise<Config> => {
  const res = await fetch(`${URL}`, { cache: "no-store" });

  return res.json();
};

export default getConfig;
