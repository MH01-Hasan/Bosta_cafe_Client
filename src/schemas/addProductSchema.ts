import * as yup from "yup";

export const addProductSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    price: yup.string().required("Price is required"),
    flavor: yup.string().required("Flavor is required"),
    discount: yup.string().required("Discount is required"),
    size: yup.string().required("Size is required"),
    categoryId: yup.string().required("Category is required"),  

})