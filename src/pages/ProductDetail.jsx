import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useProduct } from "../hooks/useProducts";
import { ProductDetailSkeleton } from "../components/Skeleton";

export default function ProductDetail() {
  const { id } = useParams();
  const { product, products, loading } = useProduct(id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="py-20 text-center px-4">
        <h2 className="text-2xl font-semibold text-[#0F172A]">Product Not Found</h2>
        <Link to="/products" className="inline-block mt-4 text-[#F59E0B] font-semibold hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  const relatedProducts = products.filter(
    (p) => p.category === product.category && String(p.id) !== String(product.id),
  );

  const imageSrc = product.image_url || product.image;
  const sizes = product.sizes || [];
  const specs = product.specs || {};

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <div className="bg-[#0F172A] text-white py-12 sm:py-16 text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-4xl font-bold"
        >
          {product.name}
        </motion.h1>
        <p className="text-gray-300 mt-3 text-sm sm:text-base">
          Industrial grade {product.category?.toLowerCase()} designed for demanding
          applications.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-md p-6 sm:p-8 flex items-center justify-center group overflow-hidden"
          >
            <img
              src={imageSrc}
              alt={product.name}
              className="max-h-72 sm:max-h-87.5 w-full object-contain transition duration-500 group-hover:scale-105"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-4">
              {product.name}
            </h2>

            <p className="text-gray-600 mb-6 text-sm sm:text-base">{product.description}</p>

            {sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3">Available Sizes</h3>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {sizes.map((size, index) => (
                    <span
                      key={index}
                      className="border border-gray-200 bg-white px-3 sm:px-4 py-2 rounded-md text-sm"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {Object.keys(specs).length > 0 && (
              <div className="mt-8 sm:mt-10">
                <h3 className="text-lg sm:text-xl font-semibold mb-4">
                  Technical Specifications
                </h3>

                <div className="border rounded-lg overflow-hidden bg-white">
                  <table className="w-full text-left text-sm sm:text-base">
                    <tbody>
                      {Object.entries(specs).map(([key, value], index) => (
                        <tr key={index} className="border-b last:border-b-0">
                          <td className="bg-gray-50 font-semibold px-3 sm:px-4 py-3 w-1/3 align-top">
                            {key}
                          </td>
                          <td className="px-3 sm:px-4 py-3">{String(value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8">
              <Link
                to="/contact"
                className="bg-[#F59E0B] text-black px-6 py-3 rounded-lg font-semibold text-center hover:opacity-90 transition"
              >
                Request Quote
              </Link>

              <Link
                to={`/products?category=${encodeURIComponent(product.category)}`}
                className="border border-gray-300 px-6 py-3 rounded-lg text-center hover:border-[#F59E0B] transition"
              >
                Back to Products
              </Link>
            </div>
          </motion.div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-14 sm:mt-20">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-6 sm:mb-8">
              Related Products
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  to={`/products/${item.id}`}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-5 sm:p-6 group"
                >
                  <div className="h-36 sm:h-40 flex items-center justify-center mb-4">
                    <img
                      src={item.image_url || item.image}
                      alt={item.name}
                      className="max-h-full object-contain group-hover:scale-105 transition"
                    />
                  </div>
                  <h4 className="font-semibold text-[#0F172A]">{item.name}</h4>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
