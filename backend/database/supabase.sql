create table public.admin_users (
  id uuid not null default extensions.uuid_generate_v4 (),
  username character varying(255) not null,
  password_hash character varying(255) not null,
  full_name character varying(255) null,
  role character varying(50) null default 'admin'::character varying,
  email character varying(255) null,
  created_at timestamp with time zone null default now(),
  constraint admin_users_pkey primary key (id),
  constraint admin_users_email_key unique (email),
  constraint admin_users_username_key unique (username)
) TABLESPACE pg_default;

create table public.banners (
  id uuid not null default extensions.uuid_generate_v4 (),
  store_id uuid null,
  title character varying(255) null,
  subtitle character varying(255) null,
  description text null,
  background_color character varying(255) null,
  text_color character varying(255) null,
  button_text character varying(100) null,
  button_link character varying(255) null,
  button_color character varying(50) null,
  position character varying(50) null default 'hero'::character varying,
  sort_order integer null default 0,
  is_active boolean null default true,
  start_date timestamp with time zone null,
  end_date timestamp with time zone null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  offer_text character varying(255) null,
  badge_text character varying(50) null,
  constraint banners_pkey primary key (id)
) TABLESPACE pg_default;

create table public.cities (
  id uuid not null default extensions.uuid_generate_v4 (),
  name character varying(255) not null,
  is_active boolean null default true,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint cities_pkey primary key (id),
  constraint cities_name_key unique (name)
) TABLESPACE pg_default;

