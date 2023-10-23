import { baseApi } from "./api/baseApi";
import cardReducer from "./api/cardSlics";

export const reducer = {
   [baseApi.reducerPath]: baseApi.reducer,
   cart:cardReducer,
}


