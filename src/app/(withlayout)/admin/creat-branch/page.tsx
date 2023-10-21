
"use client";
import Form from "@/components/ui/Forms/Form";
import FormInput from "@/components/ui/Forms/FormInput";
import FormSelectField from "@/components/ui/Forms/FormSelectField";
import UMBreadCrumb from "@/components/ui/UMBreadCrumb";
import { StatusOptions, roleOptions } from "@/constants/global";
import { useCreatBranchMutation } from "@/redux/api/branchApi";
import { Button, Col, Row, message } from "antd";
import { useRouter } from "next/navigation";


const AddProductPage = () => {
  const router = useRouter();
  const [CreatBranch] = useCreatBranchMutation();
  
 
  const onSubmit = async (data: any) => {
    message.loading("Creating.....");
    try {
      await CreatBranch(data);
      message.success("Branch added successfully");
      router.push("/admin/branch");
    } catch (err: any) {
      console.error(err.message);
      message.error(err.message);
    }
  };

    return (
      <div>
      <UMBreadCrumb
        items={[
          {
            label: "admin",
            link: "/admin",
          },
          {
            label: "brance",
            link: "http://localhost:3000/admin/branch",
          },
        ]}
      />
      <h1 style={{
        margin:'30px 20px',
        
      }}>Creat New Branch</h1>

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
              Branch Information
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
                  name="password"
                  size="large"
                  label="Password"
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