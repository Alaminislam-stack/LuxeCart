import React, { createContext, useContext, useState, useEffect } from "react";
import { productApi, categoryApi } from "../services/api";
import type { Product, Category } from "../types";

interface ProductContextType {
  products: Product[];
  categories: Category[];
  featuredProducts: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  getProduct: (id: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await productApi.getAllProducts();
      // Server returns { success, count, products } instead of { success, data }
      const productsData = (response as any).products || response.data || [];
      setProducts(productsData);
      setFeaturedProducts(productsData.filter((p: Product) => p.featured));
    } catch (err) {
      setError("Failed to fetch products");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getAllCategories();
      // Server returns { success, categorys } (note the typo in server)
      const categoriesData = (response as any).categorys || response.data || [];
      setCategories(categoriesData);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const getProduct = (id: string) => {
    return products.find((p) => p.id === id);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        featuredProducts,
        isLoading,
        error,
        fetchProducts,
        fetchCategories,
        getProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
};
