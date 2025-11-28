import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Eye } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="card group overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
        />

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <button
            onClick={() => addToCart(product.id)}
            className="p-3 bg-white rounded-full text-gray-900 hover:bg-primary-600 hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300"
            title="Add to Cart"
          >
            <ShoppingCart size={20} />
          </button>
          <Link
            to={`/products/${product.id}`}
            className="p-3 bg-white rounded-full text-gray-900 hover:bg-primary-600 hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
            title="View Details"
          >
            <Eye size={20} />
          </Link>
        </div>

        {/* Badges */}
        {product.featured && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
            FEATURED
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wider">
            {product.category?.name || "Category"}
          </span>
        </div>
        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-medium text-gray-900 mb-1 hover:text-primary-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          {product.stock <= 0 ? (
            <span className="text-sm text-red-500 font-medium">
              Out of Stock
            </span>
          ) : (
            <span className="text-sm text-green-600 font-medium">
              {product.stock} in stock
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
