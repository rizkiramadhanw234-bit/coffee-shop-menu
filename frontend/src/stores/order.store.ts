import { create } from "zustand";

interface OrderStoreType {
  page: number;
  customerName: string;
  statusOrder: string;

  setPage: (page: number) => void;
  setCustomerName: (customerName: string) => void;
  setStatusOrder: (statusOrder: string) => void;
}

export const useOrderStore = create<OrderStoreType>((set) => ({
  page: 1,
  customerName: "",
  statusOrder: "",

  setPage(page) {
    set({ page: page });
  },

  setCustomerName(customerName) {
    set({ customerName: customerName });
  },

  setStatusOrder(statusOrder) {
    set({ statusOrder: statusOrder });
  },
}));
