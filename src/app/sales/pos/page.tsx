"use client";
import { Button, Input, Col, Row, Modal, Space } from "antd";
import "./pos.css";
import { useProductsQuery } from "@/redux/api/productApi";
import {useState } from "react";
import { useDebounced } from "@/redux/hooks";
import {
  AiOutlineBars,
} from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/api/cardSlics";
import Cart  from "../Cart";

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

  const { data, isLoading } = useProductsQuery({ ...query });
  const products = data?.products;
  const meta = data?.meta;

  const resetFilters = () => {
    setSortBy("");
    setSortOrder("");
    setSearchTerm("");
  };

  //................................ get product code End................
  const dispatch = useDispatch();

  const handeladdToCard = (product: any) => {
    dispatch(addToCart(product));
  };
  

 
  // hold list model ...................
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  

  return (
    <div className="cart-body">
      <Row>
        {/* --------------cart Start------------------ */}
        <Col span={8}>
          <Cart></Cart>
          
        </Col>

        {/* --------------cart End------------------ */}

        <Col span={16}>
          <div className="product_list">
            <div className="product-head">
              <Input
                type="text"
                size="large"
                placeholder="Search..."
                style={{
                  width: "60%",
                  height: "46px",
                  borderRadius: "7px",
                }}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
              />
              <div className="all-modal">
                <div className="hold-model">
                  <Space>
                    <Button style={{
                      backgroundColor:"#FF679B",
                      color: "white",
                      fontSize: "28px",
                      width: "48px",
                      height: "42px",
                      border: "none",
                    }} onClick={toggleModal}>
                      <AiOutlineBars />
                    </Button>
                  </Space>
                  <Modal
                    title="Hold List"
                    visible={isModalOpen}
                    onOk={toggleModal}
                    onCancel={toggleModal}
                    footer="Hold Orders"
                  >
                    <table className="hold-table">
                      <tr>
                        <th className="hold-th">ID</th>
                        <th className="hold-th">Date</th>
                        <th className="hold-th">Ref.ID</th>
                        <th className="hold-th">Action</th>
                      </tr>
                      <tr>
                        <td className="hold-td">560</td>
                        <td className="hold-td">10/05/2023</td>
                        <td className="hold-td">Ib600</td>
                        <td className="hold-td">Germany</td>
                      </tr>
                    </table>
                  </Modal>
                </div>
              </div>
            </div>

            <div style={{
                backgroundColor: "whitesmoke",
                borderRadius:" 5px",
                boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.1)",
                marginTop: '19px',
                padding: '20px',
                height: '100vh',
            }}>
              <Row gutter={4}>
                {products?.map((product) => (
                  <Col xs={12} sm={12} md={8} lg={4} xl={4}>
                    <button
                      onClick={() => handeladdToCard(product)}
                      className="product-info"
                    >
                      <img
                        style={{
                          width: "100%",
                          height: " 100%",
                        }}
                        src={product?.productImage?.url}
                        alt=""
                      />
                      <p>{product?.name}</p>
                    </button>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default page;
