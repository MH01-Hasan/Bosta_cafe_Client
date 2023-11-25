import * as yup from "yup";

export const loginSchema = yup.object().shape({
    username: yup.string().required("UserId is required"),
  password: yup.string().min(5).max(12).required(),
});
