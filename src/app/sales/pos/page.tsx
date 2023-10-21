"use client";
import { Button, Input, message } from "antd";
import Link from "next/link";
import dayjs from "dayjs";
import UMTable from '@/components/ui/UMTable';
import './pos.css'
import { Col, Row } from 'antd';
import { useProductsQuery } from "@/redux/api/productApi";
const page = () => {
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
        <div>
        
  
    <Row>
        {/* --------------cart------------------ */}
      <Col span={8} className='cart-item' >
        <div style={{
              height: "100vh"
        }}>
        <UMTable
        columns={columns}
        showSizeChanger={true}
        showPagination={true}
       
      />

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
          </Button>
      <Button className="button-cart" type="primary" danger  size='large'>
            Reset
          </Button>
      <Button className="button-cart" type="primary" style={{
        backgroundColor:'green'
      }} size='large'>
            Pay
          </Button>

      </div>

        </div>
        
      </Col>

{/* --------------cart------------------ */}


      <Col span={16}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit debitis voluptates exercitationem nam voluptatum beatae, quasi cupiditate porro vel provident officia fugiat omnis rerum quis consequuntur corporis! Animi, unde ad!
      </Col>
    </Row>
   

        </div>
    );
};

export default page;