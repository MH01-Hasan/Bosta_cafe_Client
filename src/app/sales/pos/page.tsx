"use client";
import {
  Button,
  Input,
  Col,
  Row,
  Modal,
  Space,
  Badge,
  Avatar,
  Spin,
} from "antd";
import "./pos.css";
import { useProductsQuery } from "@/redux/api/productApi";
import { useState, useEffect } from "react";
import { useDebounced } from "@/redux/hooks";
import { AiOutlineBars, AiOutlineDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, loadHoldItem } from "@/redux/api/cardSlics";
import Cart from "../Cart";
import { DeleteHoldItem } from "@/redux/api/holdItemSlice";
import { BiEdit } from "react-icons/bi";
import Calculator from "../Calculator/Calculator";
import { FaCalculator } from "react-icons/fa";
import { useCategorysQuery } from "@/redux/api/categoryApi";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
const page = () => {
  //................................ get product code start................
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string | null>(null);

  query["limit"] = size;
  query["page"] = page;
  query["sortBy"] = sortBy;
  query["sortOrder"] = sortOrder;
  query["searchTerm"] = searchTerm;
  query["categoryId"] = categoryId;
  const debouncedTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (!debouncedTerm) {
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
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(!open);
  };

  const { data: Catagory, isLoading: CatagoryLodding } = useCategorysQuery({
    limit: 10,
    page: 1,
  });
  //@ts-ignore
  const categorys: ICategory[] = Catagory?.categorys;
  // Define breakpoints for different screen widths
  const breakpoints = {
    320: {
      slidesPerView: 2,
    },
    480: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 4,
    },
    1024: {
      slidesPerView: 4,
    },
  
    1180: {
      slidesPerView: 4,
    },

    1200: {
      slidesPerView: 6,
    },
    1440: {
      slidesPerView: 7,
    },
    1600: {
      slidesPerView: 8,
    },
  };
  // scroll.................
  if (isLoading) {
    return (
      <div style={{
       display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",

      }}>
        <Space>
          <Spin tip="Loading" size="large">
            <div className="content" />
          </Spin>
        </Space>
      </div>
    );
  }
  return (
    <div className="cart-body">
      <Row>
        {/* --------------cart Start------------------ */}
        <Col sm={12} md={8}  >
          <Cart></Cart>
        </Col>

        {/* --------------cart End------------------ */}

        <Col sm={12} md={16} >
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
              <div className="all-modal" style={{}}>
                <div className="hold-model">
                  <Space size="middle">
                    <Badge
                      count={
                        hold?.holditems?.length > 0
                          ? hold?.holditems?.length
                          : 0
                      }
                    >
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
                        <th className="hold-th">Sl.No</th>
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
                            <button
                              style={{
                                border: "none",
                                backgroundColor: "white",
                                marginRight: "20px",
                              }}
                              onClick={() => handelholButton(holditem)}
                            >
                              <BiEdit
                                style={{
                                  color: "#0F8B1A",
                                  fontSize: "18px",
                                }}
                              />
                            </button>
                            <button
                              style={{
                                border: "none",
                                backgroundColor: "white",
                              }}
                              onClick={() => handelholdDeleteButton(holditem)}
                            >
                              <AiOutlineDelete
                                style={{
                                  color: "red",
                                  fontSize: "18px",
                                }}
                              />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </table>
                  </Modal>
                </div>

                <div
                  style={{
                    margin: "0px 20px",
                  }}
                >
                  <Button
                    style={{
                      backgroundColor: "#6571FF",
                      color: "white",
                      fontSize: "24px",
                      width: "50px",
                      height: "42px",
                      border: "none",
                    }}
                    onClick={showModal}
                  >
                    <FaCalculator />
                  </Button>
                  {open && (
                    <div className="Calclutor">
                      <Calculator></Calculator>
                    </div>
                  )}
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
              width: "100%",
                height: "100vh",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
            
                }}
              >
                <Button
                  style={{
                    backgroundColor: "#6571FF",
                    color: "white",
                    padding: "7px 17px",
                    fontSize: "17px",
                    height: "43px",
                    marginRight: "8px",
                  }}
                  onClick={() => setCategoryId(null)}
                >
                  All Categories
                </Button>
                <div
                  className="category-scroll"
                 
                >
                  <Swiper
                  className="swiper-container"
                    navigation
                    pagination
                    slidesPerView={2} // Default slidesPerView
                    breakpoints={breakpoints} // Apply breakpoints
                  >
                    {categorys?.map((category) => (
                      <SwiperSlide 
                      className="swiper-slide"
                      >
                        <Button
                          key={category.id}
                          className={`category-btn ${categoryId === category.id ? 'active-button' : ''}`}
                          style={{
                            color: "black",
                            padding: "7px 17px",
                            // fontSize: "17px",
                            height: "43px",
                          //  width: "100% !important",
                           
                          }}
                          onClick={() => setCategoryId(category.id)}
                        >
                          {category.name}
                        </Button>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>

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
