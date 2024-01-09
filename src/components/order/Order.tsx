"use client";
import { DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
import UMTable from "@/components/ui/UMTable";
import { Button, Input } from "antd";
import { useState, useEffect } from "react";
import { useDebounced } from "@/redux/hooks";
import dayjs from "dayjs";
import ActionBar from "@/components/ui/ActionBar";
import { useOrdersQuery, useShopOrdersQuery } from "@/redux/api/ordersApi";
import { getUserInfo } from "@/services/auth.service";
import { useBranchsQuery } from "@/redux/api/branchApi";
import FormSelectField from "../ui/Forms/FormSelectField";
import Form from "../ui/Forms/Form";
import FormDatePicker from "../ui/Forms/FormDatePicker";
import "./Order.css";
import { useDispatch, useSelector } from "react-redux";
import { setEndDate, setStartDate, setUserId } from "@/redux/api/dateSlics";
import { GrFormView } from "react-icons/gr";
import Modal from "./Modal";
import Barcode from "react-barcode";

const Order = () => {
  const query: any = {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(20);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
    // -----------------------------query state end -------------------------------------------

  const [order, setOrder] = useState<any[]>([]);
  const [singelorder, setSingelorder] = useState<any>({});
  const [showModal, setShowModal] = useState(false);

  // -----------------------------date-------------------------------------------
  const dispatch = useDispatch();
  const date = useSelector((state: any) => state?.date);

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


  // -------------------------------------------------searchTerm dely function ----------------

  const debouncedTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (!!debouncedTerm) {
    query["searchTerm"] = debouncedTerm;
  }
 //------------------------------------------------- Get User info ----------------
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
  }, [role, orders, shoporders, startDate, endDate, userId]);
  //------------------------------------------------- Get all Order End----------------

  //------------------------------------------------- Get all Order total amount----------------
  const grandTotalSum = order.reduce((sum, order) => sum + order.grandTotal, 0);
  console.log(grandTotalSum);

  //------------------------------------------------- Table data here --------------------------

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
      title: "Action",
      render: function (data: any) {
        return (
          <div
            style={{
              display: "flex",
            }}
          >
            <div>
              <Button onClick={() => handelosingelorder(data)}>
                <GrFormView />
              </Button>
            </div>

            {role === "admin" && (
              <Button type="primary" danger>
                <DeleteOutlined />
              </Button>
            )}
          </div>
        );
      },
    },
  ];
  // -------------------------------------------------- show single data and open modal----------------------------------------
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  const handelosingelorder = (data: any) => {
    setSingelorder(data);
    openModal();
  };
  // --------------------------------------------------Pagination Options----------------------------------------

  const onPaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setSize(pageSize);
  };
  const onTableChange = (pagination: any, filter: any, sorter: any) => {
    const { order, field } = sorter;
    setSortBy(field as string);
    setSortOrder(order === "ascend" ? "asc" : "desc");
  };
  // --------------------------------------------------Reset Filter data----------------------------------------

  const resetFilters = () => {
    setSortBy("");
    setSortOrder("");
    setSearchTerm("");
  };
  // --------------------------------------------------date set in filter data----------------------------------------
  const onSubmit = async (data: any) => {
    if (data?.startDate !== undefined) {
      dispatch(setStartDate(data?.startDate));
    } else if (data?.endDate !== undefined) {
      dispatch(setEndDate(data?.endDate));
    }

    if (role === "admin" && data?.userId !== undefined) {
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
          {/* ----------------------Search Field and filter option ------------------------------------------- */}
          <Form submitHandler={onSubmit}>
            <div
              className={role === "admin" ? "search-field1" : "search-field"}
            >
              <div>
                <FormDatePicker
                  name="startDate"
                  label="Start Date"
                  size="large"
                />
              </div>
              <div className="date-picker">
                <FormDatePicker name="endDate" label="End Date" size="large" />
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
                <Button className="search-btn" htmlType="submit">
                  Search
                </Button>
              </div>
            </div>
          </Form>

          <div className={role === "admin" ? "seach-input1" : "seach-input"}>
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
  {/* ----------------------Table------------------------------------------- */}
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
          footer={true}
        />
      </div>
      {/* -----------------------show single order and Print Options and open modal */}
      <Modal show={showModal} onClose={closeModal}>
        <div className="order-modal">
          <div>
            <div className="invoice">
              <div className="header">
                <h1>Invoice</h1>
                <p>Invoice # : {singelorder?.orderId}</p>
                <p>
                  Date :{" "}
                  {singelorder?.createdAt &&
                    dayjs(singelorder?.createdAt).format("MMM D, YYYY hh:mm A")}
                </p>
              </div>
              <div className="customer-info">
                <h2>Shop Information</h2>
                <p>Shop ID : {singelorder?.user?.username}</p>
                <p>Email :{singelorder?.user?.email}</p>
                <p>Phone : {singelorder?.user?.contactNo}</p>
                <p>Address :{singelorder?.user?.address}</p>
              </div>
              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>SL.NO</th>

                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {singelorder?.cart?.cartItem?.map(
                    (item: any, index: number) => (
                      <tr>
                        <td>{index + 1}</td>

                        <td>
                          {item?.name}/{item?.flavor}
                        </td>

                        <td>{item?.cartQuantity}</td>

                        <td>{item?.discountPrice}</td>

                        <td>
                          {Number(item?.cartQuantity) *
                            Number(item?.discountPrice)}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>

                <tfoot>
                  <br />
                  <tr>
                    <td colSpan={4} className="text-right">
                      Subtotal:
                    </td>
                    <td>{singelorder?.cart?.cartTotalAmount.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="text-right">
                      Discount:
                    </td>
                    <td>
                      {(singelorder?.discount
                        ? singelorder?.discount
                        : 0
                      ).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="text-right">
                      Total:
                    </td>
                    <td>
                      {(
                        singelorder?.cart?.cartTotalAmount -
                        singelorder?.discount
                      ).toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
              <hr />
              <div className="invoice-last-section">
                <div className="payment-type">
                  <p>PAYMENT-TYPE</p>
                  <p
                    style={{
                      textTransform: "uppercase",
                    }}
                  >
                    {singelorder?.paymentMethod}
                  </p>
                </div>
                <div className="recive-Amount">
                  <p>AMOUNT</p>
                  <p>{singelorder?.receivedAmount}</p>
                </div>
                <div className="exchange">
                  <p>CHANGE RETURN</p>
                  <p>{singelorder?.changeReturn}</p>
                </div>
              </div>

              <div className="footer">
                <p>Thank You For Shopping With Us. Please visit again.</p>

                <Barcode value={singelorder?.orderId} width={1} height={30} />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Order;
