import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  id: string;
  name:string
  price:string;
  flavor:string;
  discount:string;
  size:string  
  category:object
  cartQuantity: number;
}

interface CartState {
  cartItem: CartItem[];
  cartTotalQuantity: number;
  cartTotalAmount: number;
}

const storedCartData = typeof localStorage !== 'undefined' ? localStorage.getItem("cartItem") : null

const initialState: CartState = {
  cartItem: storedCartData?.length ? JSON.parse(storedCartData) : [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
};

const cartslice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const itemIndex = state.cartItem.findIndex((item) => item.id === action.payload.id);
      if (itemIndex >= 0) {
        state.cartItem[itemIndex].cartQuantity += 1;
      } else {
        const tempProduct = { ...action.payload, cartQuantity: 1 };
        state.cartItem.push(tempProduct);
      }
      localStorage.setItem('cartItem', JSON.stringify(state.cartItem));
    },

    decreaseCart(state, action: PayloadAction<CartItem>) {
      const itemIndex = state.cartItem.findIndex((cartItem) => cartItem.id === action.payload.id);
      if (state.cartItem[itemIndex].cartQuantity > 1) {
        state.cartItem[itemIndex].cartQuantity -= 1;
      } else if (state.cartItem[itemIndex].cartQuantity === 1) {
        const nextCartItems = state.cartItem.filter((cartItem) => cartItem.id !== action.payload.id);
        state.cartItem = nextCartItems;
      }
      localStorage.setItem('cartItem', JSON.stringify(state.cartItem));
    },

    increaseToCart(state, action: PayloadAction<CartItem>) {
      const itemIndex = state.cartItem.findIndex((cartItem) => cartItem.id === action.payload.id);
      state.cartItem[itemIndex].cartQuantity += 1;
      localStorage.setItem('cartItem', JSON.stringify(state.cartItem));
    },

    clearCart(state) {
      state.cartItem = [];
      localStorage.setItem('cartItem', JSON.stringify(state.cartItem));
    },

    getTotals(state) {
      let { total, quantity } = state.cartItem.reduce(
        (cartTotal, cartItem) => {
          const { price, cartQuantity } = cartItem; // Assuming 'price' property is present in CartItem
          const itemTotal = Number(price) * cartQuantity;
          cartTotal.total += itemTotal;
          cartTotal.quantity += cartQuantity;
          return cartTotal;
        },
        {
          total: 0,
          quantity: 0,
        }
      );
      total = parseFloat(total.toFixed(2));
      state.cartTotalQuantity = quantity;
      state.cartTotalAmount = total;
    },

    removeFromCart(state, action: PayloadAction<CartItem>) {
      const nextCartItems = state.cartItem.filter((cartItem) => cartItem.id !== action.payload.id);
      state.cartItem = nextCartItems;
      localStorage.setItem('cartItem', JSON.stringify(state.cartItem));
    },

    loadHoldItem(state,action) {
      state.cartItem =action.payload
    },

  },
});

export const {
  addToCart,
  removeFromCart,
  decreaseCart,
  increaseToCart,
  clearCart,
  getTotals,
  loadHoldItem,
} = cartslice.actions;

export default cartslice.reducer;













