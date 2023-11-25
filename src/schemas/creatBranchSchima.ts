import * as yup from "yup";

export const creatBranchSchima = yup.object().shape({
    username: yup.string().required("Name is required"),
    password: yup.string().min(5).max(12).required(),
    email: yup.string().email().required("Email is required"),
    role: yup.string().required("Role is required"),
    contactNo: yup.string().required("Contact No is required"),
    address: yup.string().required("Address is required"),
    status: yup.string().required("Status is required"),
    

})
