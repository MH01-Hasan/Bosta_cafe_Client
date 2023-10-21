"use client";
import {
  DeleteOutlined,
  EditOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import UMTable from "@/components/ui/UMTable";
import { Button, Input, message } from "antd";
import Link from "next/link";
import { useState } from "react";
import { useDebounced } from "@/redux/hooks";
import dayjs from "dayjs";
import ActionBar from "@/components/ui/ActionBar";
import { useDeleteProductMutation, useProductsQuery } from "@/redux/api/productApi";
import { ICategory } from "@/types";
import Image from "next/image";


const ProductPage = () => {
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  query["limit"] = size;
  query["page"] = page;
  query["sortBy"] = sortBy;
  query["sortOrder"] = sortOrder;
  query["searchTerm"] = searchTerm;

  const debouncedTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (!!debouncedTerm) {
    query["searchTerm"] = debouncedTerm;
  }
  
  const { data, isLoading } = useProductsQuery({...query});
  const products = data?.products;
  const meta = data?.meta;
  const [deleteProduct] = useDeleteProductMutation(); 

  const deleteHandler = async (id: string,data:string) => {
    alert(`Are you sure Deleting ${data}`);
    message.loading("Deleting.....");
    try {
      await deleteProduct(id);
      message.success("Product Deleted successfully");
    } catch (err: any) {
      message.error(err.message);
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "productImage",
      render: function (data:any) {
        return  <Image
        src={data?.url}
        width={70}
        height={60}
        style={{
          borderRadius:"10px"
        }}
        alt="Picture of the author"
      />;
      }
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Category",
      dataIndex: "category",
      render: function (data: ICategory) {
        return <>{data?.name}</>;
      }
    }, 
    {
      title: "Flavor",
      dataIndex: "flavor",
    },
    {
      title: "Size",
      dataIndex: "size",
    },
    {
      title: "Discount",
      dataIndex: "discount",
      render: (text:any, record:any) => {
        const inlineStyle = {
          color: Number(record?.discount) <= Number(0)? "red" : "green", // Change "red" to your desired color
        };
        return <p style={inlineStyle}>{text}</p>
      }},
    {
      title: "CreatedAt",
      dataIndex: "createdAt",
      render: function (data: any) {
        return data && dayjs(data).format("MMM D, YYYY hh:mm A");
      },
      sorter: true,
    },
    {
      title: "Action",
      render: function (data: any) {
        return (
          <>
            <Link href={`/admin/product/edit/${data?.id}`}>
              <Button
                style={{
                  margin: "0px 5px",
                }}
                onClick={() => console.log(data)}
                type="primary"
              >
                <EditOutlined />
              </Button>
            </Link>
            <Button
              onClick={() => deleteHandler(data?.id,data?.name)}
              type="primary"
              danger
            >
              <DeleteOutlined />
            </Button>
          </>
        );
      },
    },
  ];

  const onPaginationChange = (page: number, pageSize: number) => {
    console.log("Page:", page, "PageSize:", pageSize);
    setPage(page);
    setSize(pageSize);
  };
  const onTableChange = (pagination: any, filter: any, sorter: any) => {
    const { order, field } = sorter;
    // console.log(order, field);
    setSortBy(field as string);
    setSortOrder(order === "ascend" ? "asc" : "desc");
  };

  const resetFilters = () => {
    setSortBy("");
    setSortOrder("");
    setSearchTerm("");
  };
    return (
      <div style={{
        margin:'60px 50px'
      }}>
    
  
        <ActionBar title="Product List">
          <Input
            type="text"
            size="large"
            placeholder="Search..."
            style={{
              width: "20%",
            }}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
          <div>
            <Link href="http://localhost:3000/admin/add-product">
              <Button type="primary">Create</Button>
            </Link>
            {(!!sortBy || !!sortOrder || !!searchTerm) && (
              <Button
                onClick={resetFilters}
                type="primary"
                style={{ margin: "0px 5px" }}
              >
                <ReloadOutlined />
              </Button>
            )}
          </div>
        </ActionBar>
  
        <UMTable
          loading={isLoading}
          columns={columns}
          dataSource={products}
          pageSize={size}
          totalPages={meta?.total}
          showSizeChanger={true}
          onPaginationChange={onPaginationChange}
          onTableChange={onTableChange}
          showPagination={true}
        />
      </div>
    );
  };
  
  export default ProductPage;