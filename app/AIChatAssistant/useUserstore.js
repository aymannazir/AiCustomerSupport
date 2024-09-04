// useStockStore.js
import { create } from "zustand";

const useStockStore = create((set) => ({
  symbol: "", // Initial state for the symbol
  setSymbol: (newSymbol) => set({ symbol: newSymbol }), // Function to update the symbol
}));

export default useStockStore;


