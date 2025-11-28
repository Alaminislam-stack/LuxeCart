import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Plus,
  Edit,
  Trash2,
  MapPin,
  LogOut,
} from "lucide-react";
import { adminApi, productApi, orderApi, categoryApi } from "../services/api";
import type { Product, Order, AdminStats, Category } from "../types";
import Loading from "../components/Loading";
import ProductFormModal from "../components/ProductFormModal";
import CategoryFormModal from "../components/CategoryFormModal";
import { useAuth } from "../contexts/AuthContext";

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "products" | "categories" | "orders"
  >("overview");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [growthStats, setGrowthStats] = useState({
    ordersGrowth: 0,
    revenueGrowth: 0,
    productsGrowth: 0,
  });

  const { adminLogout } = useAuth();

  // Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === "overview") {
          // Fetch orders and products to calculate stats
          const [ordersRes, productsRes] = await Promise.all([
            orderApi.getAllOrders(),
            productApi.getAllProducts(),
          ]);

          const ordersData = (ordersRes as any).orders || ordersRes.data || [];
          const productsData =
            (productsRes as any).products || productsRes.data || [];

          // Calculate date ranges
          const now = new Date();
          const thirtyDaysAgo = new Date(
            now.getTime() - 30 * 24 * 60 * 60 * 1000
          );
          const sixtyDaysAgo = new Date(
            now.getTime() - 60 * 24 * 60 * 60 * 1000
          );

          // Current period (last 30 days)
          const currentOrders = ordersData.filter(
            (order: Order) => new Date(order.orderDate) >= thirtyDaysAgo
          );
          const currentRevenue = currentOrders.reduce(
            (sum: number, order: Order) => sum + order.totalAmount,
            0
          );

          // Previous period (30-60 days ago)
          const previousOrders = ordersData.filter((order: Order) => {
            const orderDate = new Date(order.orderDate);
            return orderDate >= sixtyDaysAgo && orderDate < thirtyDaysAgo;
          });
          const previousRevenue = previousOrders.reduce(
            (sum: number, order: Order) => sum + order.totalAmount,
            0
          );

          // Calculate growth percentages
          const ordersGrowth =
            previousOrders.length > 0
              ? ((currentOrders.length - previousOrders.length) /
                  previousOrders.length) *
                100
              : 0;
          const revenueGrowth =
            previousRevenue > 0
              ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
              : 0;

          // Calculate stats from all orders
          const totalOrders = ordersData.length;
          const totalRevenue = ordersData.reduce(
            (sum: number, order: Order) => sum + order.totalAmount,
            0
          );
          const totalProducts = productsData.length;

          setStats({
            totalOrders,
            totalRevenue,
            totalProducts,
            totalUsers: 0, // Not available
            recentOrders: ordersData.slice(0, 5), // Get 5 most recent orders
          });

          setGrowthStats({
            ordersGrowth: Math.round(ordersGrowth),
            revenueGrowth: Math.round(revenueGrowth),
            productsGrowth: 0, // Products don't have dates, so no growth calculation
          });
        } else if (activeTab === "products") {
          const [productsRes, categoriesRes] = await Promise.all([
            productApi.getAllProducts(),
            categoryApi.getAllCategories(),
          ]);
          // Server returns { success, count, products } and { success, categorys }
          const productsData =
            (productsRes as any).products || productsRes.data || [];
          const categoriesData =
            (categoriesRes as any).categorys || categoriesRes.data || [];
          setProducts(productsData);
          setCategories(categoriesData);
        } else if (activeTab === "categories") {
          const response = await categoryApi.getAllCategories();
          const categoriesData =
            (response as any).categorys || response.data || [];
          setCategories(categoriesData);
        } else if (activeTab === "orders") {
          const response = await orderApi.getAllOrders();
          // Server returns { success, message, orders }
          const ordersData = (response as any).orders || response.data || [];
          setOrders(ordersData);
        }
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      await orderApi.updateOrderStatus(orderId, status);
      // Refresh orders
      const response = await orderApi.getAllOrders();
      const ordersData = (response as any).orders || response.data || [];
      setOrders(ordersData);
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await adminApi.deleteProduct(productId);
      // Refresh products list
      const response = await productApi.getAllProducts();
      const productsData = (response as any).products || response.data || [];
      setProducts(productsData);
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  };

  const handleProductSubmit = async (formData: FormData) => {
    setModalLoading(true);
    try {
      if (editingProduct) {
        await adminApi.updateProduct(editingProduct.id, formData);
      } else {
        await adminApi.createProduct(formData);
      }

      // Refresh products list to ensure we have the latest data
      const response = await productApi.getAllProducts();
      const productsData = (response as any).products || response.data || [];
      setProducts(productsData);

      setShowProductModal(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Failed to save product", error);
      alert("Failed to save product. Please try again.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleCategorySubmit = async (data: {
    name: string;
    description: string;
  }) => {
    setModalLoading(true);
    try {
      if (editingCategory) {
        await adminApi.updateCategory(editingCategory.id, data);
      } else {
        await adminApi.createCategory(data);
      }

      // Refresh categories list
      const response = await categoryApi.getAllCategories();
      const categoriesData = (response as any).categorys || response.data || [];
      setCategories(categoriesData);

      setShowCategoryModal(false);
      setEditingCategory(null);
    } catch (error) {
      console.error("Failed to save category", error);
      alert("Failed to save category. Please try again.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      await adminApi.deleteCategory(categoryId);
      // Refresh categories list
      const response = await categoryApi.getAllCategories();
      const categoriesData = (response as any).categorys || response.data || [];
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to delete category", error);
      alert("Failed to delete category. It might contain products.");
    }
  };

  const openEditCategoryModal = (category: Category) => {
    setEditingCategory(category);
    setShowCategoryModal(true);
  };

  const openCreateCategoryModal = () => {
    setEditingCategory(null);
    setShowCategoryModal(true);
  };

  const handleLogout = async () => {
    try {
      await adminLogout();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setShowProductModal(true);
  };

  console.log(stats);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-64 flex-shrink-0 h-full">
          <div
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden md:sticky md:top-24 md:flex md:flex-col"
            style={{ height: "auto" }}
          >
            <div className="p-4 border-b border-gray-100 hidden md:block">
              <h2 className="font-bold text-gray-900">Admin Panel</h2>
            </div>
            <nav className="p-2 md:flex-1 flex md:flex-col justify-between">
              <div className="flex md:flex-col md:space-y-1 space-x-1 md:space-x-0 flex-1">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`flex-1 md:w-full flex items-center justify-center md:justify-start gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      activeTab === "overview"
                        ? "bg-primary-50 text-primary-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <LayoutDashboard size={18} />
                  <span className="hidden md:inline">Overview</span>
                </button>
                <button
                  onClick={() => setActiveTab("products")}
                  className={`flex-1 md:w-full flex items-center justify-center md:justify-start gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      activeTab === "products"
                        ? "bg-primary-50 text-primary-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <Package size={18} />
                  <span className="hidden md:inline">Products</span>
                </button>
                <button
                  onClick={() => setActiveTab("categories")}
                  className={`flex-1 md:w-full flex items-center justify-center md:justify-start gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      activeTab === "categories"
                        ? "bg-primary-50 text-primary-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <LayoutDashboard size={18} />
                  <span className="hidden md:inline">Categories</span>
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`flex-1 md:w-full flex items-center justify-center md:justify-start gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      activeTab === "orders"
                        ? "bg-primary-50 text-primary-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <ShoppingBag size={18} />
                  <span className="hidden md:inline">Orders</span>
                </button>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center md:justify-start gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-red-600 hover:bg-red-50 md:mb-2 md:w-full ml-1 md:ml-0"
              >
                <LogOut size={18} />
                <span className="hidden md:inline">Logout</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {loading ? (
            <Loading />
          ) : activeTab === "overview" && stats ? (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard Overview
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                      <ShoppingBag size={24} />
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        growthStats.ordersGrowth >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {growthStats.ordersGrowth >= 0 ? "+" : ""}
                      {growthStats.ordersGrowth}%
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stats.totalOrders}
                  </h3>
                  <p className="text-gray-500 text-sm">Total Orders</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                      <span className="text-xl font-bold">$</span>
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        growthStats.revenueGrowth >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {growthStats.revenueGrowth >= 0 ? "+" : ""}
                      {growthStats.revenueGrowth}%
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    ${stats.totalRevenue.toFixed(2)}
                  </h3>
                  <p className="text-gray-500 text-sm">Total Revenue</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                      <Package size={24} />
                    </div>
                    <span className="text-sm text-gray-500 font-medium">
                      {growthStats.productsGrowth}%
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stats.totalProducts}
                  </h3>
                  <p className="text-gray-500 text-sm">Total Products</p>
                </div>
              </div>
            </div>
          ) : activeTab === "products" ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <button
                  onClick={openCreateModal}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add Product
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-sm font-medium text-gray-500">
                          Product
                        </th>
                        <th className="px-6 py-4 text-sm font-medium text-gray-500">
                          Category
                        </th>
                        <th className="px-6 py-4 text-sm font-medium text-gray-500">
                          Price
                        </th>
                        <th className="px-6 py-4 text-sm font-medium text-gray-500">
                          Stock
                        </th>
                        <th className="px-6 py-4 text-sm font-medium text-gray-500">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-10 h-10 rounded object-cover bg-gray-100"
                              />
                              <span className="font-medium text-gray-900">
                                {product.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {product.category?.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                            ${product.price}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {product.stock}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openEditModal(product)}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : activeTab === "categories" ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                <button
                  onClick={openCreateCategoryModal}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add Category
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-sm font-medium text-gray-500">
                          Name
                        </th>
                        <th className="px-6 py-4 text-sm font-medium text-gray-500">
                          Description
                        </th>
                        <th className="px-6 py-4 text-sm font-medium text-gray-500">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {categories.map((category) => (
                        <tr key={category.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {category.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {category.description || "-"}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openEditCategoryModal(category)}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteCategory(category.id)
                                }
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-900">Orders</h1>

              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                  >
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-gray-900">
                            Order #{order.id.slice(-8)}
                          </h3>
                          <span className="text-sm text-gray-500">
                            by {order.user?.name}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(order.orderDate).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusUpdate(order.id, e.target.value)
                          }
                          className={`px-3 py-1 rounded-full text-xs font-medium uppercase border-none focus:ring-2 focus:ring-primary-500 cursor-pointer
                            ${
                              order.status === "DELIVERED"
                                ? "bg-green-100 text-green-700"
                                : order.status === "CANCELLED"
                                ? "bg-red-100 text-red-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="PROCESSING">Processing</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                        <span className="font-bold text-gray-900 text-lg">
                          ${order.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <MapPin size={16} />
                        {order.address},{order.city}
                      </div>
                      <div className="space-y-2 mt-4">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 text-sm"
                          >
                            <span className="text-gray-500 w-8">
                              x{item.quantity}
                            </span>
                            <span className="flex-1 text-gray-900">
                              {item.product.name}
                            </span>
                            <span className="text-gray-600">${item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Product Modal */}
      <ProductFormModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        onSubmit={handleProductSubmit}
        initialData={editingProduct}
        categories={categories}
        isLoading={modalLoading}
      />

      {/* Category Modal */}
      <CategoryFormModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSubmit={handleCategorySubmit}
        initialData={editingCategory}
        isLoading={modalLoading}
      />
    </div>
  );
};

export default AdminDashboard;
