import type { MenuProps } from "antd";
import {
  ProfileOutlined,
  AppstoreAddOutlined,
  PlusOutlined
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
  const adminSidebarItems: MenuProps["items"] = [
    ...defaultSidebarItems,
    {
      label: "Product",
      key: "product",
      icon: <AppstoreAddOutlined/>,
      children: [
        {
          label: <Link href={`/${role}/product`}>Product</Link>,
          key: `/${role}/product`,
        },
        {
          label: <Link href={`/${role}/add-product`}>Add Product</Link>,
          key: `/${role}/add-product`,
           
        },
      ],
    },
    {
      label: "Category",
      key: "category",
      icon: <PlusOutlined/>,
      children: [
        {
          label: <Link href={`/${role}/category`}>Category</Link>,
          key: `/${role}/category`,
        },
        {
          label: <Link href={`/${role}/add-category`}>Add Category</Link>,
          key: `/${role}/add-category`,
           
        },
      ],
    },
  ];

  // const adminSidebarItems: MenuProps["items"] = [
  //   ...defaultSidebarItems,
  //   {
  //     label: <Link href={`/${role}/product`}>Product</Link>,
  //     icon: <TableOutlined />,
  //     key: `/${role}/product`,
  //   },
  //   {
  //     label: <Link href={`/${role}/add_product`}>Add Product</Link>,
  //     icon: <ThunderboltOutlined />,
  //     key: `/${role}/add_product`,
  //   },
  //   {
  //     label: <Link href={`/${role}/add_product`}>Add Product</Link>,
  //     icon: <ThunderboltOutlined />,
  //     key: `/${role}/add_product`,
  //   }
  // ];

  if (role === USER_ROLE.ADMIN) return adminSidebarItems;
  // else if (role === USER_ROLE.ADMIN) return adminSidebarItems;

  else {
    return defaultSidebarItems;
  }
};