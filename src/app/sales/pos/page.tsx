"use client";
import { Button, Input, message } from "antd";
import UMTable from '@/components/ui/UMTable';
import './pos.css'
import { Col, Row ,Card} from 'antd';
import { getUserInfo } from "@/services/auth.service";
import {UserAddOutlined } from '@ant-design/icons';
import { SlBadge } from "react-icons/sl";
import { IoHandLeftOutline } from "react-icons/io5";
import { ImSpinner11 } from "react-icons/im";
import { FaCcAmazonPay } from "react-icons/fa";
import { useProductsQuery } from "@/redux/api/productApi";
import { useEffect, useState } from "react";
import { useDebounced } from "@/redux/hooks";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, clearCart, decreaseCart, getTotals, increaseToCart, removeFromCart } from "@/redux/api/cardSlics";
import { RiChatDeleteLine } from "react-icons/ri";
import { AiOutlinePlusCircle,AiOutlineMinusCircle } from "react-icons/ai";
const page = () => {

  //................................ get product code start................
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
  //................................ get product code End................
  const {username,role } = getUserInfo() as any;
   //................................ get Cart item code start................
   const dispatch = useDispatch()
  const cart = useSelector((state:any)=>state.cart);
  useEffect(()=>{
    dispatch(getTotals())
  },[cart,dispatch])
  const cart_Item = cart?.cartItem
    //remove cart//
    const handelremovecart = (cartItem:any)=>{
      dispatch(removeFromCart(cartItem))
     
    }
 //remove cart//

   const handeldicresstocart =(cartItem:any)=>{
    dispatch(decreaseCart(cartItem))
   };
   const handelincreasetocart =(cartItem:any)=>{
    dispatch(increaseToCart(cartItem))
   };
   const handelcrealecart =()=>{
    dispatch(clearCart())
   };
   //................................ get Cart item code start................  

    const columns = [
        {
          title: "PRODUCT",
          dataIndex: "name",
        },
        {
          title: (
            <span className="centered-text">
              QTY
            </span>
          ),
          render: function (data: any) {
            return (
              <div className="quantity">
                <button className='in-batton' onClick={()=>handeldicresstocart(data)}><AiOutlineMinusCircle /></button>
                <p className="total-quantity">{data?.cartQuantity}</p>
                <button className='in-batton' onClick={()=>handelincreasetocart(data)}><AiOutlinePlusCircle/></button>
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
          render: ( record:any) => {
            return (Number(record.price)*(record.cartQuantity));
          },
        },
        {
          title: "Action",
          render: function (data: any) {
            return (
              <>
                <Button
                  onClick={()=>handelremovecart(data)}
                  className="handelremovecart"
                >
                  <RiChatDeleteLine/>
                </Button>
              </>
            );
          },
        },
        
      ];

     

      const handeladdToCard = (product:any) => {
        dispatch(addToCart(product)) 
    }




    console.log(cart)


    return (
        <div className="cart-body">
    <Row>
        {/* --------------cart Start------------------ */}
      <Col span={8}  >
        <div style={
          {
            display:'flex',
            justifyContent:'space-between',
            alignItems:'center',
           
          }
        }>
        <div className="user">
        <UserAddOutlined  className="icon"/>
          <p className="user-name">User Id : {username}</p>

        </div>
        <div className="user">
        <SlBadge  className="icon"/>
          <p className="user-name">Role : {role}</p>

        </div>
        </div>
        
        <div className='cart-item'>
        <div className="table">
            <UMTable
           loading={isLoading}
           columns={columns}
           dataSource={cart_Item}
          />
        </div>

        <div className="cart-button">
        <div className="cart-calculate"> 
          <div className="input">
          <Input  className="input-field"  placeholder="Tax" allowClear />
            <Input  className="input-field"  placeholder="Discount" allowClear  />
            <Input  className="input-field" placeholder="Shipping" allowClear />

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
            <Button className="button-cart"  type="primary"  size='large'style={{
              backgroundColor:'#ff0ff'
            }}>
              
                  Hold

                  <IoHandLeftOutline className='react-icon' />
                </Button>
            <Button onClick={()=>handelcrealecart()} className="button-cart" type="primary" danger  size='large'>   Reset <ImSpinner11 className='react-icon'/></Button>
            <Button className="button-cart" type="primary" style={{
              backgroundColor:'green'
            }} size='large'>
                  Pay

                  <FaCcAmazonPay  className='react-icon'/>
                </Button>

            </div>


        </div>

        </div>
       
      
      </Col>

{/* --------------cart End------------------ */}

      <Col span={16}>
        <div className="product_list">

          <div>
          <Input
          type="text"
          size="large"
          placeholder="Search..."
          style={{
            width: "60%",
            height:'46px',
            borderRadius:"7px"
          }}
          onChange={(e) => {
          
          }}
        />
          </div>



          <div className="product">
          <Row>
          {
              products?.map(product =>  <Col span={3} key={product.id}>
                <button onClick={()=>handeladdToCard(product)} className="product-info">
                <img style={{
                  width: "100%",
                  height:" 100%"
              }} src={product?.productImage?.url} alt="" />
                </button>
               
              </Col>)
            }
    </Row>



            

               

             
          </div>

        </div>
      </Col>
    </Row>
  </div>
    );
};

export default page;