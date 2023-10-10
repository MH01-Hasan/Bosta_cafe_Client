
"use client";
import Form from "@/components/ui/Forms/Form";
import FormInput from "@/components/ui/Forms/FormInput";
import FormSelectField from "@/components/ui/Forms/FormSelectField";
import UMBreadCrumb from "@/components/ui/UMBreadCrumb";
import UploadImage from "@/components/ui/UploadImage";
import { sizeOptions } from "@/constants/global";
import { useCategorysQuery } from "@/redux/api/categoryApi";
import { ICategory } from "@/types";
import { Button, Col, Row, message } from "antd";

const AddProductPage = () => {

  
  const { data, isLoading } = useCategorysQuery({ limit: 100, page: 1 });
  //@ts-ignore
  const categorys: ICategory[] = data?.categorys;

  const categoryOptions = 
  categorys &&
  categorys?.map((category) => {
      return {
        label: category?.name,
        value: category?.id,
      };
    });

      const onSubmit = async (data: any) => {
        // message.loading("Creating.....");
        try {
          console.log(data);
          // await addCategory(data);
          message.success("New Product added successfully");
        } catch (err: any) {
          console.error(err.message);
          message.error(err.message);
        }
      }
     

    return (
      <div>
      <UMBreadCrumb
        items={[
          {
            label: "admin",
            link: "/admin",
          },
          {
            label: "all product",
            link: "http://localhost:3000/admin/product",
          },
        ]}
      />
      <h1 style={{
        margin:'30px 20px',
        
      }}>Add New Product</h1>

      <div style={{
        margin:'20px'
      }}>
        <Form submitHandler={onSubmit}>
          <div
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: "5px",
              padding: "15px",
              marginBottom: "10px",
            }}
          >
            <p
              style={{
                fontSize: "18px",
                marginBottom: "10px",
              }}
            >
              Product Information
            </p>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col
                className="gutter-row"
                span={8}
                style={{
                  marginBottom: "10px",
                }}
              >
                <FormInput
                  type="text"
                  name="name"
                  size="large"
                  label="Product Name"
                />
              </Col>
              <Col
                className="gutter-row"
                span={8}
                style={{
                  marginBottom: "10px",
                }}
              >
                <FormSelectField
                  size="large"
                  name="size"
                  options={sizeOptions}
                  label="Size"
                  placeholder="Select"
                />
              </Col>
              <Col
                className="gutter-row"
                span={8}
                style={{
                  marginBottom: "10px",
                }}
              >
                <FormInput
                  type="number"
                  name="price"
                  size="large"
                  label="Price"
                />
              </Col>
              <Col
                className="gutter-row"
                span={8}
                style={{
                  marginBottom: "10px",
                }}
              >
                <FormSelectField
                  size="large"
                  name="categoryId"
                  options={categoryOptions}
                  label="Category"
                  placeholder="Select"
                />
              </Col>
            
              <Col
                className="gutter-row"
                span={8}
                style={{
                  marginBottom: "10px",
                }}
              >
                <FormInput
                  type="text"
                  name="flavor"
                  size="large"
                  label="Flavor"
                />
              </Col>
              <Col
                className="gutter-row"
                span={8}
                style={{
                  marginBottom: "10px",
                }}
              >
                <FormInput
                  type="number"
                  name="discount"
                  size="large"
                  label="Discount"
                />
              </Col>     
             
              <Col
                className="gutter-row"
                span={8}
                style={{
                  marginBottom: "10px",
                }}
              >
                <UploadImage name="file" />
              </Col>

              
            </Row>
          </div>
          <Button htmlType="submit" type="primary">
            Create
          </Button>
        </Form>
      </div>
    </div>
    );
  };
  
  export default AddProductPage;