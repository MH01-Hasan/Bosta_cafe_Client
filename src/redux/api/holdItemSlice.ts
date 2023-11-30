import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  id: string;
  name: string;
  price: string;
  flavor: string;
  discount: string;
  size: string;
  category: object;
  cartQuantity: number;
}

interface CartState {
  cartItem: CartItem[];
  cartTotalQuantity: number;
  cartTotalAmount: number;
}
interface HoldOrdes {
  id: Number;
  holdid: String;
  date: Date;
  items: CartState[];
}

interface HoldState {
  [x: string]: any;
  holditems: HoldOrdes[];
}

const storedCartData =
  typeof localStorage !== "undefined"
    ? localStorage.getItem("holditems")
    : null;

const initialState: HoldState = {
  holditems: storedCartData?.length ? JSON.parse(storedCartData) : [],
};

const holdItemSlice = createSlice({
  name: "hold",
  initialState,
  reducers: {
    addToHold(state, action) {
      const tempProduct = { ...action.payload };
      state.holditems.push(tempProduct);
      localStorage.setItem("holditems", JSON.stringify(state.holditems));
    },

    DeleteHoldItem(state, action: PayloadAction<HoldState>) {
      const nextCartItems = state.holditems.filter(
        (cartItem) => cartItem.id !== action.payload.id
      );
      state.holditems = nextCartItems;
      localStorage.setItem("holditems", JSON.stringify(state.holditems));
    },
  },
});

export const { addToHold, DeleteHoldItem } = holdItemSlice.actions;

export default holdItemSlice.reducer;
