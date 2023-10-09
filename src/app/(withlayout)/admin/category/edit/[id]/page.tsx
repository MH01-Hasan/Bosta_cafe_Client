"use client";

// import Form from "@/components/Forms/Form";
// import FormInput from "@/components/Forms/FormInput";
import ActionBar from "@/components/ui/ActionBar";
import Form from "@/components/ui/Forms/Form";
import FormInput from "@/components/ui/Forms/FormInput";
import UMBreadCrumb from "@/components/ui/UMBreadCrumb";
import { useCategoryQuery, useUpdateCategoryMutation } from "@/redux/api/categoryApi";
import { Button, Col,  Row, message } from "antd";

type IDProps = {
  params: any;
};

const EditCategoryPage = ({ params }: IDProps) => {
  const { id } = params;

  const { data, isLoading } = useCategoryQuery(id);
  const [updateCategory] = useUpdateCategoryMutation();

  const onSubmit = async (values: { name: string }) => {
    message.loading("Updating.....");
    try {
      //   console.log(data);
      await updateCategory({ id, body: values });
      message.success("Category updated successfully");
    } catch (err: any) {
      //   console.error(err.message);
      message.error(err.message);
    }
  };

  // @ts-ignore
  const defaultValues = {
    name: data?.name || "",
  };

  return (
    <div style={{
        marginTop:'50px',
        marginLeft:'30px'
    }}>
      <UMBreadCrumb
        items={[
          {
            label: "admin",
            link: "/admin",
          },
          {
            label: "category",
            link: "/admin/category",
          },
        ]}
      />

      <ActionBar title="Update Category"> </ActionBar>
      <Form submitHandler={onSubmit} defaultValues={defaultValues}>
        <Row gutter={{ xs: 24, xl: 8, lg: 8, md: 24 }}>
          <Col span={8} style={{ margin: "20px 0" }}>
            <FormInput name="name"  label="Category Name" />
          </Col>
        </Row>
        <Button type="primary" htmlType="submit">
          Update
        </Button>
      </Form>
    </div>
  );
};

export default EditCategoryPage;