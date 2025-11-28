import axios from 'axios';
import type {
  ApiResponse,
  AuthResponse,
  LoginCredentials,
  RegisterData,
  Product,
  Category,
  CartItem,
  Order,
  AdminStats,
  Admin,
  AdminAuthResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://luxe-cart-ecru.vercel.app/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication APIs
export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/user/createUser', data);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/user/loginUser', credentials);
    return response.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const response = await api.get('/user/logoutUser');
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/user/profile');
    return response.data;
  },
};

// Product APIs
export const productApi = {
  getAllProducts: async (): Promise<ApiResponse<Product[]>> => {
    const response = await api.get('/product/getAllProducts');
    return response.data;
  },

  getProductById: async (id: string): Promise<ApiResponse<Product>> => {
    // Server uses POST for details
    const response = await api.post(`/product/getProductDetails/${id}`);
    return response.data;
  },

  getFeaturedProducts: async (): Promise<ApiResponse<Product[]>> => {
    // No specific featured endpoint found in server, filtering client-side or using getAllProducts
    const response = await api.get('/product/getAllProducts');
    if (response.data && response.data.products) {
       // @ts-ignore - handling potential structure mismatch
       return { ...response.data, data: response.data.products.filter((p: Product) => p.featured) };
    }
    return response.data;
  },

  searchProducts: async (query: string): Promise<ApiResponse<Product[]>> => {
    const response = await api.get(`/product/getAllProducts?search=${query}`);
    return response.data;
  },
};

// Category APIs
export const categoryApi = {
  getAllCategories: async (): Promise<ApiResponse<Category[]>> => {
    // Typo in server route: getCaregory
    const response = await api.get('/category/getCaregory');
    return response.data;
  },

  getCategoryById: async (id: string): Promise<ApiResponse<Category>> => {
    // Not implemented in server routes shown, using getAll and finding?
    // Or maybe it's not needed.
    const response = await api.get('/category/getCaregory');
    const category = response.data?.data?.find((c: Category) => c.id === id);
    return { success: !!category, data: category } as any;
  },
};

// Cart APIs
export const cartApi = {
  getCart: async (): Promise<ApiResponse<CartItem[]>> => {
    const response = await api.get('/cart/getCart');
    return response.data;
  },

  addToCart: async (productId: string, quantity: number = 1): Promise<ApiResponse> => {
    const response = await api.post('/cart/createCart', { productId, quantity });
    return response.data;
  },

  updateCartItem: async (): Promise<ApiResponse> => {
    return { success: false, message: "Update not supported directly, use addToCart" };
  },

  removeFromCart: async (productId: string): Promise<ApiResponse> => {
    // Server expects productId in body
    const response = await api.post('/cart/removeFromCart', { productId });
    return response.data;
  },

  clearCart: async (): Promise<ApiResponse> => {
    // Server uses GET for clearCart
    const response = await api.get('/cart/clearCart');
    return response.data;
  },
};

// Order APIs
export const orderApi = {
  createOrder: async (orderData: any): Promise<ApiResponse<Order>> => {
    // Typo in server: createOder
    const response = await api.post('/order/createOder', orderData);
    return response.data;
  },

  getUserOrders: async (): Promise<ApiResponse<Order[]>> => {
    const response = await api.get('/order/getAllOrderByUserId');
    return response.data;
  },

  getOrderById: async (id: string): Promise<ApiResponse<Order>> => {
    // Typo in server: orderGetByIb, and it's POST
    const response = await api.post(`/order/orderGetByIb/${id}`);
    return response.data;
  },

  getAllOrders: async (): Promise<ApiResponse<Order[]>> => {
    const response = await api.get('/order/getAllOrders');
    return response.data;
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<ApiResponse> => {
    // Route: /updateOrderState, Body: { orderId, status }
    const response = await api.post('/order/updateOrderState', { orderId, status });
    return response.data;
  },
};

// Admin APIs
export const adminApi = {
  login: async (credentials: LoginCredentials): Promise<AdminAuthResponse> => {
    const response = await api.post('/admin/loginAdmin', credentials);
    return response.data;
  },

  createAdmin: async (data: RegisterData): Promise<AdminAuthResponse> => {
    const response = await api.post('/admin/createAdmin', data);
    return response.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const response = await api.get('/admin/logoutAdmin');
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<{ admin: Admin }>> => {
    const response = await api.get('/admin/getAdminProfile');
    return response.data;
  },

  getStats: async (): Promise<ApiResponse<AdminStats>> => {
    // Not implemented in server routes shown?
    // admin.routes.js only has createAdmin, login, profile, logout.
    // No stats endpoint.
    // I will return mock data or empty for now to prevent crash.
    return { 
      success: true, 
      data: { 
        totalProducts: 0, 
        totalOrders: 0, 
        totalRevenue: 0, 
        totalUsers: 0, 
        recentOrders: [] 
      } 
    };
  },

  createProduct: async (formData: FormData): Promise<ApiResponse<Product>> => {
    const response = await api.post('/product/productCreate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateProduct: async (id: string, formData: FormData): Promise<ApiResponse<Product>> => {
    // Server expects productId in body, not just URL.
    // And route is /product/updateProduct
    formData.append('productId', id);
    const response = await api.put('/product/updateProduct', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteProduct: async (id: string): Promise<ApiResponse> => {
    // Server expects productId in body
    const response = await api.post('/product/deleteProduct', { productId: id });
    return response.data;
  },

  createCategory: async (data: { name: string; description?: string }): Promise<ApiResponse<Category>> => {
    const response = await api.post('/category/createCategory', data);
    return response.data;
  },

  updateCategory: async (id: string, data: { name: string; description?: string }): Promise<ApiResponse<Category>> => {
    const response = await api.put('/category/updateCategory', { id, ...data });
    return response.data;
  },

  deleteCategory: async (id: string): Promise<ApiResponse> => {
    const response = await api.post('/category/deleteCategory', { id });
    return response.data;
  },
};

export default api;
