import { Config } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/config`;

const getConfig = async (): Promise<Config> => {
  const res = await fetch(`${URL}`);

  return res.json();
};

export default getConfig;
