/**
 * Local fallbacks used when Supabase env vars are not configured yet.
 * Mirrors the seed data in supabase/schema.sql.
 */
import staticProducts from "./products";

export const fallbackProducts = staticProducts.map((p, index) => ({
  id: String(p.id),
  name: p.name,
  category: p.category,
  image_url: p.image,
  description: p.description,
  sizes: p.sizes,
  specs: p.specs,
  sort_order: index + 1,
}));

export const fallbackProductRanges = [
  { id: "r1", name: "Valves", image_url: "/productrange/lgvalve.png", sort_order: 1 },
  {
    id: "r2",
    name: "Valves&Pipes Fittings",
    image_url: "/productrange/fitting.png",
    sort_order: 2,
  },
  {
    id: "r3",
    name: "Ferrule Fitting",
    image_url: "/images/ferrule-fit.png",
    sort_order: 3,
  },
  { id: "r4", name: "Pipes", image_url: "/productrange/pipe.png", sort_order: 4 },
];

export const fallbackCertifications = [
  {
    id: "c1",
    title: "Letter of Authorization IMGV",
    image_url: "/certificates/LETTEROFAUTHORIZATIONIMGV.png",
    pdf_url: "/certificates/LETTER OF AUTHORIZATION IMGV.pdf",
    sort_order: 1,
  },
  {
    id: "c2",
    title: "Letter of Authorization TFW",
    image_url: "/certificates/LETTEROFAUTHORIZATIONTFW.png",
    pdf_url: "/certificates/LETTER OF AUTHORIZATION TFW.pdf",
    sort_order: 2,
  },
];
