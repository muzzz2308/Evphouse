# Elite Valves — Supabase Setup

Follow these steps once. After this, the site reads products, product ranges, and certifications from Supabase, and you can manage them from the Admin panel.

## 1. Create a project

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Create a new project
3. Wait until the database is ready

## 2. Add environment variables

1. In Supabase: **Project Settings → API**
2. Copy **Project URL** and the **anon public** key
3. In this repo, copy `.env.example` to `.env`:

```bash
copy .env.example .env
```

4. Fill in:

```
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

5. Restart the Vite dev server after saving `.env`

## 3. Run the schema + seed SQL

1. In Supabase: **SQL Editor → New query**
2. Open [`supabase/schema.sql`](supabase/schema.sql) from this repo
3. Paste the full contents and click **Run**
4. This creates tables, RLS policies, storage buckets, and seeds your current catalog

## 4. Create your admin user

1. In Supabase: **Authentication → Users → Add user**
2. Choose **Create new user**
3. Enter the email and password you will use for Admin login
4. Confirm / create the user

No special “admin role” table is required — any authenticated user can write (RLS allows authenticated writes). Keep this account private.

## 5. Sign in on the site

1. Start the app: `npm run dev`
2. Scroll to the footer → click **Admin**
3. Enter the email and password from step 4
4. You will be taken to `/admin` to manage:
   - **Products** (title, description, image, sizes, specs, category)
   - **Product Ranges** (Home category cards)
   - **Certifications** (preview image + PDF)

## 6. Uploading images / PDFs

Admin uploads go to Supabase Storage buckets:

- `product-images`
- `range-images`
- `certificates`

Seeded items still use local public paths (e.g. `/images/...`). When you upload a new file in Admin, the URL switches to a Supabase Storage public URL automatically.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Site shows configure message / empty data | Check `.env` keys and restart Vite |
| Login fails | Confirm user exists under Authentication → Users |
| Upload fails | Re-run storage policies in `schema.sql`; confirm you are logged in |
| Filters show wrong category | Category name on a Product Range must match product `category` exactly |
