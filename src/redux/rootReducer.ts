import { baseApi } from "./api/baseApi";
import cardReducer from "./api/cardSlics";
import holdItemSlice from "./api/holdItemSlice";

export const reducer = {
   [baseApi.reducerPath]: baseApi.reducer,
   cart:cardReducer,
   hold:holdItemSlice,
}


