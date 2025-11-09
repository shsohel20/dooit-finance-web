import { cookies } from "next/headers";


export const getToken = () => {
  const token = cookies().get("token");
  return token?.value || null;
};
export const token = getToken();