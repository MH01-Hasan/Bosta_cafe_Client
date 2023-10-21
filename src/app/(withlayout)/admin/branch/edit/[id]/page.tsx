"use client";
import ActionBar from "@/components/ui/ActionBar";
import Form from "@/components/ui/Forms/Form";
import FormInput from "@/components/ui/Forms/FormInput";
import FormSelectField from "@/components/ui/Forms/FormSelectField";
import UMBreadCrumb from "@/components/ui/UMBreadCrumb";
import { StatusOptions, roleOptions, sizeOptions } from "@/constants/global";
import { useBranchQuery, useUpdateBranchMutation } from "@/redux/api/branchApi";
import { Button, Col, Row, message } from "antd";
import { useRouter } from "next/navigation";

type IDProps = {
  params: any;
};

const EditBranchPage = ({ params }: IDProps) => {
  const router = useRouter();
  const { id } = params;

  const { data, isLoading } = useBranchQuery(id);

  const [updateBranch] = useUpdateBranchMutation();
 
  //.........................Branch...update 

  const onSubmit = async (values: any) => {
    message.loading("Updating.....");
    try {
      
      await updateBranch({ id, body:values });
      message.success("Branch updated successfully");
      router.push("/admin/branch");
    } catch (err: any) {
      message.error(err.message);
    }
  };

  const defaultValues = {
    username: data?.username || "",
    role: data?.role || "",
    email: data?.email || "",
    contactNo: data?.contactNo || "",
    address: data?.address || "",
    status:data?.status || "",
   
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
            link: "/admin/branch",
          },
        ]}
      />

      <ActionBar title="Update Branch"> </ActionBar>
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
                  name="username"
                  size="large"
                  label="Branch ID"
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
                  name="role"
                  options={roleOptions}
                  label="Role"
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
                  name="email"
                  size="large"
                  label="Email"
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
                  name="contactNo"
                  size="large"
                  label="Contact"
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
                  name="address"
                  size="large"
                  label="Address"
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
                  name="status"
                  options={StatusOptions}
                  label="Status"
                  placeholder="Select"
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

export default EditBranchPage;
