"use client";
import { getUserInfo } from "@/services/auth.service";
import React, { useEffect, useState } from "react";
import { UserAddOutlined } from "@ant-design/icons";
import { SlBadge } from "react-icons/sl";
import { IoHandLeftOutline } from "react-icons/io5";
import { ImSpinner11 } from "react-icons/im";
import { FaCcAmazonPay } from "react-icons/fa";
import UMTable from "@/components/ui/UMTable";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  decreaseCart,
  getTotals,
  increaseToCart,
  removeFromCart,
} from "@/redux/api/cardSlics";
import { Button, Col, Input, Modal, Row, Select, message } from "antd";
import { RiChatDeleteLine } from "react-icons/ri";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
import { FcHighPriority } from "react-icons/fc";
import "../sales/pos/pos.css";
import { addToHold } from "@/redux/api/holdItemSlice";

const Cart = () => {
  const dispatch = useDispatch();
  // hold model
  const [holdModalOpen, setHoldModalOpen] = useState(false);

  const holdtoggleModal = () => {
    setHoldModalOpen(!holdModalOpen);
  };
  //   get user
  const { username, role } = getUserInfo() as any;
  //................................ get Cart item code start................

  const cart = useSelector((state: any) => state.cart);
  console.log("cart", cart);
  useEffect(() => {
    dispatch(getTotals());
  }, [cart, dispatch]);
  const cart_Item = cart?.cartItem;

  //------------------------------------------remove cart//----------------------------
  const handelremovecart = (cartItem: any) => {
    dispatch(removeFromCart(cartItem));
  };

  // ------------------------------------------------------dicress to cart-----------
  const handeldicresstocart = (cartItem: any) => {
    dispatch(decreaseCart(cartItem));
  };
  // ------------------------------------------------------increaseto cart-----------

  const handelincreasetocart = (cartItem: any) => {
    dispatch(increaseToCart(cartItem));
  };
  //................................--------------------------- creale cart ---------------------------------................
  const handelcrealecart = () => {
    dispatch(clearCart());
  };
  //................................ get Cart item code end................

  // -----------------------------------------
  const columns = [
    {
      title: "PRODUCT",
      dataIndex: "name",
    },
    {
      title: <span className="centered-text">QTY</span>,
      render: function (data: any) {
        return (
          <div className="quantity">
            <button
              className="in-batton"
              onClick={() => handeldicresstocart(data)}
            >
              <AiOutlineMinusCircle />
            </button>
            <p className="total-quantity">{data?.cartQuantity}</p>
            <button
              className="in-batton"
              onClick={() => handelincreasetocart(data)}
            >
              <AiOutlinePlusCircle />
            </button>
          </div>
        );
      },
    },
    {
      title: "PRICE",
      dataIndex: "price",
    },
    {
      title: "SUB TOTAL",
      render: (record: any) => {
        return (Number(record.price) * record.cartQuantity).toFixed(2);
      },
    },
    {
      title: "Action",
      render: function (data: any) {
        return (
          <>
            <Button
              onClick={() => handelremovecart(data)}
              style={{
                border: "none",
                color: "#e51a1a",
                fontSize: "19px",
              }}
            >
              <RiChatDeleteLine />
            </Button>
          </>
        );
      },
    },
  ];
  const [holdid, setHoldId] = useState<string>("");

  const handelHoldItems = () => {
    // Display a loading message
    message.loading("Creating.....");

    // Check if holdid is empty
    if (holdid === "") {
      alert("Type Reference id");
      return; // Exit the function if holdid is empty
    }

    // Generate a random id within a range
    const min = 10;
    const max = 99;
    const randomId = Math.floor(Math.random() * (max - min + 1)) + min;

    // Create the hold order object
    const holdOrder = {
      id: randomId,
      holdid: holdid,
      date: new Date(),
      items: cart_Item, // Assuming cart_Item is defined elsewhere
      holditems: [],
    };

    // Dispatch the hold order to your Redux store
    dispatch(addToHold(holdOrder));

    // Close the modal (assuming holdtoggleModal is a function that does this)
    holdtoggleModal();

    // Clear the holdid (assuming setHoldId is a function that does this)
    setHoldId("");

    // Trigger another function (handelcrealecart)
    handelcrealecart();

    // Display a success message
    message.success("Hold order created successfully!");
  };

  ///----------------------------- Pay Modal ...............................
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  // order submite from

  const [receivedAmount, setReceivedAmount] = useState<number>(0);
  const [changeReturn, setChangeReturn] = useState<number>(0);
  console.log("changeReturn", changeReturn);
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  const onreciveAmoutn = (e: any) => {
    const Amount = Number(e.target.value);
    setReceivedAmount(Amount);
    if (Amount <= 0) {
      setChangeReturn(0);
    } else {
      const payingAmount = Number(cart?.cartTotalAmount);
      const changeReturn = (Amount - payingAmount).toFixed(2);
      setChangeReturn(changeReturn as any);
    }
  };
  const handleChange = (value: string) => {
    setPaymentMethod(value);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="user">
          <UserAddOutlined className="icon" />
          <p className="user-name">User Id : {username}</p>
        </div>
        <div className="user">
          <SlBadge className="icon" />
          <p className="user-name">Role : {role}</p>
        </div>
      </div>

      <div className="cart-item">
        <div className="table">
          <UMTable
            columns={columns}
            showPagination={false}
            dataSource={cart_Item}
          />
        </div>

        <div className="cart-button">
          <div className="cart-calculate">
            <div className="input">
              <Input className="input-field" placeholder="Tax" allowClear />
              <Input
                className="input-field"
                placeholder="Discount"
                allowClear
              />
              <Input
                className="input-field"
                placeholder="Shipping"
                allowClear
              />
            </div>

            <div className="total">
              <h4>Total QTY :{cart?.cartTotalQuantity} </h4>
              <h4>Sub Total : {cart?.cartTotalAmount.toFixed(2)}(OMR)</h4>
              <h4>Discount : 60</h4>
              <h4>Shipping : 560</h4>
              <h3>Total : 12480 </h3>
            </div>
          </div>

          <div className="action-button">
            <Button
              onClick={holdtoggleModal}
              className="button-cart"
              size="large"
              style={{
                backgroundColor: "#FF679B",
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Hold
              <IoHandLeftOutline className="react-icon" />
            </Button>
            <Modal
              className="holadModal"
              title="Hold"
              visible={holdModalOpen}
              onOk={holdtoggleModal}
              onCancel={holdtoggleModal}
              footer="hold"
            >
              <div>
                <FcHighPriority className="hold-icon" />
                <p
                  style={{
                    textAlign: "center",
                    fontSize: "18px",
                    marginBottom: "7px",
                  }}
                >
                  Hold Invoice ? Same Reference will <br />
                  replace the old list if exist!!
                </p>
                <Input
                  type="text"
                  placeholder="Please Enter Reference Number!"
                  style={{
                    width: "100%",
                    height: "46px",
                    borderRadius: "7px",
                    color: "black",
                    fontSize: "18px",
                  }}
                  onChange={(e) => {
                    setHoldId(e.target.value);
                  }}
                />
                <Button
                  style={{
                    marginTop: "16px",
                  }}
                  type="primary"
                  size="large"
                  onClick={() => handelHoldItems()}
                >
                  Yes,ok
                </Button>
              </div>
            </Modal>

            <Button
              onClick={() => handelcrealecart()}
              className="button-cart"
              style={{
                backgroundColor: "#FB0000",
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              danger
              size="large"
            >
              Reset <ImSpinner11 className="react-icon" />
            </Button>
            {/*------------------------------- pay modal -------------------------------*/}
            <Button
              onClick={showModal}
              className="button-cart"
              style={{
                backgroundColor: "#2FC989",
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              size="large"
            >
              Pay
              <FaCcAmazonPay className="react-icon" />
            </Button>
            <Modal
              width={1000}
              title="Ordes History"
              open={open}
              onOk={handleOk}
              confirmLoading={confirmLoading}
              onCancel={handleCancel}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div className="order-history">
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col
                      className="gutter-row"
                      span={12}
                      style={{
                        marginBottom: "10px",
                      }}
                    >
                      <label>Received Amount:</label> <br />
                      <Input
                        type="text"
                        size="large"
                        placeholder="Received Amount"
                        onChange={(e) => {
                          onreciveAmoutn(e);
                        }}
                      />
                    </Col>
                    {/* ---------------------------------- */}
                    <Col
                      className="gutter-row"
                      span={12}
                      style={{
                        marginBottom: "10px",
                      }}
                    >
                      <label>Paying Amount:</label>
                      <Input
                        disabled
                        value={cart?.cartTotalAmount.toFixed(2)}
                        type="text"
                        size="large"
                      />
                    </Col>

                    <Col
                      className="gutter-row"
                      span={12}
                      style={{
                        marginBottom: "10px",
                      }}
                    >
                      <label>Change Return </label>
                      <Input
                        disabled
                        value={changeReturn}
                        type="text"
                        size="large"
                      />
                    </Col>
                    {/* ---------------------------------- */}
                    <Col
                      className="gutter-row"
                      span={12}
                      style={{
                        marginBottom: "10px",
                      }}
                    >
                      <label>Payment Type:</label> <br />
                      <Select
                        size="large"
                        placeholder="Payment Type"
                        onChange={handleChange}
                        options={[
                          {
                            label: "Cash",
                            value: "cash",
                          },
                          {
                            label: "Card",
                            value: "card",
                          },
                          {
                            label: "Online Payment",
                            value: "online",
                          },
                          {
                            label: "Others",
                            value: "others",
                          },
                        ]}
                      />
                    </Col>
                  </Row>
                </div>

                <div className="Total-Products">
                  <table className="hold-table">
                    <tr>
                      <th className="hold-th">Total Products</th>
                      <th className="hold-th">{cart?.cartTotalQuantity}</th>
                    </tr>
                    <tr>
                      <th className="hold-th">Total Amount</th>
                      <th className="hold-th">{cart?.cartTotalAmount}</th>
                    </tr>
                  </table>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
