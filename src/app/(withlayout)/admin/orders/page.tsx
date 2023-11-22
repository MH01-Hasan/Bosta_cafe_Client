"use client";

import Order from "@/components/order/Order";
import { getUserInfo } from "@/services/auth.service";

const page = () => {
  const { role } = getUserInfo() as any;

  return (
    <>
    {
      role === "admin" && <Order />
    }
  
  </>
  );
};

export default page;
