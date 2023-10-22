"use client";
import { Button, Input, message } from "antd";
import UMTable from '@/components/ui/UMTable';
import './pos.css'
import { Col, Row } from 'antd';
import { getUserInfo } from "@/services/auth.service";
import {UserAddOutlined } from '@ant-design/icons';
import { SlBadge } from "react-icons/sl";
import { IoHandLeftOutline } from "react-icons/io5";
import { ImSpinner11 } from "react-icons/im";
import { FaCcAmazonPay } from "react-icons/fa";
const page = () => {

  const {username,role } = getUserInfo() as any;
    const columns = [
        {
          title: "PRODUCT",
          dataIndex: "id",
        },
        {
          title: "QTY",
          dataIndex: "name",
        },
        {
          title: "PRICE",
          dataIndex: "name",
        },
        {
          title: "SUB TOTAL",
          dataIndex: "name",
        },
        
      ];





    
    return (
        <div className="cart-body">
        
  
    <Row>
        {/* --------------cart------------------ */}
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
            columns={columns}
            showSizeChanger={true}
            showPagination={true}
          
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
                <h4>Total QTY :5 </h4>
                <h4>Sub Total : 460</h4>
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
            <Button className="button-cart" type="primary" danger  size='large'>   Reset <ImSpinner11 className='react-icon'/></Button>
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

{/* --------------cart------------------ */}

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

        </div>
      </Col>
    </Row>
   

        </div>
    );
};

export default page;