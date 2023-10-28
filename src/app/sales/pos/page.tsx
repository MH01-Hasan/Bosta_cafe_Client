"use client";
import { Button, Input, Col, Row, Modal, Space, Badge, Avatar } from "antd";
import "./pos.css";
import { useProductsQuery } from "@/redux/api/productApi";
import { useState, useEffect } from "react";
import { useDebounced } from "@/redux/hooks";
import { AiOutlineBars } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, loadHoldItem } from "@/redux/api/cardSlics";
import Cart from "../Cart";
import { DeleteHoldItem } from "@/redux/api/holdItemSlice";
import { GrView } from "react-icons/gr";
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

  //----------------------------------------- get Catagoty -----------------

  //----------------------------------------- get Catagoty -----------------
  const dispatch = useDispatch();

  const handeladdToCard = (product: any) => {
    dispatch(addToCart(product));
  };

  // hold list model ...................
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Hold Orders item.................................................

  const hold = useSelector((state: any) => state.hold);
  useEffect(() => {}, [hold?.holditems]);

  const handelholButton = (product: any) => {
    dispatch(loadHoldItem(product?.items));
  };

  const handelholdDeleteButton = (product: any) => {
    dispatch(DeleteHoldItem(product));
  };
  // Hold Orders item.................................................

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
                  <Space size="middle">
                    <Badge count={hold?.holditems?.length}>
                      <Button
                        style={{
                          backgroundColor: "#FF679B",
                          color: "white",
                          fontSize: "28px",
                          width: "48px",
                          height: "42px",
                          border: "none",
                        }}
                        onClick={toggleModal}
                      >
                        <AiOutlineBars />
                      </Button>
                    </Badge>
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
                      {hold?.holditems?.map((holditem: any, index: number) => (
                        <tr key={index + 1}>
                          <td className="hold-td">{index + 1}</td>
                          <td className="hold-td">
                            {new Date(holditem?.date).toLocaleDateString(
                              undefined,
                              { year: "numeric", month: "long", day: "numeric" }
                            )}
                          </td>
                          <td className="hold-td">{holditem?.holdid}</td>
                          <td className="hold-td">
                            <button onClick={() => handelholButton(holditem)}>
                              <GrView />
                            </button>
                            <button
                              onClick={() => handelholdDeleteButton(holditem)}
                            >
                              delete{" "}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </table>
                  </Modal>
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "whitesmoke",
                borderRadius: " 5px",
                boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.1)",
                marginTop: "19px",
                padding: "20px",
                height: "100vh",
              }}
            >
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
                        src={(product?.productImage as { url: string })?.url}
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
