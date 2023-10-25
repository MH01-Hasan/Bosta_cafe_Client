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
import { Button, Input, Modal } from "antd";
import { RiChatDeleteLine } from "react-icons/ri";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
import { FcHighPriority } from "react-icons/fc";

import "../sales/pos/pos.css";

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
                border:"none",
                color:"#e51a1a",
                fontSize:"19px",
              }}
            >
              <RiChatDeleteLine />
            </Button>
          </>
        );
      },
    },
  ];
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
          <UMTable columns={columns} dataSource={cart_Item} />
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
             <div  >
             < FcHighPriority className="hold-icon"/>
             <p style={{
              textAlign: 'center',
              fontSize: '18px',
              marginBottom:'7px',
             }}>Hold Invoice ? Same Reference will <br />replace the old list if exist!!</p>
              <Input
                type="text"
                placeholder="Please Enter Reference Number!"
                style={{
                  width:"100%",
                  height: "46px",
                  borderRadius: "7px",
                  color:'black',
                  fontSize:'18px'
                }}
                onChange={(e) => {
                
                }}
              />
             <Button style={{
              marginTop:'16px'
             }} type="primary" size='large'>
            
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
            <Button
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
