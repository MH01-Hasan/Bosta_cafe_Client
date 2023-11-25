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
import { set } from "react-hook-form";
import { useAddOrdersMutation } from "@/redux/api/ordersApi";

const Cart = () => {
  const dispatch = useDispatch();
  // hold model
  const [holdModalOpen, setHoldModalOpen] = useState(false);
  const[ordersrID,setOrdersrID]=useState<string>("")

  const holdtoggleModal = () => {
    setHoldModalOpen(!holdModalOpen);
  };
  //   get user
  const { username, role,id } = getUserInfo() as any;
  //................................ get Cart item code start................

  const cart = useSelector((state: any) => state.cart);
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

  // ------------------------------------------ -----Hold order---------------------------
  const [holdid, setHoldId] = useState<string>("");

  const handelHoldItems = () => {
    // Generate a random id within a range
    const min = 10;
    const max = 99;
    const randomId = Math.floor(Math.random() * (max - min + 1)) + min;

    // Create the hold order object
    const holdOrder = {
      id: randomId,
      holdid: holdid,
      date: new Date(),
      items: cart_Item, 
      holditems: [],
    };

    // Dispatch the hold order to your Redux store

    if (holdid === "") {
      return message.error("Please enter a reference number!");
    }
    else{
      dispatch(addToHold(holdOrder));
      message.success("Hold order created successfully!");
      setHoldId("");
      handelcrealecart();

    }

    holdtoggleModal();
  };
  // ------------------------------------------ -----Hold order---------------------------

  ///----------------------------- Pay Modal ...............................
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const showModal = () => {
    const orderId = Math.floor(Math.random() * 10000);
    console.log("BS-",orderId)
    setOrdersrID(`BS-${orderId}`)
    setOpen(true);
  };

  
  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

const [discount, setDiscount] = useState<number>(0);
const [shipping, setShipping] = useState<number>(0);
const [tax, setTax] = useState<number>(0);

const handleDiscount = (e: any) => {
  const discountValue = Number(e.target.value);
  if (discountValue <= 0) {
    setDiscount(0);
  } else {
    const totalBill = Number(cart?.cartTotalAmount);
    const totalDiscount = totalBill * (discountValue / 100);
    setDiscount(totalDiscount);
  }
};

const [receivedAmount, setReceivedAmount] = useState<number>(0);
  const [changeReturn, setChangeReturn] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  const onreciveAmoutn = (e: any) => {
    const Amount = Number(e.target.value);
    setReceivedAmount(Amount);
    if (Amount <= 0) {
      setChangeReturn(0);
    } else {
      const payingAmount = Number((cart?.cartTotalAmount) - discount);
      const changeReturn = (Amount - payingAmount).toFixed(2);
      setChangeReturn(changeReturn as any);
    }
  };
  const handleChange = (value: string) => {
    setPaymentMethod(value);
  };
//........................................................... ad order .............................
  const [addOrders] =useAddOrdersMutation()




  const handleOk = async () => {
    if(receivedAmount === 0){
      return message.error("Please enter a received amount!");
    }
    else if(paymentMethod === ""){
      return message.error("Please select a payment method!");
    }

   


    const orderdata = { 
      orderId: ordersrID,
      cart: cart,
      discount: discount,
      shipping: shipping,
      tax: tax,
      grandTotal: cart?.cartTotalAmount - discount,
      receivedAmount: receivedAmount,
      changeReturn: changeReturn,
      paymentMethod: paymentMethod,
      userId: id,
    };

    try {
      setConfirmLoading(true);
      await addOrders(orderdata);
      message.success("Order uploaded successfully!");
      clearCart(); 
    } catch (error) {
      message.error("Failed to upload order. Please try again.");
      console.error("Error uploading order:", error);
     
    } finally {
      setConfirmLoading(false);
      setTimeout(() => {
        setOpen(false);
      }, 1000);
    }
  }

//........................................................... ad order .............................

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
              <Input className="input-field" placeholder="Tax" allowClear 
             onChange={(e:any) => {
              setTax(e.target.value);
            }}/>
             
              <Input
                className="input-field"
                placeholder="Shipping"
                allowClear
              />
               <Input
                className="input-field"
                placeholder="Discount"
               onChange={(e) => {handleDiscount(e)}}
                allowClear
              />
            </div>

            <div className="total">
              <h4>Total QTY :{cart?.cartTotalQuantity} </h4>
              <h4>Total : {cart?.cartTotalAmount.toFixed(2)}(OMR)</h4>
              <h4>Discount : {discount.toFixed(2)}(OMR)</h4>
              <h4>Shipping : 560</h4>
              <h4>tax : 560</h4>
              <h3>Grand Total : {cart?.cartTotalAmount - discount} </h3>
            </div>
          </div>

          <div className="action-button">
            <Button
              onClick={holdtoggleModal}
              disabled={cart?.cartTotalAmount === 0}
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
              disabled={cart?.cartTotalAmount === 0}
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
                        value={cart?.cartTotalAmount - discount}
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
                      <th className="pay-th">Total Products</th>
                      <th className="pay-th">{cart?.cartTotalQuantity}</th>
                    </tr>
                    <tr>
                      <th className="pay-th">Total Amount</th>
                      <th className="pay-th">{cart?.cartTotalAmount}</th>
                    </tr>
                    <tr>
                      <th className="pay-th">Order Tax	</th>
                      <th className="pay-th">$ 0.00 (0.00 %)</th>
                    </tr>
                    <tr>
                      <th className="pay-th">Shipping</th>
                      <th className="pay-th">$ 0.00</th>
                    </tr>
                    <tr>
                      <th className="pay-th">Discount</th>
                      <th className="pay-th">{discount}</th>
                    </tr>
                   
                    <tr>
                      <th className="pay-th">Grand Total	</th>
                      <th className="pay-th">{cart?.cartTotalAmount - discount}</th>
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
