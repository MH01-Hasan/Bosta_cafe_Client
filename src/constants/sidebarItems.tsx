import type { MenuProps } from "antd";
import {
  ProfileOutlined,
  AppstoreAddOutlined,
  PlusOutlined,
  AppstoreOutlined
} from "@ant-design/icons";
import Link from "next/link";
import { USER_ROLE } from "./role";

export const sidebarItems = (role: string) => {
  const defaultSidebarItems: MenuProps["items"] = [
    {
      label: "Profile",
      key: "profile",
      icon: <ProfileOutlined />,
      children: [
        {
          label: <Link href={`/${role}`}>Account Profile</Link>,
          key: `/${role}/profile`,
        },
        {
          label: <Link href={`/${role}/change-password`}>Change Password</Link>,
          key: `/${role}/change-password`,
        },
      ],
    },
  ];


  const OrderSidebarItems: MenuProps["items"] = [
    {
      label: "Orders",
      key: "orders",
      icon: <AppstoreOutlined />,
      children: [
        {
          label: <Link href={`/${role}/orders`}>All Orders</Link>,
          key: `/orders`,
        },
       
      ],
    },
   
  ];


  const adminSidebarItems: MenuProps["items"] = [
    ...defaultSidebarItems,
    {
      label: " Product",
      key: "product",
      icon: <AppstoreAddOutlined/>,
      children: [
        {
          label: <Link href={`/${role}/product`}>All Product</Link>,
          key: `/${role}/product`,
        },
        {
          label: <Link href={`/${role}/add-product`}>Add Product</Link>,
          key: `/${role}/add-product`,
           
        },
      ],
    },
  
    {
      label: " Category",
      key: "category",
      icon: <PlusOutlined/>,
      children: [
        {
          label: <Link href={`/${role}/category`}>All Category</Link>,
          key: `/${role}/category`,
        },
        {
          label: <Link href={`/${role}/add-category`}>Add Category</Link>,
          key: `/${role}/add-category`,
           
        },
      ],
    },
    {
      label: "Branch",
      key: "branch",
      icon: <AppstoreOutlined />,
      children: [
        {
          label: <Link href={`/${role}/branch`}>All Branch</Link>,
          key: `/${role}/branch`,
        },
        {
          label: <Link href={`/${role}/creat-branch`}>Creat New Branch</Link>,
          key: `/${role}/creat-branch`,
           
        },
      ],
    },

    ...OrderSidebarItems


   
  ];






  const SellerSidebarItems: MenuProps["items"] = [
    ...defaultSidebarItems,
    {
      label: "Orders",
      key: "orders",
      icon: <AppstoreOutlined />,
      children: [
        {
          label: <Link href={`/${role}/orders/`}>All Orders</Link>,
          key: `/orders`,
        },
       
      ],
    },
   
  ];

  if (role === USER_ROLE.ADMIN) return adminSidebarItems;
  else if (role === USER_ROLE.SELLER) return SellerSidebarItems;

  else {
    return defaultSidebarItems;
  }
};