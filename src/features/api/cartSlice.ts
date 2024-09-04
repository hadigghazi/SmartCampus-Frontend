// utils/localStorageUtils.ts

export const getCartFromLocalStorage = (): { [courseId: number]: number[] } => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : {};
  };
  
  export const setCartInLocalStorage = (cart: { [courseId: number]: number[] }) => {
    localStorage.setItem('cart', JSON.stringify(cart));
  };
  
  export const clearCartInLocalStorage = () => {
    localStorage.removeItem('cart');
  };
  