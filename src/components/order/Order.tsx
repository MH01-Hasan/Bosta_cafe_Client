"use client";
import { DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
import UMTable from "@/components/ui/UMTable";
import {
  Button,
  Col,
  DatePicker,
  DatePickerProps,
  Input,
  Row,
  Space,
  Spin,
  message,
} from "antd";
import { useState, useEffect, use } from "react";
import { useDebounced } from "@/redux/hooks";
import dayjs from "dayjs";
import ActionBar from "@/components/ui/ActionBar";
import { useOrdersQuery, useShopOrdersQuery } from "@/redux/api/ordersApi";
import { getUserInfo } from "@/services/auth.service";
import { useBranchsQuery } from "@/redux/api/branchApi";
import { IBranch } from "@/types";
import FormSelectField from "../ui/Forms/FormSelectField";
import { all } from "axios";
import Form from "../ui/Forms/Form";
import FormDatePicker from "../ui/Forms/FormDatePicker";

const Order = () => {
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(5);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [userId, setuserId] = useState<string | null>(null);

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setendDate] = useState<string>("");


  const [order, setOrder] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // let date = new Date();
  // let formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;



  query["limit"] = size;
  query["page"] = page;
  query["sortBy"] = sortBy;
  query["sortOrder"] = sortOrder;
  query["searchTerm"] = searchTerm;
  query["startDate"] = startDate;
  query["endDate"] = endDate;
  query["userId"] = userId;
  console.log(query);
  const { data: branch, isLoading: branlodding } = useBranchsQuery({
    limit: 10,
    page: 1,
  });

  const allbranch: IBranch[] = branch?.branchs || [];

  const allbranchOptions =
    allbranch &&
    allbranch?.map((branch) => {
      return {
        label: branch?.username,
        value: branch?.id,
      };
    });
 
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

  const userid = role === "seller" ? id : "";
  const { data: shop, isLoading } = useShopOrdersQuery({
    id: userid,
    query: query,
  });
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
      title: role === "admin" && "Action",
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
            {role === "admin" && (
              <Button
                // onClick={() => deleteHandler(data?.id,data?.name)}
                type="primary"
                danger
              >
                <DeleteOutlined />
              </Button>
            )}
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
    
  };

  // const onChange1: DatePickerProps["onChange"] = (date, dateString) => {
  //   setDate1(`${dateString}T00:00:00Z`);
  // };

  // const onChange2: DatePickerProps["onChange"] = (date, dateString) => {
  //   setDate2(`${dateString}T23:59:59Z`);
  // };

  const onSubmit = async (data: any) => {
    console.log(data);
    setuserId(data?.userId);
    setStartDate(data?.startDate);
    setendDate(data?.endDate);
    
  };

  return (
    <div
      style={{
        margin: "60px 50px",
      }}
    >
      <ActionBar title="Orders List">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Form submitHandler={onSubmit}>
            <Row
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              gutter={{ xs: 24, xl: 6, lg: 8, md: 24 }}
            >
              <Col span={6} style={{ margin: "10px 0" }}>
                <div style={{ margin: "10px 0px" }}>
                  <FormDatePicker
                    name="startDate"
                    label="Start Date"
                    size="large"
                  />
                </div>
              </Col>
              <Col span={6} style={{ margin: "10px 0" }}>
                <div style={{ margin: "10px 0px" }}>
                  <FormDatePicker
                    name="endDate"
                    label="End Date"
                    size="large"
                  />
                </div>
              </Col>

              <Col span={6} style={{ margin: "10px 0" }}>
                <div style={{ margin: "10px 0px" }}>
                  <FormSelectField
                    size="large"
                    name="userId"
                    options={allbranchOptions}
                    label="Branch"
                    placeholder="Select"
                  />
                </div>
              </Col>
              <Col span={6} style={{ margin: "10px 0" }}>
                <div style={{ margin: "10px 0px" }}>
                  <Button
                    style={{
                      backgroundColor: "#F009F1",
                      color: "white",
                      height: "41px",
                      width: "112px",
                      marginTop: "15px",
                      letterSpacing: "1px",
                      fontSize: "18px",
                    }}
                    htmlType="submit"
                  >
                    Search
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
        <div>
          <Input
            type="text"
            size="large"
            placeholder="Search..."
            style={{
              width: '470px',
              height: '44px'
            }}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
        </div>
        <div>
          {(!!sortBy ||
            !!sortOrder ||
            !!searchTerm ||
            !!startDate ||
            !!endDate) && (
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
