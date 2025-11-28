import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Truck,
  Shield,
  RefreshCw,
  Tag,
  TrendingUp,
} from "lucide-react";
import { useProduct } from "../contexts/ProductContext";
import ProductCard from "../components/ProductCard";
import Loading from "../components/Loading";

const Home: React.FC = () => {
  const { featuredProducts, categories, isLoading } = useProduct();

  console.log(categories)

  // const getCategoryDisplay = (name: string) => {
  //   const normalizedName = name.toLowerCase();
  //   if (normalizedName.includes("electronic")) {
  //     return {
  //       icon: <Smartphone size={32} />,
  //       color: "bg-blue-50 text-blue-600",
  //       image:
  //         "https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?auto=format&fit=crop&w=800&q=80",
  //     };
  //   }
  //   if (
  //     normalizedName.includes("fashion") ||
  //     normalizedName.includes("cloth")
  //   ) {
  //     return {
  //       icon: <Watch size={32} />,
  //       color: "bg-purple-50 text-purple-600",
  //       image:
  //         "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80",
  //     };
  //   }
  //   if (normalizedName.includes("home") || normalizedName.includes("living")) {
  //     return {
  //       icon: <HomeIcon size={32} />,
  //       color: "bg-green-50 text-green-600",
  //       image:
  //         "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=800&q=80",
  //     };
  //   }
  //   if (normalizedName.includes("accessorie")) {
  //     return {
  //       icon: <Headphones size={32} />,
  //       color: "bg-orange-50 text-orange-600",
  //       image:
  //         "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
  //     };
  //   }
  //   return {
  //     icon: <Tag size={32} />,
  //     color: "bg-gray-50 text-gray-600",
  //     image:
  //       "https://images.unsplash.com/photo-1472851294608-415522f96318?auto=format&fit=crop&w=800&q=80",
  //   };
  // };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl animate-fade-in">
            <span className="inline-block px-4 py-1 rounded-full bg-primary-600/20 text-primary-300 border border-primary-500/30 backdrop-blur-sm mb-6 text-sm font-medium">
              New Collection 2024
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-display leading-tight">
              Discover Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
                Signature Style
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Experience the perfect blend of luxury and comfort. Shop our
              latest arrivals and elevate your everyday living.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="btn btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2 group"
              >
                Shop Now
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/products?category=sale"
                className="btn bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 text-lg px-8 py-4 flex items-center justify-center gap-2"
              >
                View Offers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Truck size={32} />,
              title: "Free Shipping",
              desc: "On all orders over $100",
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              icon: <Shield size={32} />,
              title: "Secure Payment",
              desc: "100% secure processing",
              color: "text-green-600",
              bg: "bg-green-50",
            },
            {
              icon: <RefreshCw size={32} />,
              title: "Easy Returns",
              desc: "30-day money back guarantee",
              color: "text-purple-600",
              bg: "bg-purple-50",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-6 hover:-translate-y-1 transition-transform duration-300"
            >
              <div
                className={`w-16 h-16 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center flex-shrink-0`}
              >
                {feature.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {feature.title}
                </h3>
                <p className="text-gray-500">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-display mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Explore our wide range of products across different categories
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            return (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="text-black group relative rounded-2xl overflow-hidden cursor-pointer"
              >
                <div className="absolute bottom-0 left-0 right-0 p-6 text-black transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{category.name}</h3>
                  </div>
                  <p className="text-black/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                    Explore Collection{" "}
                    <ArrowRight size={14} className="inline ml-1" />
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Special Offer Section */}
      {/* <section className="bg-gray-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-8">
              <div className="flex items-center gap-2 text-primary-400 font-medium">
                <Timer size={20} />
                <span>Limited Time Offer</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold font-display leading-tight">
                Flash Sale <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
                  Up to 50% Off
                </span>
              </h2>
              <p className="text-gray-400 text-lg max-w-xl">
                Don't miss out on our biggest sale of the season. Grab your
                favorites before they're gone!
              </p>

              <div className="flex gap-4">
                {["02", "14", "35", "42"].map((time, i) => (
                  <div key={i} className="text-center">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl font-bold mb-2 border border-white/10">
                      {time}
                    </div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">
                      {["Days", "Hours", "Mins", "Secs"][i]}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                to="/products"
                className="btn btn-primary inline-flex items-center gap-2 px-8 py-4 text-lg mt-8"
              >
                Shop The Sale <ArrowRight size={20} />
              </Link>
            </div>

            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/30 to-purple-500/30 blur-3xl rounded-full" />
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
                alt="Special Offer"
                className="relative z-10 w-full rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute -top-6 -right-6 bg-red-500 text-white w-24 h-24 rounded-full flex flex-col items-center justify-center font-bold shadow-lg z-20 animate-bounce-slow">
                <span className="text-2xl">50%</span>
                <span className="text-sm">OFF</span>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-primary-600 font-medium mb-2">
              <TrendingUp size={20} />
              <span>Popular Now</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-display">
              Featured Collection
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-primary-600 font-medium transition-colors"
          >
            View All Products <ArrowRight size={20} />
          </Link>
        </div>

        {isLoading ? (
          <Loading />
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Tag size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              No Featured Products
            </h3>
            <p className="text-gray-500">
              Check back later for our curated selection.
            </p>
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/products"
            className="btn btn-outline w-full flex items-center justify-center gap-2"
          >
            View All Products <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Newsletter Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary-900 rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900 via-primary-900/90 to-transparent z-10" />
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=1920&q=80"
              alt="Newsletter"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-20 px-8 py-16 md:py-20 md:px-16 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-display">
              Stay in the Loop
            </h2>
            <p className="text-primary-100 text-lg mb-8">
              Subscribe to our newsletter to receive exclusive offers, latest
              news, and style tips directly to your inbox.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/10 text-white placeholder-primary-200 border border-white/10 backdrop-blur-sm"
              />
              <button className="btn bg-white text-primary-900 hover:bg-primary-50 px-8 py-4 rounded-xl font-bold text-lg shadow-lg">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
