import { useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Loader2,
  LogOut,
  Package,
  LayoutGrid,
  Award,
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ImageIcon,
  FileText,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { uploadFile } from "../lib/upload";
import { useProducts } from "../hooks/useProducts";
import { useProductRanges } from "../hooks/useProductRanges";
import { useCertifications } from "../hooks/useCertifications";
import {
  AdminListSkeleton,
  AdminGridSkeleton,
  PageHeaderSkeleton,
  Skeleton,
} from "../components/Skeleton";

const TABS = [
  { id: "products", label: "Products", icon: Package },
  { id: "ranges", label: "Product Ranges", icon: LayoutGrid },
  { id: "certs", label: "Certifications", icon: Award },
];

const TOAST_DURATION_MS = 2200;

function Toast({ toast, onClose }) {
  const ok = toast?.type === "success";

  return (
    <div className="fixed bottom-4 right-4 z-[80] pointer-events-none flex flex-col items-end gap-2 max-w-[calc(100vw-2rem)] sm:max-w-sm w-full">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={`${toast.type}-${toast.message}`}
            role="status"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            className={`relative overflow-hidden pointer-events-auto w-full flex items-start gap-3 rounded-xl px-4 py-3 pb-3.5 shadow-2xl border text-sm ${
              ok
                ? "bg-[#0F172A] text-white border-[#F59E0B]/40"
                : "bg-[#1E293B] text-white border-red-400/50"
            }`}
          >
            <span
              className={`shrink-0 mt-0.5 ${ok ? "text-[#F59E0B]" : "text-red-400"}`}
            >
              {ok ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            </span>
            <p className="flex-1 leading-snug text-gray-100">{toast.message}</p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Dismiss"
              className="shrink-0 text-gray-400 hover:text-white transition p-0.5"
            >
              <X size={16} />
            </button>
            <motion.span
              className={`absolute bottom-0 left-0 h-0.5 rounded-b-xl ${
                ok ? "bg-[#F59E0B]" : "bg-red-400"
              }`}
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: TOAST_DURATION_MS / 1000, ease: "linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="block space-y-1.5">
      <span className="text-sm font-medium text-[#0F172A]">{label}</span>
      {children}
    </div>
  );
}

const inputClass =
  "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/50";

function ImagePicker({ url, uploading, onPick, onClear, label = "Image" }) {
  return (
    <Field label={label}>
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 overflow-hidden">
        {url ? (
          <div className="relative group">
            <img
              src={url}
              alt="Preview"
              className="w-full h-44 object-contain bg-white p-3"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
              <label className="inline-flex items-center gap-2 bg-white text-[#0F172A] px-3 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-100">
                <Upload size={16} />
                {uploading ? "Uploading…" : "Change"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => onPick(e.target.files?.[0])}
                />
              </label>
              <button
                type="button"
                onClick={onClear}
                className="inline-flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700"
              >
                <X size={16} />
                Remove
              </button>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center gap-2 h-44 cursor-pointer hover:bg-gray-100/80 transition px-4 text-center">
            {uploading ? (
              <Loader2 className="animate-spin text-[#0F172A]" size={28} />
            ) : (
              <ImageIcon className="text-gray-400" size={32} />
            )}
            <span className="text-sm font-medium text-[#0F172A]">
              {uploading ? "Uploading…" : "Click to upload image"}
            </span>
            <span className="text-xs text-gray-500">JPG, PNG, WEBP or GIF · max 5MB</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => onPick(e.target.files?.[0])}
            />
          </label>
        )}
      </div>
    </Field>
  );
}

function PdfPicker({ url, uploading, onPick, onClear }) {
  const fileName = url ? decodeURIComponent(url.split("/").pop() || "PDF attached") : null;

  return (
    <Field label="PDF document">
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
        {url ? (
          <div className="flex items-center gap-3">
            <div className="bg-white border border-gray-200 rounded-lg p-3 text-[#F59E0B]">
              <FileText size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[#0F172A] truncate">{fileName}</p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#F59E0B] hover:underline"
              >
                View PDF
              </a>
            </div>
            <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm cursor-pointer hover:bg-gray-50">
              <Upload size={14} />
              {uploading ? "…" : "Change"}
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                disabled={uploading}
                onChange={(e) => onPick(e.target.files?.[0])}
              />
            </label>
            <button
              type="button"
              onClick={onClear}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              aria-label="Remove PDF"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center gap-2 py-6 cursor-pointer hover:bg-gray-100/80 rounded-lg transition">
            {uploading ? (
              <Loader2 className="animate-spin text-[#0F172A]" size={24} />
            ) : (
              <FileText className="text-gray-400" size={28} />
            )}
            <span className="text-sm font-medium text-[#0F172A]">
              {uploading ? "Uploading…" : "Click to upload PDF"}
            </span>
            <span className="text-xs text-gray-500">Max 10MB</span>
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              disabled={uploading}
              onChange={(e) => onPick(e.target.files?.[0])}
            />
          </label>
        )}
      </div>
    </Field>
  );
}

function emptyProduct() {
  return {
    name: "",
    category: "",
    image_url: "",
    description: "",
    sizesText: "",
    specsRows: [{ key: "", value: "" }],
  };
}

function productToForm(p) {
  const specs = p.specs || {};
  const specsRows = Object.entries(specs).map(([key, value]) => ({
    key,
    value: String(value),
  }));
  return {
    id: p.id,
    name: p.name || "",
    category: p.category || "",
    image_url: p.image_url || "",
    description: p.description || "",
    sizesText: (p.sizes || []).join(", "),
    specsRows: specsRows.length ? specsRows : [{ key: "", value: "" }],
  };
}

function formToPayload(form) {
  const sizes = form.sizesText
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const specs = {};
  form.specsRows.forEach(({ key, value }) => {
    if (key.trim()) specs[key.trim()] = value;
  });
  return {
    name: form.name.trim(),
    category: form.category.trim(),
    image_url: form.image_url.trim(),
    description: form.description.trim(),
    sizes,
    specs,
  };
}

export default function Admin() {
  const { isAuthenticated, loading: authLoading, signOut, user } = useAuth();
  const [tab, setTab] = useState("products");
  const [toast, setToast] = useState(null);

  const { products, loading: productsLoading, refresh: refreshProducts } = useProducts();
  const { ranges, loading: rangesLoading, refresh: refreshRanges } = useProductRanges();
  const { certifications, loading: certsLoading, refresh: refreshCerts } =
    useCertifications();

  const [productForm, setProductForm] = useState(null);
  const [rangeForm, setRangeForm] = useState(null);
  const [certForm, setCertForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const toastTimerRef = useRef(null);

  const showToast = (type, message) => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToast({ type, message });
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, TOAST_DURATION_MS);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <PageHeaderSkeleton />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-4">
          <div className="flex gap-2">
            <Skeleton className="h-10 w-28 rounded-lg" />
            <Skeleton className="h-10 w-36 rounded-lg" />
            <Skeleton className="h-10 w-36 rounded-lg" />
          </div>
          <AdminListSkeleton />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleUpload = async (bucket, file, accept, onUrl) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(bucket, file, { accept });
      onUrl(url);
      showToast("success", "File uploaded.");
    } catch (err) {
      showToast("error", err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    if (!supabase) return;
    const payload = formToPayload(productForm);
    if (!payload.name || !payload.category) {
      showToast("error", "Name and category are required.");
      return;
    }
    if (!payload.image_url) {
      showToast("error", "Please upload a product image.");
      return;
    }
    setSaving(true);
    try {
      if (productForm.id) {
        const { error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", productForm.id);
        if (error) throw error;
        showToast("success", "Product updated.");
      } else {
        const { error } = await supabase.from("products").insert({
          ...payload,
          sort_order: products.length + 1,
        });
        if (error) throw error;
        showToast("success", "Product created.");
      }
      setProductForm(null);
      await refreshProducts();
    } catch (err) {
      showToast("error", err.message || "Could not save product.");
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!supabase) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) showToast("error", error.message);
    else {
      showToast("success", "Product deleted.");
      await refreshProducts();
    }
  };

  const saveRange = async (e) => {
    e.preventDefault();
    if (!supabase) return;
    const payload = {
      name: rangeForm.name.trim(),
      image_url: rangeForm.image_url.trim(),
    };
    if (!payload.name) {
      showToast("error", "Name is required (must match a product category).");
      return;
    }
    if (!payload.image_url) {
      showToast("error", "Please upload a range image.");
      return;
    }
    setSaving(true);
    try {
      if (rangeForm.id) {
        const { error } = await supabase
          .from("product_ranges")
          .update(payload)
          .eq("id", rangeForm.id);
        if (error) throw error;
        showToast("success", "Product range updated.");
      } else {
        const { error } = await supabase.from("product_ranges").insert({
          ...payload,
          sort_order: ranges.length + 1,
        });
        if (error) throw error;
        showToast("success", "Product range created.");
      }
      setRangeForm(null);
      await refreshRanges();
    } catch (err) {
      showToast("error", err.message || "Could not save range.");
    } finally {
      setSaving(false);
    }
  };

  const deleteRange = async (id) => {
    if (!supabase) return;
    const { error } = await supabase.from("product_ranges").delete().eq("id", id);
    if (error) showToast("error", error.message);
    else {
      showToast("success", "Product range deleted.");
      await refreshRanges();
    }
  };

  const saveCert = async (e) => {
    e.preventDefault();
    if (!supabase) return;
    const payload = {
      title: certForm.title.trim(),
      image_url: certForm.image_url.trim(),
      pdf_url: certForm.pdf_url.trim(),
    };
    if (!payload.image_url) {
      showToast("error", "Please upload a preview image.");
      return;
    }
    setSaving(true);
    try {
      if (certForm.id) {
        const { error } = await supabase
          .from("certifications")
          .update(payload)
          .eq("id", certForm.id);
        if (error) throw error;
        showToast("success", "Certification updated.");
      } else {
        const { error } = await supabase.from("certifications").insert({
          ...payload,
          sort_order: certifications.length + 1,
        });
        if (error) throw error;
        showToast("success", "Certification created.");
      }
      setCertForm(null);
      await refreshCerts();
    } catch (err) {
      showToast("error", err.message || "Could not save certification.");
    } finally {
      setSaving(false);
    }
  };

  const deleteCert = async (id) => {
    if (!supabase) return;
    const { error } = await supabase.from("certifications").delete().eq("id", id);
    if (error) showToast("error", error.message);
    else {
      showToast("success", "Certification deleted.");
      await refreshCerts();
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      if (deleteTarget.type === "product") await deleteProduct(deleteTarget.id);
      else if (deleteTarget.type === "range") await deleteRange(deleteTarget.id);
      else if (deleteTarget.type === "cert") await deleteCert(deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-[#0F172A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-gray-300 hover:text-[#F59E0B] transition mb-2"
            >
              <ArrowLeft size={14} />
              Back to site
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold">Admin Panel</h1>
            <p className="text-gray-300 text-sm mt-1 truncate max-w-md">
              Signed in as {user?.email}
            </p>
          </div>
          <button
            type="button"
            onClick={() => signOut()}
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 px-4 py-2.5 rounded-lg text-sm font-medium transition self-start sm:self-auto"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {!isSupabaseConfigured && (
          <div className="mb-6 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 p-4 text-sm">
            Supabase env vars are missing. Configure <code>.env</code> and run the SQL in{" "}
            <code>SUPABASE_SETUP.md</code> before editing live data.
          </div>
        )}

        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                tab === id
                  ? "bg-[#0F172A] text-white"
                  : "bg-white text-[#0F172A] border border-gray-200 hover:border-[#F59E0B]"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {tab === "products" && (
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-[#0F172A]">Products</h2>
              <button
                type="button"
                onClick={() => setProductForm(emptyProduct())}
                className="inline-flex items-center gap-2 bg-[#F59E0B] text-black px-4 py-2 rounded-lg text-sm font-semibold"
              >
                <Plus size={16} />
                Add product
              </button>
            </div>

            {productsLoading ? (
              <AdminListSkeleton rows={6} />
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <ul className="divide-y divide-gray-100">
                  {products.map((p) => (
                    <li
                      key={p.id}
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4"
                    >
                      <img
                        src={p.image_url}
                        alt=""
                        className="w-14 h-14 sm:w-16 sm:h-16 object-contain bg-gray-50 rounded-lg shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[#0F172A] truncate">{p.name}</p>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">
                          {p.category}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setProductForm(productToForm(p))}
                        className="p-2 rounded-lg hover:bg-gray-100 text-[#0F172A]"
                        aria-label="Edit"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteTarget({
                            type: "product",
                            id: p.id,
                            name: p.name,
                          })
                        }
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                        aria-label="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {productForm && (
              <Modal
                title={productForm.id ? "Edit product" : "Add product"}
                onClose={() => setProductForm(null)}
              >
                <form onSubmit={saveProduct} className="space-y-4">
                  <Field label="Title">
                    <input
                      className={inputClass}
                      required
                      value={productForm.name}
                      onChange={(e) =>
                        setProductForm({ ...productForm, name: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Category (must match a Product Range name for Home filters)">
                    <input
                      className={inputClass}
                      required
                      list="category-options"
                      value={productForm.category}
                      onChange={(e) =>
                        setProductForm({ ...productForm, category: e.target.value })
                      }
                    />
                    <datalist id="category-options">
                      {ranges.map((r) => (
                        <option key={r.id} value={r.name} />
                      ))}
                    </datalist>
                  </Field>
                  <Field label="Description">
                    <textarea
                      className={inputClass}
                      rows={3}
                      value={productForm.description}
                      onChange={(e) =>
                        setProductForm({ ...productForm, description: e.target.value })
                      }
                    />
                  </Field>
                  <ImagePicker
                    url={productForm.image_url}
                    uploading={uploading}
                    onPick={(file) =>
                      handleUpload("product-images", file, "image", (url) =>
                        setProductForm((f) => ({ ...f, image_url: url })),
                      )
                    }
                    onClear={() => setProductForm({ ...productForm, image_url: "" })}
                  />
                  <Field label="Sizes (comma-separated)">
                    <input
                      className={inputClass}
                      value={productForm.sizesText}
                      onChange={(e) =>
                        setProductForm({ ...productForm, sizesText: e.target.value })
                      }
                      placeholder="2 inch, 4 inch, 6 inch"
                    />
                  </Field>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[#0F172A]">
                        Specifications
                      </span>
                      <button
                        type="button"
                        className="text-xs text-[#F59E0B] font-semibold"
                        onClick={() =>
                          setProductForm({
                            ...productForm,
                            specsRows: [...productForm.specsRows, { key: "", value: "" }],
                          })
                        }
                      >
                        + Add row
                      </button>
                    </div>
                    {productForm.specsRows.map((row, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          className={inputClass}
                          placeholder="Key"
                          value={row.key}
                          onChange={(e) => {
                            const specsRows = [...productForm.specsRows];
                            specsRows[i] = { ...row, key: e.target.value };
                            setProductForm({ ...productForm, specsRows });
                          }}
                        />
                        <input
                          className={inputClass}
                          placeholder="Value"
                          value={row.value}
                          onChange={(e) => {
                            const specsRows = [...productForm.specsRows];
                            specsRows[i] = { ...row, value: e.target.value };
                            setProductForm({ ...productForm, specsRows });
                          }}
                        />
                        <button
                          type="button"
                          className="p-2 text-red-500"
                          onClick={() =>
                            setProductForm({
                              ...productForm,
                              specsRows: productForm.specsRows.filter((_, idx) => idx !== i),
                            })
                          }
                          aria-label="Remove spec"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={saving || uploading}
                      className="flex-1 bg-[#0F172A] text-white py-2.5 rounded-lg font-semibold disabled:opacity-60"
                    >
                      {saving ? "Saving…" : "Save product"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setProductForm(null)}
                      className="px-4 py-2.5 rounded-lg border border-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Modal>
            )}
          </section>
        )}

        {tab === "ranges" && (
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-[#0F172A]">Product Ranges</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Shown on Home. Name must match product categories exactly.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRangeForm({ name: "", image_url: "" })}
                className="inline-flex items-center gap-2 bg-[#F59E0B] text-black px-4 py-2 rounded-lg text-sm font-semibold"
              >
                <Plus size={16} />
                Add range
              </button>
            </div>

            {rangesLoading ? (
              <AdminGridSkeleton cards={4} />
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {ranges.map((r) => (
                  <div
                    key={r.id}
                    className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4 items-center"
                  >
                    <img
                      src={r.image_url}
                      alt=""
                      className="w-20 h-20 object-contain bg-gray-50 rounded-lg"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[#0F172A]">{r.name}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setRangeForm({ id: r.id, name: r.name, image_url: r.image_url })
                      }
                      className="p-2 rounded-lg hover:bg-gray-100"
                      aria-label="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteTarget({
                          type: "range",
                          id: r.id,
                          name: r.name,
                        })
                      }
                      className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                      aria-label="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {rangeForm && (
              <Modal
                title={rangeForm.id ? "Edit range" : "Add range"}
                onClose={() => setRangeForm(null)}
              >
                <form onSubmit={saveRange} className="space-y-4">
                  <Field label="Name (category)">
                    <input
                      className={inputClass}
                      required
                      value={rangeForm.name}
                      onChange={(e) => setRangeForm({ ...rangeForm, name: e.target.value })}
                    />
                  </Field>
                  <ImagePicker
                    url={rangeForm.image_url}
                    uploading={uploading}
                    onPick={(file) =>
                      handleUpload("range-images", file, "image", (url) =>
                        setRangeForm((f) => ({ ...f, image_url: url })),
                      )
                    }
                    onClear={() => setRangeForm({ ...rangeForm, image_url: "" })}
                  />
                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={saving || uploading}
                      className="flex-1 bg-[#0F172A] text-white py-2.5 rounded-lg font-semibold disabled:opacity-60"
                    >
                      {saving ? "Saving…" : "Save range"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRangeForm(null)}
                      className="px-4 py-2.5 rounded-lg border border-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Modal>
            )}
          </section>
        )}

        {tab === "certs" && (
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-[#0F172A]">Certifications</h2>
              <button
                type="button"
                onClick={() => setCertForm({ title: "", image_url: "", pdf_url: "" })}
                className="inline-flex items-center gap-2 bg-[#F59E0B] text-black px-4 py-2 rounded-lg text-sm font-semibold"
              >
                <Plus size={16} />
                Add certification
              </button>
            </div>

            {certsLoading ? (
              <AdminGridSkeleton cards={3} />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {certifications.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white rounded-xl border border-gray-100 overflow-hidden"
                  >
                    <img
                      src={c.image_url}
                      alt={c.title}
                      className="w-full h-40 object-cover bg-gray-50"
                    />
                    <div className="p-3 flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-[#0F172A] text-sm truncate">
                          {c.title || "Untitled"}
                        </p>
                      </div>
                      <div className="flex shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            setCertForm({
                              id: c.id,
                              title: c.title || "",
                              image_url: c.image_url || "",
                              pdf_url: c.pdf_url || "",
                            })
                          }
                          className="p-2 rounded-lg hover:bg-gray-100"
                          aria-label="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteTarget({
                              type: "cert",
                              id: c.id,
                              name: c.title || "this certification",
                            })
                          }
                          className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                          aria-label="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {certForm && (
              <Modal
                title={certForm.id ? "Edit certification" : "Add certification"}
                onClose={() => setCertForm(null)}
              >
                <form onSubmit={saveCert} className="space-y-4">
                  <Field label="Title">
                    <input
                      className={inputClass}
                      value={certForm.title}
                      onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                    />
                  </Field>
                  <ImagePicker
                    label="Preview image"
                    url={certForm.image_url}
                    uploading={uploading}
                    onPick={(file) =>
                      handleUpload("certificates", file, "image", (url) =>
                        setCertForm((f) => ({ ...f, image_url: url })),
                      )
                    }
                    onClear={() => setCertForm({ ...certForm, image_url: "" })}
                  />
                  <PdfPicker
                    url={certForm.pdf_url}
                    uploading={uploading}
                    onPick={(file) =>
                      handleUpload("certificates", file, "pdf", (url) =>
                        setCertForm((f) => ({ ...f, pdf_url: url })),
                      )
                    }
                    onClear={() => setCertForm({ ...certForm, pdf_url: "" })}
                  />
                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={saving || uploading}
                      className="flex-1 bg-[#0F172A] text-white py-2.5 rounded-lg font-semibold disabled:opacity-60"
                    >
                      {saving ? "Saving…" : "Save certification"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCertForm(null)}
                      className="px-4 py-2.5 rounded-lg border border-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Modal>
            )}
          </section>
        )}
      </div>

      <Toast
        toast={toast}
        onClose={() => {
          if (toastTimerRef.current) {
            window.clearTimeout(toastTimerRef.current);
            toastTimerRef.current = null;
          }
          setToast(null);
        }}
      />

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close"
            onClick={() => !deleting && setDeleteTarget(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-confirm-title"
            className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-5 sm:p-6"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="bg-red-50 text-red-600 p-2.5 rounded-xl shrink-0">
                <Trash2 size={20} />
              </div>
              <div>
                <h3
                  id="delete-confirm-title"
                  className="text-lg font-bold text-[#0F172A]"
                >
                  Confirm delete
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-[#0F172A]">
                    {deleteTarget.name}
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-60"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2.5 rounded-lg border border-gray-200 font-medium hover:bg-gray-50 transition disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4 gap-3">
          <h3 className="text-lg font-bold text-[#0F172A]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-[#0F172A]"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
