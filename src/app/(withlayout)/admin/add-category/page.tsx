
  "use client";
import Form from "@/components/ui/Forms/Form";
import FormInput from "@/components/ui/Forms/FormInput";
import { useAddCategoryMutation } from "@/redux/api/categoryApi";
import { Button, Col, Row, message } from "antd";

const CreateCategory = () => {
  const [addCategory] = useAddCategoryMutation();

  const onSubmit = async (data: any) => {
    message.loading("Creating.....");
    try {
      console.log(data);
      await addCategory(data);
      message.success("Category added successfully");
    } catch (err: any) {
      console.error(err.message);
      message.error(err.message);
    }
  };
  const base = "admin";
  return (
    <div style={{
      margin:"120px 150px"
    }}>
      <h1 >Create Category</h1>
      <Form submitHandler={onSubmit}>
        <Row gutter={{ xs: 24, xl: 8, lg: 8, md: 24 }}>
          <Col span={8} style={{ margin: "10px 0" }}>
            <FormInput name="name" label="Category name" />
          </Col>
        </Row>
        <Button type="primary" htmlType="submit">
          add
        </Button>
      </Form>
    </div>
  );
};

export default CreateCategory;