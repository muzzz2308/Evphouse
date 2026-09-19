import { useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { ProductsSkeleton } from "../components/Skeleton";

export default function Products() {
  const { products, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryFromURL = searchParams.get("category") || "All";

  const categories = useMemo(() => {
    const unique = [...new Set(products.map((p) => p.category).filter(Boolean))];
    return ["All", ...unique];
  }, [products]);

  const active = categories.includes(categoryFromURL) ? categoryFromURL : "All";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [active]);

  useEffect(() => {
    if (categoryFromURL !== "All" && products.length > 0 && !categories.includes(categoryFromURL)) {
      setSearchParams({}, { replace: true });
    }
  }, [categoryFromURL, categories, products.length, setSearchParams]);

  const setActive = (cat) => {
    if (cat === "All") {
      setSearchParams({}, { replace: true });
    } else {
      setSearchParams({ category: cat }, { replace: true });
    }
  };

  const filtered =
    active === "All" ? products : products.filter((p) => p.category === active);

  if (loading) {
    return <ProductsSkeleton />;
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <div className="bg-[#0F172A] text-white py-12 sm:py-16 text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">Our Products</h1>
        <p className="text-gray-300 mt-3 sm:mt-4 text-sm sm:text-base max-w-2xl mx-auto">
          High-performance industrial valves engineered for reliability.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="sticky top-16 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 mb-8 sm:mb-12 bg-[#F8FAFC]/95 backdrop-blur-sm border-b border-gray-100/80">
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-thin justify-start sm:justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActive(cat)}
                className={`shrink-0 px-4 sm:px-6 py-2 rounded-full border text-sm sm:text-base transition whitespace-nowrap ${
                  active === cat
                    ? "bg-[#F59E0B] text-black border-[#F59E0B] shadow-sm"
                    : "border-gray-300 text-[#0F172A] hover:border-[#F59E0B] bg-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">No products in this category yet.</p>
            <button
              type="button"
              onClick={() => setActive("All")}
              className="text-[#F59E0B] font-semibold hover:underline"
            >
              View all products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden group"
              >
                <Link to={`/products/${product.id}`}>
                  <div className="h-52 sm:h-64 flex items-center justify-center bg-gray-50">
                    <img
                      src={product.image_url || product.image}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain p-6 group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="p-4 text-center border-t border-gray-50">
                    <h3 className="text-base sm:text-lg font-semibold text-[#0F172A]">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">{product.category}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12 sm:mt-16">
          <Link
            to="/contact"
            className="inline-block bg-[#0F172A] text-white px-8 py-3 rounded-lg hover:bg-[#1E293B] transition"
          >
            Request Custom Quote
          </Link>
        </div>
      </div>
    </div>
  );
}
