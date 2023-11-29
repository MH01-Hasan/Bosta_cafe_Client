import { baseApi } from "./api/baseApi";
import cardReducer from "./api/cardSlics";
import holdItemSlice from "./api/holdItemSlice";
import Dateslice from "./api/dateSlics";

export const reducer = {
   [baseApi.reducerPath]: baseApi.reducer,
   cart: cardReducer,
   hold: holdItemSlice,
   date: Dateslice
}