create table public.orders (
  id uuid not null default extensions.uuid_generate_v4 (),
  store_id uuid null,
  order_number character varying(50) not null,
  status character varying(50) null default 'pending'::character varying,
  payment_status character varying(50) null default 'pending'::character varying,
  payment_method character varying(50) null,
  customer_name character varying(255) not null,
  customer_email character varying(255) null,
  customer_phone character varying(50) not null,
  customer_address text not null,
  city_id uuid null,
  district_id uuid null,
  subtotal numeric(10, 2) not null,
  discount_amount numeric(10, 2) null default 0,
  delivery_fee numeric(10, 2) null default 0,
  tax_amount numeric(10, 2) null default 0,
  total numeric(10, 2) not null,
  promo_code_id uuid null,
  promo_code character varying(50) null,
  delivery_date date null,
  delivery_time_slot character varying(50) null,
  delivery_notes text null,
  notes text null,
  admin_notes text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint orders_pkey primary key (id),
  constraint orders_order_number_key unique (order_number),
  constraint orders_promo_code_id_fkey foreign KEY (promo_code_id) references promo_codes (id),
  constraint orders_district_id_fkey foreign KEY (district_id) references districts (id),
  constraint orders_city_id_fkey foreign KEY (city_id) references cities (id),
  constraint orders_payment_status_check check (
    (
      (payment_status)::text = any (
        (
          array[
            'pending'::character varying,
            'paid'::character varying,
            'failed'::character varying,
            'refunded'::character varying
          ]
        )::text[]
      )
    )
  ),
  constraint orders_status_check check (
    (
      (status)::text = any (
        (
          array[
            'pending'::character varying,
            'confirmed'::character varying,
            'preparing'::character varying,
            'ready'::character varying,
            'out_for_delivery'::character varying,
            'delivered'::character varying,
            'cancelled'::character varying
          ]
        )::text[]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_orders_store_status on public.orders using btree (store_id, status) TABLESPACE pg_default;

create index IF not exists idx_orders_customer_phone on public.orders using btree (customer_phone) TABLESPACE pg_default;

create index IF not exists idx_orders_created_at on public.orders using btree (created_at desc) TABLESPACE pg_default;


create table public.product_images (
  id uuid not null default extensions.uuid_generate_v4 (),
  product_id uuid null,
  url text not null,
  alt_text character varying(255) null,
  sort_order integer null default 0,
  is_primary boolean null default false,
  created_at timestamp with time zone null default now(),
  constraint product_images_pkey primary key (id),
  constraint product_images_product_id_fkey foreign KEY (product_id) references products (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_product_images_product on public.product_images using btree (product_id, sort_order) TABLESPACE pg_default;


create table public.stores (
  id uuid not null default extensions.uuid_generate_v4 (),
  name character varying(255) not null,
  slug character varying(255) null,
  description text null,
  email character varying(255) null,
  phone character varying(20) null,
  address text not null,
  city_id uuid null,
  location_lat numeric(10, 8) null,
  location_lng numeric(11, 8) null,
  delivery_range integer null default 10,
  delivery_fee numeric(10, 2) null default 0,
  min_order_amount numeric(10, 2) null default 0,
  theme_color character varying(7) null default '#3B82F6'::character varying,
  is_active boolean null default true,
  is_featured boolean null default false,
  opening_hours jsonb null,
  social_media jsonb null,
  settings jsonb null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint stores_pkey primary key (id),
  constraint stores_slug_key unique (slug),
  constraint stores_city_id_fkey foreign KEY (city_id) references cities (id)
) TABLESPACE pg_default;

create table public.cart_items (
  id uuid not null default extensions.uuid_generate_v4 (),
  session_id character varying(255) null,
  product_id uuid null,
  quantity integer not null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint cart_items_pkey primary key (id),
  constraint cart_items_product_id_fkey foreign KEY (product_id) references products (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_cart_items_session on public.cart_items using btree (session_id) TABLESPACE pg_default;


create table public.categories (
  id uuid not null default extensions.uuid_generate_v4 (),
  store_id uuid null,
  name character varying(255) not null,
  slug character varying(255) not null,
  description text null,
  icon character varying(100) null,
  image_url text null,
  parent_id uuid null,
  sort_order integer null default 0,
  is_active boolean null default true,
  is_featured boolean null default false,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint categories_pkey primary key (id),
  constraint categories_store_id_slug_key unique (store_id, slug),
  constraint categories_parent_id_fkey foreign KEY (parent_id) references categories (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_categories_store_parent on public.categories using btree (store_id, parent_id) TABLESPACE pg_default;

create index IF not exists idx_categories_slug on public.categories using btree (store_id, slug) TABLESPACE pg_default;


create table public.districts (
  id uuid not null default extensions.uuid_generate_v4 (),
  city_id uuid null,
  name character varying(255) not null,
  is_active boolean null default true,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint districts_pkey primary key (id),
  constraint districts_city_id_name_key unique (city_id, name),
  constraint districts_city_id_fkey foreign KEY (city_id) references cities (id) on delete CASCADE
) TABLESPACE pg_default;

create view public.geography_columns as
select
  current_database() as f_table_catalog,
  n.nspname as f_table_schema,
  c.relname as f_table_name,
  a.attname as f_geography_column,
  postgis_typmod_dims (a.atttypmod) as coord_dimension,
  postgis_typmod_srid (a.atttypmod) as srid,
  postgis_typmod_type (a.atttypmod) as type
from
  pg_class c,
  pg_attribute a,
  pg_type t,
  pg_namespace n
where
  t.typname = 'geography'::name
  and a.attisdropped = false
  and a.atttypid = t.oid
  and a.attrelid = c.oid
  and c.relnamespace = n.oid
  and (
    c.relkind = any (
      array[
        'r'::"char",
        'v'::"char",
        'm'::"char",
        'f'::"char",
        'p'::"char"
      ]
    )
  )
  and not pg_is_other_temp_schema(c.relnamespace)
  and has_table_privilege(c.oid, 'SELECT'::text);

  create view public.geometry_columns as
select
  current_database()::character varying(256) as f_table_catalog,
  n.nspname as f_table_schema,
  c.relname as f_table_name,
  a.attname as f_geometry_column,
  COALESCE(postgis_typmod_dims (a.atttypmod), sn.ndims, 2) as coord_dimension,
  COALESCE(
    NULLIF(postgis_typmod_srid (a.atttypmod), 0),
    sr.srid,
    0
  ) as srid,
  replace(
    replace(
      COALESCE(
        NULLIF(
          upper(postgis_typmod_type (a.atttypmod)),
          'GEOMETRY'::text
        ),
        st.type,
        'GEOMETRY'::text
      ),
      'ZM'::text,
      ''::text
    ),
    'Z'::text,
    ''::text
  )::character varying(30) as type
from
  pg_class c
  join pg_attribute a on a.attrelid = c.oid
  and not a.attisdropped
  join pg_namespace n on c.relnamespace = n.oid
  join pg_type t on a.atttypid = t.oid
  left join (
    select
      s.connamespace,
      s.conrelid,
      s.conkey,
      replace(
        split_part(s.consrc, ''''::text, 2),
        ')'::text,
        ''::text
      ) as type
    from
      (
        select
          pg_constraint.connamespace,
          pg_constraint.conrelid,
          pg_constraint.conkey,
          pg_get_constraintdef(pg_constraint.oid) as consrc
        from
          pg_constraint
      ) s
    where
      s.consrc ~~* '%geometrytype(% = %'::text
  ) st on st.connamespace = n.oid
  and st.conrelid = c.oid
  and (a.attnum = any (st.conkey))
  left join (
    select
      s.connamespace,
      s.conrelid,
      s.conkey,
      replace(
        split_part(s.consrc, ' = '::text, 2),
        ')'::text,
        ''::text
      )::integer as ndims
    from
      (
        select
          pg_constraint.connamespace,
          pg_constraint.conrelid,
          pg_constraint.conkey,
          pg_get_constraintdef(pg_constraint.oid) as consrc
        from
          pg_constraint
      ) s
    where
      s.consrc ~~* '%ndims(% = %'::text
  ) sn on sn.connamespace = n.oid
  and sn.conrelid = c.oid
  and (a.attnum = any (sn.conkey))
  left join (
    select
      s.connamespace,
      s.conrelid,
      s.conkey,
      replace(
        replace(
          split_part(s.consrc, ' = '::text, 2),
          ')'::text,
          ''::text
        ),
        '('::text,
        ''::text
      )::integer as srid
    from
      (
        select
          pg_constraint.connamespace,
          pg_constraint.conrelid,
          pg_constraint.conkey,
          pg_get_constraintdef(pg_constraint.oid) as consrc
        from
          pg_constraint
      ) s
    where
      s.consrc ~~* '%srid(% = %'::text
  ) sr on sr.connamespace = n.oid
  and sr.conrelid = c.oid
  and (a.attnum = any (sr.conkey))
where
  (
    c.relkind = any (
      array[
        'r'::"char",
        'v'::"char",
        'm'::"char",
        'f'::"char",
        'p'::"char"
      ]
    )
  )
  and not c.relname = 'raster_columns'::name
  and t.typname = 'geometry'::name
  and not pg_is_other_temp_schema(c.relnamespace)
  and has_table_privilege(c.oid, 'SELECT'::text);


  create table public.order_items (
  id uuid not null default extensions.uuid_generate_v4 (),
  order_id uuid null,
  product_id uuid null,
  product_name character varying(255) not null,
  product_price numeric(10, 2) not null,
  quantity integer not null,
  total numeric(10, 2) not null,
  created_at timestamp with time zone null default now(),
  constraint order_items_pkey primary key (id),
  constraint order_items_order_id_fkey foreign KEY (order_id) references orders (id) on delete CASCADE,
  constraint order_items_product_id_fkey foreign KEY (product_id) references products (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_order_items_order on public.order_items using btree (order_id) TABLESPACE pg_default;


create table public.products (
  id uuid not null default extensions.uuid_generate_v4 (),
  store_id uuid null,
  category_id uuid null,
  subcategory_id uuid null,
  name character varying(255) not null,
  slug character varying(255) not null,
  description text null,
  price numeric(10, 2) not null,
  unit character varying(50) null,
  image_url text null,
  is_active boolean null default true,
  constraint products_pkey primary key (id),
  constraint products_category_id_fkey foreign KEY (category_id) references categories (id) on delete set null,
  constraint products_store_id_fkey foreign KEY (store_id) references stores (id),
  constraint products_subcategory_id_fkey foreign KEY (subcategory_id) references categories (id) on delete set null
) TABLESPACE pg_default;

create index IF not exists idx_products_store_category on public.products using btree (store_id, category_id) TABLESPACE pg_default;

create index IF not exists idx_products_search on public.products using gin (
  to_tsvector(
    'arabic'::regconfig,
    (
      ((name)::text || ' '::text) || COALESCE(description, ''::text)
    )
  )
) TABLESPACE pg_default;


create table public.spatial_ref_sys (
  srid integer not null,
  auth_name character varying(256) null,
  auth_srid integer null,
  srtext character varying(2048) null,
  proj4text character varying(2048) null,
  constraint spatial_ref_sys_pkey primary key (srid),
  constraint spatial_ref_sys_srid_check check (
    (
      (srid > 0)
      and (srid <= 998999)
    )
  )
) TABLESPACE pg_default;

create table public.promo_codes (
  id uuid not null default extensions.uuid_generate_v4 (),
  store_id uuid null,
  code character varying(50) not null,
  description text null,
  discount_type character varying(20) not null,
  discount_value numeric(10, 2) not null,
  min_order_amount numeric(10, 2) null default 0,
  max_discount_amount numeric(10, 2) null,
  usage_limit integer null,
  used_count integer null default 0,
  is_active boolean null default true,
  start_date timestamp with time zone null,
  end_date timestamp with time zone null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint promo_codes_pkey primary key (id),
  constraint promo_codes_store_id_code_key unique (store_id, code),
  constraint promo_codes_discount_type_check check (
    (
      (discount_type)::text = any (
        (
          array[
            'percentage'::character varying,
            'fixed'::character varying
          ]
        )::text[]
      )
    )
  )
) TABLESPACE pg_default;


create table public.notifications (
  id uuid not null default extensions.uuid_generate_v4 (),
  type character varying(50) not null,
  title character varying(255) not null,
  message text not null,
  data jsonb null,
  is_read boolean null default false,
  admin_user_id uuid null,
  created_at timestamp with time zone null default now(),
  constraint notifications_pkey primary key (id),
  constraint notifications_admin_user_id_fkey foreign KEY (admin_user_id) references admin_users (id)
) TABLESPACE pg_default;