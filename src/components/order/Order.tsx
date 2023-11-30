"use client";
import { DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
import UMTable from "@/components/ui/UMTable";
import { Button,  Input,  } from "antd";
import { useState, useEffect } from "react";
import { useDebounced } from "@/redux/hooks";
import dayjs from "dayjs";
import ActionBar from "@/components/ui/ActionBar";
import { useOrderQuery, useOrdersQuery, useShopOrdersQuery } from "@/redux/api/ordersApi";
import { getUserInfo } from "@/services/auth.service";
import { useBranchsQuery } from "@/redux/api/branchApi";
import FormSelectField from "../ui/Forms/FormSelectField";
import Form from "../ui/Forms/Form";
import FormDatePicker from "../ui/Forms/FormDatePicker";
import './Order.css'
import { useDispatch, useSelector } from "react-redux";
import { setEndDate, setStartDate, setUserId } from "@/redux/api/dateSlics";
import Link from "next/link";
import { GrFormView } from "react-icons/gr";

const Order = () => {

  const query: any= {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(20);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [order, setOrder] = useState<any[]>([]);

  // -----------------------------date-------------------------------------------
  const dispatch = useDispatch();
  const date = useSelector((state:any) => state?.date);

  const startDate = date?.startDate;
  const endDate = date?.endDate;
  const userId = date?.userId;

  query["limit"] = size;
  query["page"] = page;
  query["sortBy"] = sortBy;
  query["sortOrder"] = sortOrder;
  query["searchTerm"] = searchTerm;
  query["startDate"] = startDate;
  query["endDate"] = endDate;
  query["userId"] = userId;
  /// ------------------------------------------------- Get all Branch----------------
  const { data: branch, isLoading: branlodding } = useBranchsQuery({
    limit: 10,
    page: 1,
  });
  const allbranch: any = branch?.branchs;
  const allshop = allbranch?.filter((branch: any) => branch?.role === "seller");
  allshop?.unshift({ id: "", username: "All" });
  const allbranchOptions = allshop?.map((branch: any) => {
    return {
      label: branch?.username,
      value: branch?.id,
    };
  });

  // ------------------------------------------------- Get all Branch End----------------

  const debouncedTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (!!debouncedTerm) {
    query["searchTerm"] = debouncedTerm;
  }

  const { role, id } = getUserInfo() as any;

  //------------------------------------------------- Get all Order----------------
  const { data, isLoading: ordersIsLoading } = useOrdersQuery({ ...query });
  const orders = data?.orders;
  const meta = data?.meta;

  const userid = role === "seller" ? id : "";
  const { data: shop, isLoading } = useShopOrdersQuery({
    id: userid,
    query: query,
  });
  const shoporders = shop?.shopOrders;
  const meta1 = shop?.meta;

  useEffect(() => {
    if (role === "admin") {
      setOrder(orders || []);
    } else if (role === "seller") {
      setOrder(shoporders || []);
    }
  }, [role, orders, shoporders,startDate,endDate,userId]);

  const grandTotalSum = order.reduce((sum, order) => sum + order.grandTotal, 0);
  //------------------------------------------------- Get all Order End----------------

  const handelorder = async (id: string) => {
    try {
      const { data } = await useOrderQuery(id);
      console.log(data);
    } catch (error) {
      console.log(error);
    }   
  };

  const columns = [
    {
      title: "Sl.No",
      dataIndex: "Sl.No",
      render: (text: any, record: any, index: number) => {
        return <>{index + 1}</>;
      },
    },
    {
      title: "OrderID",
      dataIndex: "orderId",
    },
    {
      title: "ShopID",
      dataIndex: "user",
      render: function (data: any) {
        return <>{data?.username}</>;
      },
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
      title: "grandTotal",
      dataIndex: "grandTotal",
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
      title:"Action",
      render: function (data: any) {
        return (
          <>
            
              <Button   
               onClick={() =>handelorder(data?.id)}>
             <GrFormView/>
              </Button>
            {role === "admin" && (
              <Button
             
                type="primary"
                danger
              >
                <DeleteOutlined />
              </Button>
            )}
          </>
        );
      },
    }
   
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
  };

  
  
  const onSubmit = async (data: any) => {
    if (data?.startDate !== undefined) {
      dispatch(setStartDate(data?.startDate));
    } else if (data?.endDate !== undefined) {
      dispatch(setEndDate(data?.endDate));
    }
    
    if (role ==="admin" && data?.userId !== undefined) {
      dispatch(setUserId(data?.userId));
     
    } 
  };
 


  return (
    <div
      style={{
        margin: "15px 20px",
      }}
    >
       <ActionBar title="Orders List"></ActionBar>


       <div className="order-body">
       <div className="order_header">
            <Form submitHandler={onSubmit}
          
            >
              <div className={role==='admin'?'search-field1':'search-field'} >
                <div>
                  
                    <FormDatePicker
                      name="startDate"
                      label="Start Date"
                      size="large"
                    />
                  
                </div>
                <div className="date-picker">
                    <FormDatePicker
                      name="endDate"
                      label="End Date"
                      size="large"
                    />
              
                </div>
                {role === "admin" && (
                  <div className="secleteduser">
                   
                      <FormSelectField
                        size="large"
                        name="userId"
                        options={allbranchOptions}
                        label="Branch"
                        placeholder="Select"
                      />
                  
                  </div>
                )}
                <div>
                
                    <Button
                    className="search-btn"
                      htmlType="submit"
                    >
                      Search
                    </Button>
                 
                </div>
              </div>
            </Form>
        



          <div className={role==='admin'?'seach-input1':'seach-input'}>
            <Input
              type="text"
              size="large"
              placeholder="Search..."
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
            <div>
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
          </div>
        </div>

      <UMTable
        loading={role === "admin" ? ordersIsLoading : isLoading}
        columns={columns}
        dataSource={order}
        pageSize={size}
        totalPages={role === "admin" ? meta?.total : meta1?.total}
        showSizeChanger={true}
        onPaginationChange={onPaginationChange}
        onTableChange={onTableChange}
        showPagination={true}
      />
     
       </div>

     
      
    </div>
  );
};

export default Order;
