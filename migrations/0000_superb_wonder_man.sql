CREATE TABLE "brands" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text NOT NULL,
	"slug" text NOT NULL,
	"tipo" text NOT NULL,
	"descricao_curta" text,
	"logo_url" text,
	"site_url" text,
	"ativo" boolean DEFAULT true NOT NULL,
	CONSTRAINT "brands_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"tipo" text NOT NULL,
	"empresa_nome" text,
	"cnpj_cpf" text,
	"endereco" jsonb,
	"lista_preco_padrao_id" varchar,
	"interesses" jsonb
);
--> statement-breakpoint
CREATE TABLE "lot_events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lot_id" varchar NOT NULL,
	"tipo_evento" text NOT NULL,
	"data_evento" text DEFAULT now(),
	"detalhes" jsonb
);
--> statement-breakpoint
CREATE TABLE "lot_negotiations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lot_id" varchar NOT NULL,
	"preco_oferecido_r_kg" numeric(12, 2) NOT NULL,
	"preco_sugerido_r_kg" numeric(12, 2) NOT NULL,
	"preco_min_r_kg" numeric(12, 2) NOT NULL,
	"status" text DEFAULT 'proposta_qualitheo' NOT NULL,
	"created_at" text DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "lots" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"producer_id" varchar NOT NULL,
	"tipo" text NOT NULL,
	"safra" text NOT NULL,
	"peso_kg" numeric(14, 3) NOT NULL,
	"origem_talhao" text,
	"score_qualidade" numeric(5, 2),
	"indice_fidelidade" numeric(4, 2),
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" text DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" varchar NOT NULL,
	"product_id" varchar NOT NULL,
	"quantidade" numeric(14, 3) NOT NULL,
	"preco_unitario" numeric(14, 2) NOT NULL,
	"subtotal" numeric(14, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" varchar NOT NULL,
	"tipo" text NOT NULL,
	"status" text DEFAULT 'rascunho' NOT NULL,
	"total_bruto" numeric(14, 2) DEFAULT '0' NOT NULL,
	"descontos" numeric(14, 2) DEFAULT '0' NOT NULL,
	"total_liquido" numeric(14, 2) DEFAULT '0' NOT NULL,
	"moeda" text DEFAULT 'BRL' NOT NULL,
	"canal" text DEFAULT 'site' NOT NULL,
	"condicoes_pagamento" text,
	"observacoes" text,
	"referencia_cliente" text,
	"created_at" text DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "price_lists" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text NOT NULL,
	"tipo_cliente" text NOT NULL,
	"moeda" text DEFAULT 'BRL' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pricing_models" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"modalidade" text NOT NULL,
	"preco_ref_mercado_usd_ton" numeric(14, 2) NOT NULL,
	"fx_usd_brl" numeric(10, 4) NOT NULL,
	"preco_ref_seco_bruto_r_kg" numeric(12, 4) NOT NULL,
	"fator_conversao_baba_para_seco" numeric(4, 2) NOT NULL,
	"custo_processamento_r_kg_seco" numeric(12, 4) NOT NULL,
	"margem_qualitheo_pct" numeric(5, 4) NOT NULL,
	"bonus_qualidade_pct_min" numeric(5, 4) NOT NULL,
	"bonus_qualidade_pct_max" numeric(5, 4) NOT NULL,
	"bonus_fidelidade_pct_max" numeric(5, 4) NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "producers" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"nome" text NOT NULL,
	"fazenda_nome" text,
	"cpf_cnpj" text NOT NULL,
	"municipio" text NOT NULL,
	"estado" text NOT NULL,
	"contato_email" text,
	"contato_telefone" text,
	"documentos" jsonb,
	"ativo" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_prices" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" varchar NOT NULL,
	"price_list_id" varchar NOT NULL,
	"preco_unitario" numeric(12, 2) NOT NULL,
	"moeda" text DEFAULT 'BRL' NOT NULL,
	"moq" numeric(12, 2) NOT NULL,
	"descontos_por_volume" jsonb
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_id" varchar NOT NULL,
	"nome" text NOT NULL,
	"slug" text NOT NULL,
	"tipo_produto" text NOT NULL,
	"linha" text NOT NULL,
	"descricao" text,
	"especificacoes_tecnicas" jsonb,
	"uso_principal" text,
	"unidade_base" text NOT NULL,
	"imagens" jsonb,
	"ativo" boolean DEFAULT true NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_lista_preco_padrao_id_price_lists_id_fk" FOREIGN KEY ("lista_preco_padrao_id") REFERENCES "public"."price_lists"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lot_events" ADD CONSTRAINT "lot_events_lot_id_lots_id_fk" FOREIGN KEY ("lot_id") REFERENCES "public"."lots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lot_negotiations" ADD CONSTRAINT "lot_negotiations_lot_id_lots_id_fk" FOREIGN KEY ("lot_id") REFERENCES "public"."lots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lots" ADD CONSTRAINT "lots_producer_id_producers_id_fk" FOREIGN KEY ("producer_id") REFERENCES "public"."producers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "producers" ADD CONSTRAINT "producers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_prices" ADD CONSTRAINT "product_prices_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_prices" ADD CONSTRAINT "product_prices_price_list_id_price_lists_id_fk" FOREIGN KEY ("price_list_id") REFERENCES "public"."price_lists"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;