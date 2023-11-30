"use client";
import ActionBar from "@/components/ui/ActionBar";
import Form from "@/components/ui/Forms/Form";
import FormInput from "@/components/ui/Forms/FormInput";
import FormSelectField from "@/components/ui/Forms/FormSelectField";
import UMBreadCrumb from "@/components/ui/UMBreadCrumb";
import UploadImage from "@/components/ui/UploadImage";
import { sizeOptions } from "@/constants/global";
import { useCategorysQuery } from "@/redux/api/categoryApi";
import {
  useProductQuery,
  useUpdateProductMutation,
} from "@/redux/api/productApi";
import { Button, Col, Row, message } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";

type IDProps = {
  params: any;
};

const EditProductPage = ({ params }: IDProps) => {
  const router = useRouter();
  const { id } = params;

  const { data, isLoading } = useProductQuery(id);

  const [updateProduct] = useUpdateProductMutation();
  //.........................catagory
  const { data: catagory, isLoading: catagoryisLoading } = useCategorysQuery({
    limit: 10,
    page: 1,
  });
  //@ts-ignore
  const categorys: ICategory[] = catagory?.categorys;

  const categoryOptions =
    categorys &&
    categorys?.map((category) => {
      return {
        label: category?.name,
        value: category?.id,
      };
    });
  //.........................Product...update product

  const onSubmit = async (values: any) => {
    if (values?.file) {
      const formData = new FormData();
      formData.append("file", values?.file);
      formData.append("upload_preset", "products");

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/bostaCafe/auto/upload`,
        formData
      );

      if (response.data.secure_url) {
        const imagedata = {
          url: response.data.secure_url,
          mediaId: response.data.public_id,
          bytes: response.data.bytes,
          fileType: response.data.format,
          name: response.data.original_filename,
        };
        values.productImage = imagedata;
      }
    }

    message.loading("Updating.....");

    try {
      const Productdata = {
        name: values?.name,
        price: values?.price,
        flavor: values?.flavor,
        productImage: values?.productImage,
        discount: values?.discount,
        size: values?.size,
        categoryId: values?.categoryId,
        oldproductimage: data?.productImage,
      };
      await updateProduct({ id, body: Productdata });
      message.success("Product updated successfully");
      router.push("/admin/product");
    } catch (err: any) {
      message.error(err.message);
    }
  };

  const defaultValues = {
    name: data?.name || "",
    size: data?.size || "",
    price: data?.price || "",
    categoryId: data?.category?.id || "",
    flavor: data?.flavor || "",
    discount: data?.discount || "",
    productImage: data?.productImage || "",
    oldproductimage: data?.productImage,
  };

  return (
    <div
      style={{
        marginTop: "50px",
        marginLeft: "30px",
      }}
    >
      <UMBreadCrumb
        items={[
          {
            label: "admin",
            link: "/admin",
          },
          {
            label: "product",
            link: "/admin/product",
          },
        ]}
      />

      <ActionBar title="Update Product"> </ActionBar>
      <Form submitHandler={onSubmit} defaultValues={defaultValues}>
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
            <FormInput type="text" name="price" size="large" label="Price" />
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
            <FormInput type="text" name="flavor" size="large" label="Flavor" />
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
            <img
              src={data?.productImage?.url}
              alt=""
              style={{
                width: "99px",
                height: "90px",
                borderRadius: "5px",
              }}
            />
          </Col>
        </Row>
        <Button type="primary" htmlType="submit">
          Update
        </Button>
      </Form>
    </div>
  );
};

export default EditProductPage;
