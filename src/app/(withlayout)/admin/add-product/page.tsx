
"use client";
import Form from "@/components/ui/Forms/Form";
import FormInput from "@/components/ui/Forms/FormInput";
import FormSelectField from "@/components/ui/Forms/FormSelectField";
import UMBreadCrumb from "@/components/ui/UMBreadCrumb";
import UploadImage from "@/components/ui/UploadImage";
import { sizeOptions } from "@/constants/global";
import { useCategorysQuery } from "@/redux/api/categoryApi";
import { useAddProductMutation } from "@/redux/api/productApi";
import { ICategory } from "@/types";
import { Button, Col, Row, message } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";


const AddProductPage = () => {
  const router = useRouter();
  const [addProduct] =useAddProductMutation()
  
  const { data, isLoading } = useCategorysQuery({ limit: 10, page: 1 });
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
        message.loading("Creating.....");
     
          if (!data?.file) {
            message.error("Please select an image");
            return;
          }
          try {
            const formData = new FormData();
            formData.append("file", data?.file);
            formData.append("upload_preset", "products");
      
            const response = await axios.post(
              `https://api.cloudinary.com/v1_1/bostaCafe/auto/upload`,
              formData,
            );
      
            if (response.data.secure_url) {    
             const imagedata = ({
                url: response.data.secure_url,
                mediaId: response.data.public_id,
                bytes: response.data.bytes,
                fileType: response.data.format,
                name: response.data.original_filename,
              });   

              const Productdata = {
                name:data?.name,
                price:data?.price,       
                flavor:data?.flavor,
                productImage:imagedata,
                discount:data?.discount,  
                size:data?.size,
                categoryId:data.categoryId
              }
              
              await addProduct(Productdata)
              message.success("Product upload successfully!");
              router.push("/admin/product");

            } else {
              message.error("some thing went wrong");
            }
          } catch (error) {
            console.error("Error uploading image:", error);       
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
                  type="text"
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
                  type="text"
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