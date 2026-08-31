import { create } from "zustand";

interface ProductStoreType {
  page: number;
  productName: string;
  slug: string;

  setPage: (page: number) => void;
  setProductName: (productName: string) => void;
  setSlug: (slug: string) => void;
}

export const useProductStore = create<ProductStoreType>((set) => ({
  page: 1,
  productName: "",
  slug: "",

  setPage(page) {
    set({ page: page });
  },

  setProductName(productName) {
    set({ productName: productName });
  },

  setSlug(slug) {
    set({ slug: slug });
  },
}));
