"use client";
import {
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import UMTable from "@/components/ui/UMTable";
 import { Button, DatePicker, DatePickerProps, Input, Space, Spin, message } from "antd";
import {  useState,useEffect, use} from "react";
import { useDebounced } from "@/redux/hooks";
import dayjs from "dayjs";
import ActionBar from "@/components/ui/ActionBar";
import { useOrdersQuery, useShopOrdersQuery } from "@/redux/api/ordersApi";
import { getUserInfo } from "@/services/auth.service";
import { set } from "react-hook-form";



const Order = () => {
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setendDate] = useState<string>("");

  const[date1 ,setDate1] = useState<string>('');
  const[date2 ,setDate2] = useState<string>('');

  const [order, setOrder] = useState<any[]>([]); 
  const [loading, setLoading] = useState<boolean>(false);

  query["limit"] = size;
  query["page"] = page;
  query["sortBy"] = sortBy;
  query["sortOrder"] = sortOrder;
  query["searchTerm"] = searchTerm
  query["startDate"] = startDate;
  query["endDate"] = endDate;
  
 


  const handeldateFicker = () => {
 setStartDate(date1)
 setendDate(date2)
  }

  const debouncedTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (!!debouncedTerm) {
    query["searchTerm"] = debouncedTerm;
  }



  
  
  const { role, id } = getUserInfo() as any;

const { data, isLoading: ordersIsLoading } = useOrdersQuery({ ...query });
const orders = data?.orders;
const meta = data?.meta;

const userid = role === "seller" ? id : '';
const { data: shop, isLoading } = useShopOrdersQuery({ id:userid, query: query });
const shoporders = shop?.shopOrders;

useEffect(() => {
  if (role === "admin") {
    setOrder(orders || []);
  } else if (role === "seller") {
    setOrder(shoporders || []);
  }
}, [role, orders, shoporders]);



  const columns = [
    {
      title: "ShopID",
      dataIndex: "user",
      render: function (data: any) {
        return <>{data?.username}</>;
      },
    },

    {
      title: "grandTotal",
      dataIndex: "grandTotal",
    },

    {
      title: "receivedAmount",
      dataIndex: "receivedAmount",
    },
    {
      title: "Change Return",
      dataIndex: "changeReturn",
    },

    {
      title: "paymentMethod",
      dataIndex: "paymentMethod",
    },

    {
        title: "Discount",
        dataIndex: "discount",
        render: (text: any, record: any) => {
          const inlineStyle = {
            color: Number(record?.discount) <= Number(0) ? "red" : "green", // Change "red" to your desired color
          };
          return <p style={inlineStyle}>{text}</p>;
        },
      },
    {
      title: "shipping",
      dataIndex: "shipping",
    },
    {
      title: "tax",
      dataIndex: "tax",
    },
 
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
            {/* <Link href={`/admin/product/edit/${data?.id}`}>
              <Button
                style={{
                  margin: "0px 5px",
                }}
                onClick={() => console.log(data)}
                type="primary"
              >
                <EditOutlined />
              </Button>
            </Link> */}
          {
            role === "admin" &&   <Button
            // onClick={() => deleteHandler(data?.id,data?.name)}
            type="primary"
            danger
          >
            <DeleteOutlined />
          </Button>
          }
          </>
        );
      },
    },
  ];

  const onPaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setSize(pageSize);
  };
  const onTableChange = (pagination: any, filter: any, sorter: any) => {
    const { order, field } = sorter;
    setSortBy(field as string);
    setSortOrder(order === "ascend" ? "asc" : "desc");
  };

  const resetFilters = () => {
    setSortBy("");
    setSortOrder("");
    setSearchTerm("");
    setStartDate("");
    setendDate("");
    setDate1("");
    setDate2("");
  };

  
  const onChange1: DatePickerProps['onChange'] = (date, dateString) => {
    setDate1(`${dateString}T00:00:00Z`);
  };

  const onChange2: DatePickerProps['onChange'] = (date, dateString) => {
    setDate2(`${dateString}T23:59:59Z`)
  };

 

  return (
    <div
      style={{
        margin: "60px 50px",
      }}
    >
      <ActionBar title="Orders List">
     
        <Space style={{
          display: "flex",
        }}>
    <DatePicker onChange={onChange1} />
    <DatePicker onChange={onChange2} />

    <Button onClick={handeldateFicker} style={{
      backgroundColor:"#F009F1",
      color: "white",
      height: "36px",
      width: "99px",
      marginLeft: "15px",
      letterSpacing: "1px",
      fontSize: "18px"
  }
    }> Search</Button>
   
  </Space>
        
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
          
          {(!!sortBy || !!sortOrder || !!searchTerm || !!startDate || !!endDate) && (
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
        loading={role === "admin" ? ordersIsLoading : isLoading}
        columns={columns}
         dataSource={order}
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

export default Order;
