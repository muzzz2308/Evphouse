import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import TopBar from "./components/TopBar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import { PageHeaderSkeleton } from "./components/Skeleton";
import { prefetchProducts } from "./hooks/useProducts";
import { prefetchProductRanges } from "./hooks/useProductRanges";
import { prefetchCertifications } from "./hooks/useCertifications";

prefetchProductRanges();
prefetchCertifications();
prefetchProducts();

const Products = lazy(() => import("./pages/Products"));
const Contact = lazy(() => import("./pages/Contact"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const About = lazy(() => import("./pages/About"));
const Admin = lazy(() => import("./pages/Admin"));

function RouteFallback() {
  return (
    <div className="min-h-[50vh] bg-[#F8FAFC]" aria-hidden>
      <PageHeaderSkeleton />
    </div>
  );
}

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <TopBar />}
      {!isAdmin && <Navbar />}

      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Suspense>

      {!isAdmin && <Footer />}
    </>
  );
}

export default App;
