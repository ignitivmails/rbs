import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'bn');
  CREATE TYPE "public"."enum_orders_items_kind" AS ENUM('product', 'box');
  CREATE TYPE "public"."enum_orders_status" AS ENUM('pending_payment', 'paid', 'confirmed_cod', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded', 'rto');
  CREATE TYPE "public"."enum_orders_payment_method" AS ENUM('razorpay', 'cod');
  CREATE TYPE "public"."enum_orders_payment_status" AS ENUM('pending', 'paid', 'failed', 'refunded');
  CREATE TYPE "public"."enum_customers_auth_providers" AS ENUM('phone', 'google');
  CREATE TYPE "public"."enum_coupons_type" AS ENUM('percent', 'flat', 'freeShipping');
  CREATE TYPE "public"."enum_quantity_discounts_tiers_type" AS ENUM('percent', 'flatPerUnit');
  CREATE TYPE "public"."enum_quantity_discounts_apply_to" AS ENUM('eachProduct', 'combined');
  CREATE TYPE "public"."enum_posts_section" AS ENUM('blog', 'library');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_section" AS ENUM('blog', 'library');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_published_locale" AS ENUM('en', 'bn');
  CREATE TYPE "public"."enum_stores_services" AS ENUM('fresh', 'cafe', 'pickup', 'parking', 'seating');
  CREATE TYPE "public"."enum_pages_blocks_hero_slides_ctas_link_type" AS ENUM('custom', 'reference');
  CREATE TYPE "public"."enum_pages_blocks_hero_slides_ctas_appearance" AS ENUM('primary', 'secondary', 'light', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_hero_slides_align" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_pages_blocks_hero_slides_tone" AS ENUM('light', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_hero_variant" AS ENUM('carousel', 'fullBleed', 'split');
  CREATE TYPE "public"."enum_pages_blocks_hero_height" AS ENUM('sm', 'md', 'lg', 'screen');
  CREATE TYPE "public"."enum_pages_blocks_hero_style_background" AS ENUM('none', 'surface', 'secondary', 'primary', 'accent', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_hero_style_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_hero_style_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_hero_style_width" AS ENUM('container', 'narrow', 'full');
  CREATE TYPE "public"."enum_pages_blocks_hero_style_visibility" AS ENUM('all', 'desktop', 'mobile');
  CREATE TYPE "public"."enum_pages_blocks_category_grid_tiles_link_type" AS ENUM('custom', 'reference');
  CREATE TYPE "public"."enum_pages_blocks_category_grid_source" AS ENUM('categories', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_category_grid_variant" AS ENUM('cards', 'circles', 'scroll');
  CREATE TYPE "public"."enum_pages_blocks_category_grid_style_background" AS ENUM('none', 'surface', 'secondary', 'primary', 'accent', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_category_grid_style_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_category_grid_style_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_category_grid_style_width" AS ENUM('container', 'narrow', 'full');
  CREATE TYPE "public"."enum_pages_blocks_category_grid_style_visibility" AS ENUM('all', 'desktop', 'mobile');
  CREATE TYPE "public"."enum_pages_blocks_product_collection_source" AS ENUM('manual', 'category', 'tag', 'featured', 'newest', 'discount');
  CREATE TYPE "public"."enum_pages_blocks_product_collection_variant" AS ENUM('grid', 'carousel');
  CREATE TYPE "public"."enum_pages_blocks_product_collection_view_all_type" AS ENUM('custom', 'reference');
  CREATE TYPE "public"."enum_pages_blocks_product_collection_style_background" AS ENUM('none', 'surface', 'secondary', 'primary', 'accent', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_product_collection_style_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_product_collection_style_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_product_collection_style_width" AS ENUM('container', 'narrow', 'full');
  CREATE TYPE "public"."enum_pages_blocks_product_collection_style_visibility" AS ENUM('all', 'desktop', 'mobile');
  CREATE TYPE "public"."enum_pages_blocks_logo_marquee_variant" AS ENUM('marquee', 'static');
  CREATE TYPE "public"."enum_pages_blocks_logo_marquee_speed" AS ENUM('slow', 'normal', 'fast');
  CREATE TYPE "public"."enum_pages_blocks_logo_marquee_style_background" AS ENUM('none', 'surface', 'secondary', 'primary', 'accent', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_logo_marquee_style_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_logo_marquee_style_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_logo_marquee_style_width" AS ENUM('container', 'narrow', 'full');
  CREATE TYPE "public"."enum_pages_blocks_logo_marquee_style_visibility" AS ENUM('all', 'desktop', 'mobile');
  CREATE TYPE "public"."enum_pages_blocks_feature_tiles_tiles_link_type" AS ENUM('custom', 'reference');
  CREATE TYPE "public"."enum_pages_blocks_feature_tiles_variant" AS ENUM('cards', 'overlay');
  CREATE TYPE "public"."enum_pages_blocks_feature_tiles_style_background" AS ENUM('none', 'surface', 'secondary', 'primary', 'accent', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_feature_tiles_style_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_feature_tiles_style_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_feature_tiles_style_width" AS ENUM('container', 'narrow', 'full');
  CREATE TYPE "public"."enum_pages_blocks_feature_tiles_style_visibility" AS ENUM('all', 'desktop', 'mobile');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_source" AS ENUM('featured', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_variant" AS ENUM('cards', 'carousel', 'quote');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_style_background" AS ENUM('none', 'surface', 'secondary', 'primary', 'accent', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_style_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_style_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_style_width" AS ENUM('container', 'narrow', 'full');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_style_visibility" AS ENUM('all', 'desktop', 'mobile');
  CREATE TYPE "public"."enum_pages_blocks_stats_variant" AS ENUM('row', 'cards');
  CREATE TYPE "public"."enum_pages_blocks_stats_style_background" AS ENUM('none', 'surface', 'secondary', 'primary', 'accent', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_stats_style_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_stats_style_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_stats_style_width" AS ENUM('container', 'narrow', 'full');
  CREATE TYPE "public"."enum_pages_blocks_stats_style_visibility" AS ENUM('all', 'desktop', 'mobile');
  CREATE TYPE "public"."enum_pages_blocks_image_with_text_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_image_with_text_variant" AS ENUM('default', 'overlap');
  CREATE TYPE "public"."enum_pages_blocks_image_with_text_cta_type" AS ENUM('custom', 'reference');
  CREATE TYPE "public"."enum_pages_blocks_image_with_text_style_background" AS ENUM('none', 'surface', 'secondary', 'primary', 'accent', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_image_with_text_style_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_image_with_text_style_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_image_with_text_style_width" AS ENUM('container', 'narrow', 'full');
  CREATE TYPE "public"."enum_pages_blocks_image_with_text_style_visibility" AS ENUM('all', 'desktop', 'mobile');
  CREATE TYPE "public"."enum_pages_blocks_banner_strip_cta_type" AS ENUM('custom', 'reference');
  CREATE TYPE "public"."enum_pages_blocks_banner_strip_variant" AS ENUM('slim', 'tall');
  CREATE TYPE "public"."enum_pages_blocks_banner_strip_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_banner_strip_style_background" AS ENUM('none', 'surface', 'secondary', 'primary', 'accent', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_banner_strip_style_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_banner_strip_style_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_banner_strip_style_width" AS ENUM('container', 'narrow', 'full');
  CREATE TYPE "public"."enum_pages_blocks_banner_strip_style_visibility" AS ENUM('all', 'desktop', 'mobile');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_width" AS ENUM('narrow', 'wide');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_style_background" AS ENUM('none', 'surface', 'secondary', 'primary', 'accent', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_style_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_style_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_style_width" AS ENUM('container', 'narrow', 'full');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_style_visibility" AS ENUM('all', 'desktop', 'mobile');
  CREATE TYPE "public"."enum_pages_blocks_newsletter_variant" AS ENUM('card', 'inline');
  CREATE TYPE "public"."enum_pages_blocks_newsletter_style_background" AS ENUM('none', 'surface', 'secondary', 'primary', 'accent', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_newsletter_style_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_newsletter_style_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_newsletter_style_width" AS ENUM('container', 'narrow', 'full');
  CREATE TYPE "public"."enum_pages_blocks_newsletter_style_visibility" AS ENUM('all', 'desktop', 'mobile');
  CREATE TYPE "public"."enum_pages_blocks_faq_style_background" AS ENUM('none', 'surface', 'secondary', 'primary', 'accent', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_faq_style_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_faq_style_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_faq_style_width" AS ENUM('container', 'narrow', 'full');
  CREATE TYPE "public"."enum_pages_blocks_faq_style_visibility" AS ENUM('all', 'desktop', 'mobile');
  CREATE TYPE "public"."enum_pages_blocks_track_order_style_background" AS ENUM('none', 'surface', 'secondary', 'primary', 'accent', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_track_order_style_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_track_order_style_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_track_order_style_width" AS ENUM('container', 'narrow', 'full');
  CREATE TYPE "public"."enum_pages_blocks_track_order_style_visibility" AS ENUM('all', 'desktop', 'mobile');
  CREATE TYPE "public"."enum_pages_blocks_enquiry_form_enquiry_type" AS ENUM('any', 'corporate', 'wedding', 'celebration', 'baby', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_enquiry_form_style_background" AS ENUM('none', 'surface', 'secondary', 'primary', 'accent', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_enquiry_form_style_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_enquiry_form_style_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_enquiry_form_style_width" AS ENUM('container', 'narrow', 'full');
  CREATE TYPE "public"."enum_pages_blocks_enquiry_form_style_visibility" AS ENUM('all', 'desktop', 'mobile');
  CREATE TYPE "public"."enum_pages_blocks_store_locator_source" AS ENUM('all', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_store_locator_style_background" AS ENUM('none', 'surface', 'secondary', 'primary', 'accent', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_store_locator_style_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_store_locator_style_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_store_locator_style_width" AS ENUM('container', 'narrow', 'full');
  CREATE TYPE "public"."enum_pages_blocks_store_locator_style_visibility" AS ENUM('all', 'desktop', 'mobile');
  CREATE TYPE "public"."enum_pages_blocks_latest_posts_section" AS ENUM('blog', 'library', 'all');
  CREATE TYPE "public"."enum_pages_blocks_latest_posts_view_all_type" AS ENUM('custom', 'reference');
  CREATE TYPE "public"."enum_pages_blocks_latest_posts_style_background" AS ENUM('none', 'surface', 'secondary', 'primary', 'accent', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_latest_posts_style_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_latest_posts_style_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_latest_posts_style_width" AS ENUM('container', 'narrow', 'full');
  CREATE TYPE "public"."enum_pages_blocks_latest_posts_style_visibility" AS ENUM('all', 'desktop', 'mobile');
  CREATE TYPE "public"."enum_pages_blocks_spacer_size" AS ENUM('sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_spacer_style_background" AS ENUM('none', 'surface', 'secondary', 'primary', 'accent', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_spacer_style_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_spacer_style_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_spacer_style_width" AS ENUM('container', 'narrow', 'full');
  CREATE TYPE "public"."enum_pages_blocks_spacer_style_visibility" AS ENUM('all', 'desktop', 'mobile');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_slides_ctas_link_type" AS ENUM('custom', 'reference');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_slides_ctas_appearance" AS ENUM('primary', 'secondary', 'light', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_slides_align" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_slides_tone" AS ENUM('light', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_variant" AS ENUM('carousel', 'fullBleed', 'split');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_height" AS ENUM('sm', 'md', 'lg', 'screen');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_style_background" AS ENUM('none', 'surface', 'secondary', 'primary', 'accent', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_style_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_style_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_style_width" AS ENUM('container', 'narrow', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_style_visibility" AS ENUM('all', 'desktop', 'mobile');
  CREATE TYPE "public"."enum__pages_v_blocks_category_grid_tiles_link_type" AS ENUM('custom', 'reference');
  CREATE TYPE "public"."enum__pages_v_blocks_category_grid_source" AS ENUM('categories', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_category_grid_variant" AS ENUM('cards', 'circles', 'scroll');
  CREATE TYPE "public"."enum__pages_v_blocks_category_grid_style_background" AS ENUM('none', 'surface', 'secondary', 'primary', 'accent', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_category_grid_style_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_category_grid_style_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_category_grid_style_width" AS ENUM('container', 'narrow', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_category_grid_style_visibility" AS ENUM('all', 'desktop', 'mobile');
  CREATE TYPE "public"."enum__pages_v_blocks_product_collection_source" AS ENUM('manual', 'category', 'tag', 'featured', 'newest', 'discount');
  CREATE TYPE "public"."enum__pages_v_blocks_product_collection_variant" AS ENUM('grid', 'carousel');
  CREATE TYPE "public"."enum__pages_v_blocks_product_collection_view_all_type" AS ENUM('custom', 'reference');
  CREATE TYPE "public"."enum__pages_v_blocks_product_collection_style_background" AS ENUM('none', 'surface', 'secondary', 'primary', 'accent', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_product_collection_style_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_product_collection_style_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_product_collection_style_width" AS ENUM('container', 'narrow', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_product_collection_style_visibility" AS ENUM('all', 'desktop', 'mobile');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_marquee_variant" AS ENUM('marquee', 'static');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_marquee_speed" AS ENUM('slow', 'normal', 'fast');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_marquee_style_background" AS ENUM('none', 'surface', 'secondary', 'primary', 'accent', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_marquee_style_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_marquee_style_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_marquee_style_width" AS ENUM('container', 'narrow', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_marquee_style_visibility" AS ENUM('all', 'desktop', 'mobile');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_tiles_tiles_link_type" AS ENUM('custom', 'reference');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_tiles_variant" AS ENUM('cards', 'overlay');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_tiles_style_background" AS ENUM('none', 'surface', 'secondary', 'primary', 'accent', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_tiles_style_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_tiles_style_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_tiles_style_width" AS ENUM('container', 'narrow', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_tiles_style_visibility" AS ENUM('all', 'desktop', 'mobile');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_source" AS ENUM('featured', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_variant" AS ENUM('cards', 'carousel', 'quote');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_style_background" AS ENUM('none', 'surface', 'secondary', 'primary', 'accent', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_style_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_style_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_style_width" AS ENUM('container', 'narrow', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_style_visibility" AS ENUM('all', 'desktop', 'mobile');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_variant" AS ENUM('row', 'cards');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_style_background" AS ENUM('none', 'surface', 'secondary', 'primary', 'accent', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_style_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_style_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_style_width" AS ENUM('container', 'narrow', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_style_visibility" AS ENUM('all', 'desktop', 'mobile');
  CREATE TYPE "public"."enum__pages_v_blocks_image_with_text_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_image_with_text_variant" AS ENUM('default', 'overlap');
  CREATE TYPE "public"."enum__pages_v_blocks_image_with_text_cta_type" AS ENUM('custom', 'reference');
  CREATE TYPE "public"."enum__pages_v_blocks_image_with_text_style_background" AS ENUM('none', 'surface', 'secondary', 'primary', 'accent', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_image_with_text_style_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_image_with_text_style_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_image_with_text_style_width" AS ENUM('container', 'narrow', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_image_with_text_style_visibility" AS ENUM('all', 'desktop', 'mobile');
  CREATE TYPE "public"."enum__pages_v_blocks_banner_strip_cta_type" AS ENUM('custom', 'reference');
  CREATE TYPE "public"."enum__pages_v_blocks_banner_strip_variant" AS ENUM('slim', 'tall');
  CREATE TYPE "public"."enum__pages_v_blocks_banner_strip_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_banner_strip_style_background" AS ENUM('none', 'surface', 'secondary', 'primary', 'accent', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_banner_strip_style_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_banner_strip_style_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_banner_strip_style_width" AS ENUM('container', 'narrow', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_banner_strip_style_visibility" AS ENUM('all', 'desktop', 'mobile');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_width" AS ENUM('narrow', 'wide');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_style_background" AS ENUM('none', 'surface', 'secondary', 'primary', 'accent', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_style_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_style_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_style_width" AS ENUM('container', 'narrow', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_style_visibility" AS ENUM('all', 'desktop', 'mobile');
  CREATE TYPE "public"."enum__pages_v_blocks_newsletter_variant" AS ENUM('card', 'inline');
  CREATE TYPE "public"."enum__pages_v_blocks_newsletter_style_background" AS ENUM('none', 'surface', 'secondary', 'primary', 'accent', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_newsletter_style_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_newsletter_style_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_newsletter_style_width" AS ENUM('container', 'narrow', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_newsletter_style_visibility" AS ENUM('all', 'desktop', 'mobile');
  CREATE TYPE "public"."enum__pages_v_blocks_faq_style_background" AS ENUM('none', 'surface', 'secondary', 'primary', 'accent', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_faq_style_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_faq_style_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_faq_style_width" AS ENUM('container', 'narrow', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_faq_style_visibility" AS ENUM('all', 'desktop', 'mobile');
  CREATE TYPE "public"."enum__pages_v_blocks_track_order_style_background" AS ENUM('none', 'surface', 'secondary', 'primary', 'accent', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_track_order_style_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_track_order_style_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_track_order_style_width" AS ENUM('container', 'narrow', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_track_order_style_visibility" AS ENUM('all', 'desktop', 'mobile');
  CREATE TYPE "public"."enum__pages_v_blocks_enquiry_form_enquiry_type" AS ENUM('any', 'corporate', 'wedding', 'celebration', 'baby', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_enquiry_form_style_background" AS ENUM('none', 'surface', 'secondary', 'primary', 'accent', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_enquiry_form_style_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_enquiry_form_style_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_enquiry_form_style_width" AS ENUM('container', 'narrow', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_enquiry_form_style_visibility" AS ENUM('all', 'desktop', 'mobile');
  CREATE TYPE "public"."enum__pages_v_blocks_store_locator_source" AS ENUM('all', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_store_locator_style_background" AS ENUM('none', 'surface', 'secondary', 'primary', 'accent', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_store_locator_style_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_store_locator_style_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_store_locator_style_width" AS ENUM('container', 'narrow', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_store_locator_style_visibility" AS ENUM('all', 'desktop', 'mobile');
  CREATE TYPE "public"."enum__pages_v_blocks_latest_posts_section" AS ENUM('blog', 'library', 'all');
  CREATE TYPE "public"."enum__pages_v_blocks_latest_posts_view_all_type" AS ENUM('custom', 'reference');
  CREATE TYPE "public"."enum__pages_v_blocks_latest_posts_style_background" AS ENUM('none', 'surface', 'secondary', 'primary', 'accent', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_latest_posts_style_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_latest_posts_style_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_latest_posts_style_width" AS ENUM('container', 'narrow', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_latest_posts_style_visibility" AS ENUM('all', 'desktop', 'mobile');
  CREATE TYPE "public"."enum__pages_v_blocks_spacer_size" AS ENUM('sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_spacer_style_background" AS ENUM('none', 'surface', 'secondary', 'primary', 'accent', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_spacer_style_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_spacer_style_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_spacer_style_width" AS ENUM('container', 'narrow', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_spacer_style_visibility" AS ENUM('all', 'desktop', 'mobile');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('en', 'bn');
  CREATE TYPE "public"."enum_products_badges" AS ENUM('bestseller', 'new', 'limited', 'festive', 'sugar-free', 'pune-exclusive');
  CREATE TYPE "public"."enum_products_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__products_v_version_badges" AS ENUM('bestseller', 'new', 'limited', 'festive', 'sugar-free', 'pune-exclusive');
  CREATE TYPE "public"."enum__products_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__products_v_published_locale" AS ENUM('en', 'bn');
  CREATE TYPE "public"."enum_categories_blocks_banner_strip_cta_type" AS ENUM('custom', 'reference');
  CREATE TYPE "public"."enum_categories_blocks_banner_strip_variant" AS ENUM('slim', 'tall');
  CREATE TYPE "public"."enum_categories_blocks_banner_strip_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_categories_blocks_banner_strip_style_background" AS ENUM('none', 'surface', 'secondary', 'primary', 'accent', 'custom');
  CREATE TYPE "public"."enum_categories_blocks_banner_strip_style_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_categories_blocks_banner_strip_style_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_categories_blocks_banner_strip_style_width" AS ENUM('container', 'narrow', 'full');
  CREATE TYPE "public"."enum_categories_blocks_banner_strip_style_visibility" AS ENUM('all', 'desktop', 'mobile');
  CREATE TYPE "public"."enum_categories_blocks_image_with_text_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_categories_blocks_image_with_text_variant" AS ENUM('default', 'overlap');
  CREATE TYPE "public"."enum_categories_blocks_image_with_text_cta_type" AS ENUM('custom', 'reference');
  CREATE TYPE "public"."enum_categories_blocks_image_with_text_style_background" AS ENUM('none', 'surface', 'secondary', 'primary', 'accent', 'custom');
  CREATE TYPE "public"."enum_categories_blocks_image_with_text_style_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_categories_blocks_image_with_text_style_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_categories_blocks_image_with_text_style_width" AS ENUM('container', 'narrow', 'full');
  CREATE TYPE "public"."enum_categories_blocks_image_with_text_style_visibility" AS ENUM('all', 'desktop', 'mobile');
  CREATE TYPE "public"."enum_categories_blocks_rich_text_width" AS ENUM('narrow', 'wide');
  CREATE TYPE "public"."enum_categories_blocks_rich_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_categories_blocks_rich_text_style_background" AS ENUM('none', 'surface', 'secondary', 'primary', 'accent', 'custom');
  CREATE TYPE "public"."enum_categories_blocks_rich_text_style_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_categories_blocks_rich_text_style_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_categories_blocks_rich_text_style_width" AS ENUM('container', 'narrow', 'full');
  CREATE TYPE "public"."enum_categories_blocks_rich_text_style_visibility" AS ENUM('all', 'desktop', 'mobile');
  CREATE TYPE "public"."enum_categories_blocks_feature_tiles_tiles_link_type" AS ENUM('custom', 'reference');
  CREATE TYPE "public"."enum_categories_blocks_feature_tiles_variant" AS ENUM('cards', 'overlay');
  CREATE TYPE "public"."enum_categories_blocks_feature_tiles_style_background" AS ENUM('none', 'surface', 'secondary', 'primary', 'accent', 'custom');
  CREATE TYPE "public"."enum_categories_blocks_feature_tiles_style_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_categories_blocks_feature_tiles_style_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_categories_blocks_feature_tiles_style_width" AS ENUM('container', 'narrow', 'full');
  CREATE TYPE "public"."enum_categories_blocks_feature_tiles_style_visibility" AS ENUM('all', 'desktop', 'mobile');
  CREATE TYPE "public"."enum_categories_blocks_faq_style_background" AS ENUM('none', 'surface', 'secondary', 'primary', 'accent', 'custom');
  CREATE TYPE "public"."enum_categories_blocks_faq_style_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_categories_blocks_faq_style_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_categories_blocks_faq_style_width" AS ENUM('container', 'narrow', 'full');
  CREATE TYPE "public"."enum_categories_blocks_faq_style_visibility" AS ENUM('all', 'desktop', 'mobile');
  CREATE TYPE "public"."enum_delivery_zones_kind" AS ENUM('local', 'panIndia');
  CREATE TYPE "public"."enum_enquiries_type" AS ENUM('corporate', 'wedding', 'celebration', 'baby', 'custom');
  CREATE TYPE "public"."enum_enquiries_status" AS ENUM('new', 'contacted', 'quoted', 'won', 'lost');
  CREATE TYPE "public"."enum_users_role" AS ENUM('owner', 'editor', 'orderManager');
  CREATE TYPE "public"."enum_theme_font_source" AS ENUM('google', 'system');
  CREATE TYPE "public"."enum_theme_heading_weight" AS ENUM('400', '500', '600', '700');
  CREATE TYPE "public"."enum_theme_heading_case" AS ENUM('none', 'uppercase', 'capitalize');
  CREATE TYPE "public"."enum_theme_button_shape" AS ENUM('rounded', 'pill', 'square');
  CREATE TYPE "public"."enum_theme_card_style" AS ENUM('border', 'shadow', 'flat');
  CREATE TYPE "public"."enum_theme_image_ratio" AS ENUM('square', 'portrait', 'landscape');
  CREATE TYPE "public"."enum_theme_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__theme_v_version_font_source" AS ENUM('google', 'system');
  CREATE TYPE "public"."enum__theme_v_version_heading_weight" AS ENUM('400', '500', '600', '700');
  CREATE TYPE "public"."enum__theme_v_version_heading_case" AS ENUM('none', 'uppercase', 'capitalize');
  CREATE TYPE "public"."enum__theme_v_version_button_shape" AS ENUM('rounded', 'pill', 'square');
  CREATE TYPE "public"."enum__theme_v_version_card_style" AS ENUM('border', 'shadow', 'flat');
  CREATE TYPE "public"."enum__theme_v_version_image_ratio" AS ENUM('square', 'portrait', 'landscape');
  CREATE TYPE "public"."enum__theme_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__theme_v_published_locale" AS ENUM('en', 'bn');
  CREATE TYPE "public"."enum_header_nav_items_columns_items_link_type" AS ENUM('custom', 'reference');
  CREATE TYPE "public"."enum_header_nav_items_columns_heading_link_type" AS ENUM('custom', 'reference');
  CREATE TYPE "public"."enum_header_nav_items_layout" AS ENUM('link', 'dropdown', 'mega');
  CREATE TYPE "public"."enum_header_nav_items_link_type" AS ENUM('custom', 'reference');
  CREATE TYPE "public"."enum_header_nav_items_promo_link_type" AS ENUM('custom', 'reference');
  CREATE TYPE "public"."enum_header_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__header_v_version_nav_items_columns_items_link_type" AS ENUM('custom', 'reference');
  CREATE TYPE "public"."enum__header_v_version_nav_items_columns_heading_link_type" AS ENUM('custom', 'reference');
  CREATE TYPE "public"."enum__header_v_version_nav_items_layout" AS ENUM('link', 'dropdown', 'mega');
  CREATE TYPE "public"."enum__header_v_version_nav_items_link_type" AS ENUM('custom', 'reference');
  CREATE TYPE "public"."enum__header_v_version_nav_items_promo_link_type" AS ENUM('custom', 'reference');
  CREATE TYPE "public"."enum__header_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__header_v_published_locale" AS ENUM('en', 'bn');
  CREATE TYPE "public"."enum_announcement_bar_messages_link_type" AS ENUM('custom', 'reference');
  CREATE TYPE "public"."enum_announcement_bar_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__announcement_bar_v_version_messages_link_type" AS ENUM('custom', 'reference');
  CREATE TYPE "public"."enum__announcement_bar_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__announcement_bar_v_published_locale" AS ENUM('en', 'bn');
  CREATE TYPE "public"."enum_footer_columns_links_link_type" AS ENUM('custom', 'reference');
  CREATE TYPE "public"."enum_footer_bottom_links_link_type" AS ENUM('custom', 'reference');
  CREATE TYPE "public"."enum_footer_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__footer_v_version_columns_links_link_type" AS ENUM('custom', 'reference');
  CREATE TYPE "public"."enum__footer_v_version_bottom_links_link_type" AS ENUM('custom', 'reference');
  CREATE TYPE "public"."enum__footer_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__footer_v_published_locale" AS ENUM('en', 'bn');
  CREATE TYPE "public"."enum_site_settings_socials_platform" AS ENUM('instagram', 'facebook', 'x', 'youtube', 'linkedin');
  CREATE TYPE "public"."enum_site_settings_currency" AS ENUM('INR');
  CREATE TABLE "orders_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer,
  	"product_name" varchar NOT NULL,
  	"variant_label" varchar,
  	"sku" varchar,
  	"variant_id" varchar,
  	"unit_price" numeric NOT NULL,
  	"mrp" numeric,
  	"qty" numeric NOT NULL,
  	"line_total" numeric NOT NULL,
  	"line_discount" numeric,
  	"kind" "enum_orders_items_kind" DEFAULT 'product',
  	"box_contents" varchar
  );
  
  CREATE TABLE "orders_status_history" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"status" varchar,
  	"note" varchar,
  	"by" varchar,
  	"at" timestamp(3) with time zone
  );
  
  CREATE TABLE "orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order_number" varchar NOT NULL,
  	"status" "enum_orders_status" DEFAULT 'pending_payment' NOT NULL,
  	"status_note" varchar,
  	"customer_name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"email" varchar,
  	"address_line1" varchar,
  	"address_line2" varchar,
  	"address_landmark" varchar,
  	"address_city" varchar,
  	"address_state" varchar,
  	"address_pincode" varchar,
  	"delivery_zone_id" integer,
  	"zone_name" varchar,
  	"delivery_date" varchar,
  	"delivery_slot" varchar,
  	"delivery_label" varchar,
  	"is_gift" boolean,
  	"hide_prices" boolean,
  	"gift_message" varchar,
  	"notes" varchar,
  	"subtotal" numeric NOT NULL,
  	"quantity_discount" numeric DEFAULT 0,
  	"discount" numeric DEFAULT 0,
  	"shipping" numeric DEFAULT 0,
  	"total" numeric NOT NULL,
  	"mrp_total" numeric,
  	"coupon_code" varchar,
  	"payment_method" "enum_orders_payment_method" NOT NULL,
  	"payment_status" "enum_orders_payment_status" DEFAULT 'pending',
  	"razorpay_order_id" varchar,
  	"razorpay_payment_id" varchar,
  	"refund_id" varchar,
  	"paid_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone,
  	"carrier" varchar,
  	"awb" varchar,
  	"tracking_url" varchar,
  	"internal_notes" varchar,
  	"customer_id" integer,
  	"stock_reserved" boolean,
  	"stock_released" boolean,
  	"access_token" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "customers_auth_providers" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_customers_auth_providers",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "customers_addresses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"name" varchar,
  	"phone" varchar,
  	"is_default" boolean,
  	"line1" varchar NOT NULL,
  	"line2" varchar,
  	"landmark" varchar,
  	"city" varchar NOT NULL,
  	"state" varchar NOT NULL,
  	"pincode" varchar NOT NULL
  );
  
  CREATE TABLE "customers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"phone_verified" boolean,
  	"last_login_at" timestamp(3) with time zone,
  	"google_id" varchar,
  	"cart" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "coupons" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL,
  	"active" boolean DEFAULT true,
  	"type" "enum_coupons_type" DEFAULT 'percent' NOT NULL,
  	"value" numeric,
  	"max_discount" numeric,
  	"min_subtotal" numeric,
  	"starts_at" timestamp(3) with time zone,
  	"ends_at" timestamp(3) with time zone,
  	"usage_limit" numeric,
  	"usage_count" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "coupons_locales" (
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "quantity_discounts_tiers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"min_qty" numeric NOT NULL,
  	"type" "enum_quantity_discounts_tiers_type" DEFAULT 'percent' NOT NULL,
  	"value" numeric NOT NULL
  );
  
  CREATE TABLE "quantity_discounts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"active" boolean DEFAULT true,
  	"apply_to" "enum_quantity_discounts_apply_to" DEFAULT 'eachProduct',
  	"starts_at" timestamp(3) with time zone,
  	"ends_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "quantity_discounts_locales" (
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "quantity_discounts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "gift_boxes_sizes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"pieces" numeric NOT NULL,
  	"price" numeric NOT NULL,
  	"mrp" numeric
  );
  
  CREATE TABLE "gift_boxes_sizes_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "gift_boxes_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"available" boolean DEFAULT true,
  	"extra_price" numeric DEFAULT 0,
  	"max_per_box" numeric
  );
  
  CREATE TABLE "gift_boxes_items_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "gift_boxes_packaging" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"price" numeric DEFAULT 0
  );
  
  CREATE TABLE "gift_boxes_packaging_locales" (
  	"label" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "gift_boxes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"allow_message" boolean DEFAULT true,
  	"meta_image_id" integer,
  	"slug" varchar,
  	"active" boolean DEFAULT true,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "gift_boxes_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "gift_boxes_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"delivery_zones_id" integer
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cover_id" integer,
  	"meta_image_id" integer,
  	"slug" varchar,
  	"section" "enum_posts_section" DEFAULT 'blog',
  	"published_at" timestamp(3) with time zone,
  	"author" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_locales" (
  	"title" varchar,
  	"excerpt" varchar,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "posts_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_cover_id" integer,
  	"version_meta_image_id" integer,
  	"version_slug" varchar,
  	"version_section" "enum__posts_v_version_section" DEFAULT 'blog',
  	"version_published_at" timestamp(3) with time zone,
  	"version_author" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__posts_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_posts_v_locales" (
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_posts_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer
  );
  
  CREATE TABLE "stores_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"time" varchar NOT NULL
  );
  
  CREATE TABLE "stores_hours_locales" (
  	"days" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "stores_services" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_stores_services",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "stores" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"city" varchar DEFAULT 'Pune',
  	"pincode" varchar,
  	"map_query" varchar,
  	"phone" varchar,
  	"whatsapp" varchar,
  	"image_id" integer,
  	"active" boolean DEFAULT true,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "stores_locales" (
  	"name" varchar NOT NULL,
  	"address" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_blocks_hero_slides_ctas" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_blocks_hero_slides_ctas_link_type" DEFAULT 'custom',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"appearance" "enum_pages_blocks_hero_slides_ctas_appearance" DEFAULT 'primary'
  );
  
  CREATE TABLE "pages_blocks_hero_slides_ctas_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_hero_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"mobile_image_id" integer,
  	"align" "enum_pages_blocks_hero_slides_align" DEFAULT 'left',
  	"tone" "enum_pages_blocks_hero_slides_tone" DEFAULT 'light',
  	"overlay" numeric DEFAULT 35
  );
  
  CREATE TABLE "pages_blocks_hero_slides_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_hero_variant" DEFAULT 'carousel',
  	"height" "enum_pages_blocks_hero_height" DEFAULT 'lg',
  	"autoplay_seconds" numeric DEFAULT 6,
  	"enabled" boolean DEFAULT true,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"style_background" "enum_pages_blocks_hero_style_background" DEFAULT 'none',
  	"style_custom_bg" varchar,
  	"style_text_color" varchar,
  	"style_bg_image_id" integer,
  	"style_padding_top" "enum_pages_blocks_hero_style_padding_top" DEFAULT 'md',
  	"style_padding_bottom" "enum_pages_blocks_hero_style_padding_bottom" DEFAULT 'md',
  	"style_width" "enum_pages_blocks_hero_style_width" DEFAULT 'container',
  	"style_visibility" "enum_pages_blocks_hero_style_visibility" DEFAULT 'all',
  	"style_anchor" varchar,
  	"style_class_name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_category_grid_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"link_type" "enum_pages_blocks_category_grid_tiles_link_type" DEFAULT 'custom',
  	"link_new_tab" boolean,
  	"link_url" varchar
  );
  
  CREATE TABLE "pages_blocks_category_grid_tiles_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_category_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_pages_blocks_category_grid_source" DEFAULT 'custom',
  	"variant" "enum_pages_blocks_category_grid_variant" DEFAULT 'cards',
  	"columns" numeric DEFAULT 6,
  	"enabled" boolean DEFAULT true,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"style_background" "enum_pages_blocks_category_grid_style_background" DEFAULT 'none',
  	"style_custom_bg" varchar,
  	"style_text_color" varchar,
  	"style_bg_image_id" integer,
  	"style_padding_top" "enum_pages_blocks_category_grid_style_padding_top" DEFAULT 'md',
  	"style_padding_bottom" "enum_pages_blocks_category_grid_style_padding_bottom" DEFAULT 'md',
  	"style_width" "enum_pages_blocks_category_grid_style_width" DEFAULT 'container',
  	"style_visibility" "enum_pages_blocks_category_grid_style_visibility" DEFAULT 'all',
  	"style_anchor" varchar,
  	"style_class_name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_category_grid_locales" (
  	"heading" varchar,
  	"subheading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_product_collection" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_pages_blocks_product_collection_source" DEFAULT 'featured',
  	"variant" "enum_pages_blocks_product_collection_variant" DEFAULT 'grid',
  	"limit" numeric DEFAULT 8,
  	"columns" numeric DEFAULT 4,
  	"category_id" integer,
  	"tag" varchar,
  	"view_all_type" "enum_pages_blocks_product_collection_view_all_type" DEFAULT 'custom',
  	"view_all_new_tab" boolean,
  	"view_all_url" varchar,
  	"enabled" boolean DEFAULT true,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"style_background" "enum_pages_blocks_product_collection_style_background" DEFAULT 'none',
  	"style_custom_bg" varchar,
  	"style_text_color" varchar,
  	"style_bg_image_id" integer,
  	"style_padding_top" "enum_pages_blocks_product_collection_style_padding_top" DEFAULT 'md',
  	"style_padding_bottom" "enum_pages_blocks_product_collection_style_padding_bottom" DEFAULT 'md',
  	"style_width" "enum_pages_blocks_product_collection_style_width" DEFAULT 'container',
  	"style_visibility" "enum_pages_blocks_product_collection_style_visibility" DEFAULT 'all',
  	"style_anchor" varchar,
  	"style_class_name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_product_collection_locales" (
  	"heading" varchar,
  	"subheading" varchar,
  	"view_all_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_logo_marquee_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"image_id" integer,
  	"url" varchar
  );
  
  CREATE TABLE "pages_blocks_logo_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_logo_marquee_variant" DEFAULT 'marquee',
  	"speed" "enum_pages_blocks_logo_marquee_speed" DEFAULT 'normal',
  	"grayscale" boolean DEFAULT true,
  	"enabled" boolean DEFAULT true,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"style_background" "enum_pages_blocks_logo_marquee_style_background" DEFAULT 'none',
  	"style_custom_bg" varchar,
  	"style_text_color" varchar,
  	"style_bg_image_id" integer,
  	"style_padding_top" "enum_pages_blocks_logo_marquee_style_padding_top" DEFAULT 'md',
  	"style_padding_bottom" "enum_pages_blocks_logo_marquee_style_padding_bottom" DEFAULT 'md',
  	"style_width" "enum_pages_blocks_logo_marquee_style_width" DEFAULT 'container',
  	"style_visibility" "enum_pages_blocks_logo_marquee_style_visibility" DEFAULT 'all',
  	"style_anchor" varchar,
  	"style_class_name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_logo_marquee_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_feature_tiles_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"link_type" "enum_pages_blocks_feature_tiles_tiles_link_type" DEFAULT 'custom',
  	"link_new_tab" boolean,
  	"link_url" varchar
  );
  
  CREATE TABLE "pages_blocks_feature_tiles_tiles_locales" (
  	"title" varchar,
  	"text" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_feature_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_feature_tiles_variant" DEFAULT 'cards',
  	"columns" numeric DEFAULT 4,
  	"enabled" boolean DEFAULT true,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"style_background" "enum_pages_blocks_feature_tiles_style_background" DEFAULT 'none',
  	"style_custom_bg" varchar,
  	"style_text_color" varchar,
  	"style_bg_image_id" integer,
  	"style_padding_top" "enum_pages_blocks_feature_tiles_style_padding_top" DEFAULT 'md',
  	"style_padding_bottom" "enum_pages_blocks_feature_tiles_style_padding_bottom" DEFAULT 'md',
  	"style_width" "enum_pages_blocks_feature_tiles_style_width" DEFAULT 'container',
  	"style_visibility" "enum_pages_blocks_feature_tiles_style_visibility" DEFAULT 'all',
  	"style_anchor" varchar,
  	"style_class_name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_feature_tiles_locales" (
  	"heading" varchar,
  	"subheading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_pages_blocks_testimonials_source" DEFAULT 'featured',
  	"variant" "enum_pages_blocks_testimonials_variant" DEFAULT 'cards',
  	"limit" numeric DEFAULT 3,
  	"enabled" boolean DEFAULT true,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"style_background" "enum_pages_blocks_testimonials_style_background" DEFAULT 'none',
  	"style_custom_bg" varchar,
  	"style_text_color" varchar,
  	"style_bg_image_id" integer,
  	"style_padding_top" "enum_pages_blocks_testimonials_style_padding_top" DEFAULT 'md',
  	"style_padding_bottom" "enum_pages_blocks_testimonials_style_padding_bottom" DEFAULT 'md',
  	"style_width" "enum_pages_blocks_testimonials_style_width" DEFAULT 'container',
  	"style_visibility" "enum_pages_blocks_testimonials_style_visibility" DEFAULT 'all',
  	"style_anchor" varchar,
  	"style_class_name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonials_locales" (
  	"heading" varchar,
  	"subheading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"prefix" varchar,
  	"value" numeric,
  	"suffix" varchar
  );
  
  CREATE TABLE "pages_blocks_stats_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_stats_variant" DEFAULT 'row',
  	"animate" boolean DEFAULT true,
  	"enabled" boolean DEFAULT true,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"style_background" "enum_pages_blocks_stats_style_background" DEFAULT 'none',
  	"style_custom_bg" varchar,
  	"style_text_color" varchar,
  	"style_bg_image_id" integer,
  	"style_padding_top" "enum_pages_blocks_stats_style_padding_top" DEFAULT 'md',
  	"style_padding_bottom" "enum_pages_blocks_stats_style_padding_bottom" DEFAULT 'md',
  	"style_width" "enum_pages_blocks_stats_style_width" DEFAULT 'container',
  	"style_visibility" "enum_pages_blocks_stats_style_visibility" DEFAULT 'all',
  	"style_anchor" varchar,
  	"style_class_name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_stats_locales" (
  	"heading" varchar,
  	"subheading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_image_with_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_position" "enum_pages_blocks_image_with_text_image_position" DEFAULT 'left',
  	"variant" "enum_pages_blocks_image_with_text_variant" DEFAULT 'default',
  	"cta_type" "enum_pages_blocks_image_with_text_cta_type" DEFAULT 'custom',
  	"cta_new_tab" boolean,
  	"cta_url" varchar,
  	"enabled" boolean DEFAULT true,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"style_background" "enum_pages_blocks_image_with_text_style_background" DEFAULT 'none',
  	"style_custom_bg" varchar,
  	"style_text_color" varchar,
  	"style_bg_image_id" integer,
  	"style_padding_top" "enum_pages_blocks_image_with_text_style_padding_top" DEFAULT 'md',
  	"style_padding_bottom" "enum_pages_blocks_image_with_text_style_padding_bottom" DEFAULT 'md',
  	"style_width" "enum_pages_blocks_image_with_text_style_width" DEFAULT 'container',
  	"style_visibility" "enum_pages_blocks_image_with_text_style_visibility" DEFAULT 'all',
  	"style_anchor" varchar,
  	"style_class_name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_image_with_text_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"content" jsonb,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_banner_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"cta_type" "enum_pages_blocks_banner_strip_cta_type" DEFAULT 'custom',
  	"cta_new_tab" boolean,
  	"cta_url" varchar,
  	"variant" "enum_pages_blocks_banner_strip_variant" DEFAULT 'slim',
  	"align" "enum_pages_blocks_banner_strip_align" DEFAULT 'center',
  	"enabled" boolean DEFAULT true,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"style_background" "enum_pages_blocks_banner_strip_style_background" DEFAULT 'none',
  	"style_custom_bg" varchar,
  	"style_text_color" varchar,
  	"style_bg_image_id" integer,
  	"style_padding_top" "enum_pages_blocks_banner_strip_style_padding_top" DEFAULT 'md',
  	"style_padding_bottom" "enum_pages_blocks_banner_strip_style_padding_bottom" DEFAULT 'md',
  	"style_width" "enum_pages_blocks_banner_strip_style_width" DEFAULT 'container',
  	"style_visibility" "enum_pages_blocks_banner_strip_style_visibility" DEFAULT 'all',
  	"style_anchor" varchar,
  	"style_class_name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_banner_strip_locales" (
  	"heading" varchar,
  	"text" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"width" "enum_pages_blocks_rich_text_width" DEFAULT 'narrow',
  	"align" "enum_pages_blocks_rich_text_align" DEFAULT 'left',
  	"enabled" boolean DEFAULT true,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"style_background" "enum_pages_blocks_rich_text_style_background" DEFAULT 'none',
  	"style_custom_bg" varchar,
  	"style_text_color" varchar,
  	"style_bg_image_id" integer,
  	"style_padding_top" "enum_pages_blocks_rich_text_style_padding_top" DEFAULT 'md',
  	"style_padding_bottom" "enum_pages_blocks_rich_text_style_padding_bottom" DEFAULT 'md',
  	"style_width" "enum_pages_blocks_rich_text_style_width" DEFAULT 'container',
  	"style_visibility" "enum_pages_blocks_rich_text_style_visibility" DEFAULT 'all',
  	"style_anchor" varchar,
  	"style_class_name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_rich_text_locales" (
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_newsletter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_newsletter_variant" DEFAULT 'card',
  	"enabled" boolean DEFAULT true,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"style_background" "enum_pages_blocks_newsletter_style_background" DEFAULT 'none',
  	"style_custom_bg" varchar,
  	"style_text_color" varchar,
  	"style_bg_image_id" integer,
  	"style_padding_top" "enum_pages_blocks_newsletter_style_padding_top" DEFAULT 'md',
  	"style_padding_bottom" "enum_pages_blocks_newsletter_style_padding_bottom" DEFAULT 'md',
  	"style_width" "enum_pages_blocks_newsletter_style_width" DEFAULT 'container',
  	"style_visibility" "enum_pages_blocks_newsletter_style_visibility" DEFAULT 'all',
  	"style_anchor" varchar,
  	"style_class_name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_newsletter_locales" (
  	"heading" varchar DEFAULT 'Join the mishti club',
  	"text" varchar,
  	"placeholder" varchar DEFAULT 'Your email address',
  	"button_label" varchar DEFAULT 'Subscribe',
  	"disclaimer" varchar DEFAULT 'We don’t spam. It’s a promise.',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq_items_locales" (
  	"question" varchar,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"style_background" "enum_pages_blocks_faq_style_background" DEFAULT 'none',
  	"style_custom_bg" varchar,
  	"style_text_color" varchar,
  	"style_bg_image_id" integer,
  	"style_padding_top" "enum_pages_blocks_faq_style_padding_top" DEFAULT 'md',
  	"style_padding_bottom" "enum_pages_blocks_faq_style_padding_bottom" DEFAULT 'md',
  	"style_width" "enum_pages_blocks_faq_style_width" DEFAULT 'container',
  	"style_visibility" "enum_pages_blocks_faq_style_visibility" DEFAULT 'all',
  	"style_anchor" varchar,
  	"style_class_name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_locales" (
  	"heading" varchar,
  	"subheading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_track_order" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"style_background" "enum_pages_blocks_track_order_style_background" DEFAULT 'none',
  	"style_custom_bg" varchar,
  	"style_text_color" varchar,
  	"style_bg_image_id" integer,
  	"style_padding_top" "enum_pages_blocks_track_order_style_padding_top" DEFAULT 'md',
  	"style_padding_bottom" "enum_pages_blocks_track_order_style_padding_bottom" DEFAULT 'md',
  	"style_width" "enum_pages_blocks_track_order_style_width" DEFAULT 'container',
  	"style_visibility" "enum_pages_blocks_track_order_style_visibility" DEFAULT 'all',
  	"style_anchor" varchar,
  	"style_class_name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_track_order_locales" (
  	"heading" varchar DEFAULT 'Track your order',
  	"text" varchar DEFAULT 'Enter your order number and the mobile number used at checkout.',
  	"button_label" varchar DEFAULT 'Track order',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_enquiry_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enquiry_type" "enum_pages_blocks_enquiry_form_enquiry_type" DEFAULT 'any',
  	"show_company" boolean DEFAULT true,
  	"show_quantity" boolean DEFAULT true,
  	"show_budget" boolean DEFAULT true,
  	"show_date" boolean DEFAULT true,
  	"enabled" boolean DEFAULT true,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"style_background" "enum_pages_blocks_enquiry_form_style_background" DEFAULT 'none',
  	"style_custom_bg" varchar,
  	"style_text_color" varchar,
  	"style_bg_image_id" integer,
  	"style_padding_top" "enum_pages_blocks_enquiry_form_style_padding_top" DEFAULT 'md',
  	"style_padding_bottom" "enum_pages_blocks_enquiry_form_style_padding_bottom" DEFAULT 'md',
  	"style_width" "enum_pages_blocks_enquiry_form_style_width" DEFAULT 'container',
  	"style_visibility" "enum_pages_blocks_enquiry_form_style_visibility" DEFAULT 'all',
  	"style_anchor" varchar,
  	"style_class_name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_enquiry_form_locales" (
  	"heading" varchar DEFAULT 'Tell us about your gifting plans',
  	"text" varchar,
  	"success_message" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_store_locator" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_pages_blocks_store_locator_source" DEFAULT 'all',
  	"show_map" boolean DEFAULT true,
  	"enabled" boolean DEFAULT true,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"style_background" "enum_pages_blocks_store_locator_style_background" DEFAULT 'none',
  	"style_custom_bg" varchar,
  	"style_text_color" varchar,
  	"style_bg_image_id" integer,
  	"style_padding_top" "enum_pages_blocks_store_locator_style_padding_top" DEFAULT 'md',
  	"style_padding_bottom" "enum_pages_blocks_store_locator_style_padding_bottom" DEFAULT 'md',
  	"style_width" "enum_pages_blocks_store_locator_style_width" DEFAULT 'container',
  	"style_visibility" "enum_pages_blocks_store_locator_style_visibility" DEFAULT 'all',
  	"style_anchor" varchar,
  	"style_class_name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_store_locator_locales" (
  	"heading" varchar DEFAULT 'Visit us',
  	"subheading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_latest_posts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section" "enum_pages_blocks_latest_posts_section" DEFAULT 'blog',
  	"limit" numeric DEFAULT 3,
  	"view_all_type" "enum_pages_blocks_latest_posts_view_all_type" DEFAULT 'custom',
  	"view_all_new_tab" boolean,
  	"view_all_url" varchar,
  	"enabled" boolean DEFAULT true,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"style_background" "enum_pages_blocks_latest_posts_style_background" DEFAULT 'none',
  	"style_custom_bg" varchar,
  	"style_text_color" varchar,
  	"style_bg_image_id" integer,
  	"style_padding_top" "enum_pages_blocks_latest_posts_style_padding_top" DEFAULT 'md',
  	"style_padding_bottom" "enum_pages_blocks_latest_posts_style_padding_bottom" DEFAULT 'md',
  	"style_width" "enum_pages_blocks_latest_posts_style_width" DEFAULT 'container',
  	"style_visibility" "enum_pages_blocks_latest_posts_style_visibility" DEFAULT 'all',
  	"style_anchor" varchar,
  	"style_class_name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_latest_posts_locales" (
  	"heading" varchar,
  	"subheading" varchar,
  	"view_all_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_pages_blocks_spacer_size" DEFAULT 'md',
  	"divider" boolean,
  	"enabled" boolean DEFAULT true,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"style_background" "enum_pages_blocks_spacer_style_background" DEFAULT 'none',
  	"style_custom_bg" varchar,
  	"style_text_color" varchar,
  	"style_bg_image_id" integer,
  	"style_padding_top" "enum_pages_blocks_spacer_style_padding_top" DEFAULT 'md',
  	"style_padding_bottom" "enum_pages_blocks_spacer_style_padding_bottom" DEFAULT 'md',
  	"style_width" "enum_pages_blocks_spacer_style_width" DEFAULT 'container',
  	"style_visibility" "enum_pages_blocks_spacer_style_visibility" DEFAULT 'all',
  	"style_anchor" varchar,
  	"style_class_name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"meta_image_id" integer,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_locales" (
  	"title" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"products_id" integer,
  	"categories_id" integer,
  	"reviews_id" integer,
  	"stores_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_hero_slides_ctas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_blocks_hero_slides_ctas_link_type" DEFAULT 'custom',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"appearance" "enum__pages_v_blocks_hero_slides_ctas_appearance" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_slides_ctas_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_hero_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"mobile_image_id" integer,
  	"align" "enum__pages_v_blocks_hero_slides_align" DEFAULT 'left',
  	"tone" "enum__pages_v_blocks_hero_slides_tone" DEFAULT 'light',
  	"overlay" numeric DEFAULT 35,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_slides_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_hero_variant" DEFAULT 'carousel',
  	"height" "enum__pages_v_blocks_hero_height" DEFAULT 'lg',
  	"autoplay_seconds" numeric DEFAULT 6,
  	"enabled" boolean DEFAULT true,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"style_background" "enum__pages_v_blocks_hero_style_background" DEFAULT 'none',
  	"style_custom_bg" varchar,
  	"style_text_color" varchar,
  	"style_bg_image_id" integer,
  	"style_padding_top" "enum__pages_v_blocks_hero_style_padding_top" DEFAULT 'md',
  	"style_padding_bottom" "enum__pages_v_blocks_hero_style_padding_bottom" DEFAULT 'md',
  	"style_width" "enum__pages_v_blocks_hero_style_width" DEFAULT 'container',
  	"style_visibility" "enum__pages_v_blocks_hero_style_visibility" DEFAULT 'all',
  	"style_anchor" varchar,
  	"style_class_name" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_category_grid_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"link_type" "enum__pages_v_blocks_category_grid_tiles_link_type" DEFAULT 'custom',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_category_grid_tiles_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_category_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"source" "enum__pages_v_blocks_category_grid_source" DEFAULT 'custom',
  	"variant" "enum__pages_v_blocks_category_grid_variant" DEFAULT 'cards',
  	"columns" numeric DEFAULT 6,
  	"enabled" boolean DEFAULT true,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"style_background" "enum__pages_v_blocks_category_grid_style_background" DEFAULT 'none',
  	"style_custom_bg" varchar,
  	"style_text_color" varchar,
  	"style_bg_image_id" integer,
  	"style_padding_top" "enum__pages_v_blocks_category_grid_style_padding_top" DEFAULT 'md',
  	"style_padding_bottom" "enum__pages_v_blocks_category_grid_style_padding_bottom" DEFAULT 'md',
  	"style_width" "enum__pages_v_blocks_category_grid_style_width" DEFAULT 'container',
  	"style_visibility" "enum__pages_v_blocks_category_grid_style_visibility" DEFAULT 'all',
  	"style_anchor" varchar,
  	"style_class_name" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_category_grid_locales" (
  	"heading" varchar,
  	"subheading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_product_collection" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"source" "enum__pages_v_blocks_product_collection_source" DEFAULT 'featured',
  	"variant" "enum__pages_v_blocks_product_collection_variant" DEFAULT 'grid',
  	"limit" numeric DEFAULT 8,
  	"columns" numeric DEFAULT 4,
  	"category_id" integer,
  	"tag" varchar,
  	"view_all_type" "enum__pages_v_blocks_product_collection_view_all_type" DEFAULT 'custom',
  	"view_all_new_tab" boolean,
  	"view_all_url" varchar,
  	"enabled" boolean DEFAULT true,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"style_background" "enum__pages_v_blocks_product_collection_style_background" DEFAULT 'none',
  	"style_custom_bg" varchar,
  	"style_text_color" varchar,
  	"style_bg_image_id" integer,
  	"style_padding_top" "enum__pages_v_blocks_product_collection_style_padding_top" DEFAULT 'md',
  	"style_padding_bottom" "enum__pages_v_blocks_product_collection_style_padding_bottom" DEFAULT 'md',
  	"style_width" "enum__pages_v_blocks_product_collection_style_width" DEFAULT 'container',
  	"style_visibility" "enum__pages_v_blocks_product_collection_style_visibility" DEFAULT 'all',
  	"style_anchor" varchar,
  	"style_class_name" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_product_collection_locales" (
  	"heading" varchar,
  	"subheading" varchar,
  	"view_all_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_logo_marquee_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"image_id" integer,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_logo_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_logo_marquee_variant" DEFAULT 'marquee',
  	"speed" "enum__pages_v_blocks_logo_marquee_speed" DEFAULT 'normal',
  	"grayscale" boolean DEFAULT true,
  	"enabled" boolean DEFAULT true,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"style_background" "enum__pages_v_blocks_logo_marquee_style_background" DEFAULT 'none',
  	"style_custom_bg" varchar,
  	"style_text_color" varchar,
  	"style_bg_image_id" integer,
  	"style_padding_top" "enum__pages_v_blocks_logo_marquee_style_padding_top" DEFAULT 'md',
  	"style_padding_bottom" "enum__pages_v_blocks_logo_marquee_style_padding_bottom" DEFAULT 'md',
  	"style_width" "enum__pages_v_blocks_logo_marquee_style_width" DEFAULT 'container',
  	"style_visibility" "enum__pages_v_blocks_logo_marquee_style_visibility" DEFAULT 'all',
  	"style_anchor" varchar,
  	"style_class_name" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_logo_marquee_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_feature_tiles_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"link_type" "enum__pages_v_blocks_feature_tiles_tiles_link_type" DEFAULT 'custom',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_tiles_tiles_locales" (
  	"title" varchar,
  	"text" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_feature_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_feature_tiles_variant" DEFAULT 'cards',
  	"columns" numeric DEFAULT 4,
  	"enabled" boolean DEFAULT true,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"style_background" "enum__pages_v_blocks_feature_tiles_style_background" DEFAULT 'none',
  	"style_custom_bg" varchar,
  	"style_text_color" varchar,
  	"style_bg_image_id" integer,
  	"style_padding_top" "enum__pages_v_blocks_feature_tiles_style_padding_top" DEFAULT 'md',
  	"style_padding_bottom" "enum__pages_v_blocks_feature_tiles_style_padding_bottom" DEFAULT 'md',
  	"style_width" "enum__pages_v_blocks_feature_tiles_style_width" DEFAULT 'container',
  	"style_visibility" "enum__pages_v_blocks_feature_tiles_style_visibility" DEFAULT 'all',
  	"style_anchor" varchar,
  	"style_class_name" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_tiles_locales" (
  	"heading" varchar,
  	"subheading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"source" "enum__pages_v_blocks_testimonials_source" DEFAULT 'featured',
  	"variant" "enum__pages_v_blocks_testimonials_variant" DEFAULT 'cards',
  	"limit" numeric DEFAULT 3,
  	"enabled" boolean DEFAULT true,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"style_background" "enum__pages_v_blocks_testimonials_style_background" DEFAULT 'none',
  	"style_custom_bg" varchar,
  	"style_text_color" varchar,
  	"style_bg_image_id" integer,
  	"style_padding_top" "enum__pages_v_blocks_testimonials_style_padding_top" DEFAULT 'md',
  	"style_padding_bottom" "enum__pages_v_blocks_testimonials_style_padding_bottom" DEFAULT 'md',
  	"style_width" "enum__pages_v_blocks_testimonials_style_width" DEFAULT 'container',
  	"style_visibility" "enum__pages_v_blocks_testimonials_style_visibility" DEFAULT 'all',
  	"style_anchor" varchar,
  	"style_class_name" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials_locales" (
  	"heading" varchar,
  	"subheading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"prefix" varchar,
  	"value" numeric,
  	"suffix" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_stats_variant" DEFAULT 'row',
  	"animate" boolean DEFAULT true,
  	"enabled" boolean DEFAULT true,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"style_background" "enum__pages_v_blocks_stats_style_background" DEFAULT 'none',
  	"style_custom_bg" varchar,
  	"style_text_color" varchar,
  	"style_bg_image_id" integer,
  	"style_padding_top" "enum__pages_v_blocks_stats_style_padding_top" DEFAULT 'md',
  	"style_padding_bottom" "enum__pages_v_blocks_stats_style_padding_bottom" DEFAULT 'md',
  	"style_width" "enum__pages_v_blocks_stats_style_width" DEFAULT 'container',
  	"style_visibility" "enum__pages_v_blocks_stats_style_visibility" DEFAULT 'all',
  	"style_anchor" varchar,
  	"style_class_name" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats_locales" (
  	"heading" varchar,
  	"subheading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_image_with_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_position" "enum__pages_v_blocks_image_with_text_image_position" DEFAULT 'left',
  	"variant" "enum__pages_v_blocks_image_with_text_variant" DEFAULT 'default',
  	"cta_type" "enum__pages_v_blocks_image_with_text_cta_type" DEFAULT 'custom',
  	"cta_new_tab" boolean,
  	"cta_url" varchar,
  	"enabled" boolean DEFAULT true,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"style_background" "enum__pages_v_blocks_image_with_text_style_background" DEFAULT 'none',
  	"style_custom_bg" varchar,
  	"style_text_color" varchar,
  	"style_bg_image_id" integer,
  	"style_padding_top" "enum__pages_v_blocks_image_with_text_style_padding_top" DEFAULT 'md',
  	"style_padding_bottom" "enum__pages_v_blocks_image_with_text_style_padding_bottom" DEFAULT 'md',
  	"style_width" "enum__pages_v_blocks_image_with_text_style_width" DEFAULT 'container',
  	"style_visibility" "enum__pages_v_blocks_image_with_text_style_visibility" DEFAULT 'all',
  	"style_anchor" varchar,
  	"style_class_name" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_image_with_text_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"content" jsonb,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_banner_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"cta_type" "enum__pages_v_blocks_banner_strip_cta_type" DEFAULT 'custom',
  	"cta_new_tab" boolean,
  	"cta_url" varchar,
  	"variant" "enum__pages_v_blocks_banner_strip_variant" DEFAULT 'slim',
  	"align" "enum__pages_v_blocks_banner_strip_align" DEFAULT 'center',
  	"enabled" boolean DEFAULT true,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"style_background" "enum__pages_v_blocks_banner_strip_style_background" DEFAULT 'none',
  	"style_custom_bg" varchar,
  	"style_text_color" varchar,
  	"style_bg_image_id" integer,
  	"style_padding_top" "enum__pages_v_blocks_banner_strip_style_padding_top" DEFAULT 'md',
  	"style_padding_bottom" "enum__pages_v_blocks_banner_strip_style_padding_bottom" DEFAULT 'md',
  	"style_width" "enum__pages_v_blocks_banner_strip_style_width" DEFAULT 'container',
  	"style_visibility" "enum__pages_v_blocks_banner_strip_style_visibility" DEFAULT 'all',
  	"style_anchor" varchar,
  	"style_class_name" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_banner_strip_locales" (
  	"heading" varchar,
  	"text" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"width" "enum__pages_v_blocks_rich_text_width" DEFAULT 'narrow',
  	"align" "enum__pages_v_blocks_rich_text_align" DEFAULT 'left',
  	"enabled" boolean DEFAULT true,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"style_background" "enum__pages_v_blocks_rich_text_style_background" DEFAULT 'none',
  	"style_custom_bg" varchar,
  	"style_text_color" varchar,
  	"style_bg_image_id" integer,
  	"style_padding_top" "enum__pages_v_blocks_rich_text_style_padding_top" DEFAULT 'md',
  	"style_padding_bottom" "enum__pages_v_blocks_rich_text_style_padding_bottom" DEFAULT 'md',
  	"style_width" "enum__pages_v_blocks_rich_text_style_width" DEFAULT 'container',
  	"style_visibility" "enum__pages_v_blocks_rich_text_style_visibility" DEFAULT 'all',
  	"style_anchor" varchar,
  	"style_class_name" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text_locales" (
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_newsletter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_newsletter_variant" DEFAULT 'card',
  	"enabled" boolean DEFAULT true,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"style_background" "enum__pages_v_blocks_newsletter_style_background" DEFAULT 'none',
  	"style_custom_bg" varchar,
  	"style_text_color" varchar,
  	"style_bg_image_id" integer,
  	"style_padding_top" "enum__pages_v_blocks_newsletter_style_padding_top" DEFAULT 'md',
  	"style_padding_bottom" "enum__pages_v_blocks_newsletter_style_padding_bottom" DEFAULT 'md',
  	"style_width" "enum__pages_v_blocks_newsletter_style_width" DEFAULT 'container',
  	"style_visibility" "enum__pages_v_blocks_newsletter_style_visibility" DEFAULT 'all',
  	"style_anchor" varchar,
  	"style_class_name" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_newsletter_locales" (
  	"heading" varchar DEFAULT 'Join the mishti club',
  	"text" varchar,
  	"placeholder" varchar DEFAULT 'Your email address',
  	"button_label" varchar DEFAULT 'Subscribe',
  	"disclaimer" varchar DEFAULT 'We don’t spam. It’s a promise.',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_items_locales" (
  	"question" varchar,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"style_background" "enum__pages_v_blocks_faq_style_background" DEFAULT 'none',
  	"style_custom_bg" varchar,
  	"style_text_color" varchar,
  	"style_bg_image_id" integer,
  	"style_padding_top" "enum__pages_v_blocks_faq_style_padding_top" DEFAULT 'md',
  	"style_padding_bottom" "enum__pages_v_blocks_faq_style_padding_bottom" DEFAULT 'md',
  	"style_width" "enum__pages_v_blocks_faq_style_width" DEFAULT 'container',
  	"style_visibility" "enum__pages_v_blocks_faq_style_visibility" DEFAULT 'all',
  	"style_anchor" varchar,
  	"style_class_name" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_locales" (
  	"heading" varchar,
  	"subheading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_track_order" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"style_background" "enum__pages_v_blocks_track_order_style_background" DEFAULT 'none',
  	"style_custom_bg" varchar,
  	"style_text_color" varchar,
  	"style_bg_image_id" integer,
  	"style_padding_top" "enum__pages_v_blocks_track_order_style_padding_top" DEFAULT 'md',
  	"style_padding_bottom" "enum__pages_v_blocks_track_order_style_padding_bottom" DEFAULT 'md',
  	"style_width" "enum__pages_v_blocks_track_order_style_width" DEFAULT 'container',
  	"style_visibility" "enum__pages_v_blocks_track_order_style_visibility" DEFAULT 'all',
  	"style_anchor" varchar,
  	"style_class_name" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_track_order_locales" (
  	"heading" varchar DEFAULT 'Track your order',
  	"text" varchar DEFAULT 'Enter your order number and the mobile number used at checkout.',
  	"button_label" varchar DEFAULT 'Track order',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_enquiry_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enquiry_type" "enum__pages_v_blocks_enquiry_form_enquiry_type" DEFAULT 'any',
  	"show_company" boolean DEFAULT true,
  	"show_quantity" boolean DEFAULT true,
  	"show_budget" boolean DEFAULT true,
  	"show_date" boolean DEFAULT true,
  	"enabled" boolean DEFAULT true,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"style_background" "enum__pages_v_blocks_enquiry_form_style_background" DEFAULT 'none',
  	"style_custom_bg" varchar,
  	"style_text_color" varchar,
  	"style_bg_image_id" integer,
  	"style_padding_top" "enum__pages_v_blocks_enquiry_form_style_padding_top" DEFAULT 'md',
  	"style_padding_bottom" "enum__pages_v_blocks_enquiry_form_style_padding_bottom" DEFAULT 'md',
  	"style_width" "enum__pages_v_blocks_enquiry_form_style_width" DEFAULT 'container',
  	"style_visibility" "enum__pages_v_blocks_enquiry_form_style_visibility" DEFAULT 'all',
  	"style_anchor" varchar,
  	"style_class_name" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_enquiry_form_locales" (
  	"heading" varchar DEFAULT 'Tell us about your gifting plans',
  	"text" varchar,
  	"success_message" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_store_locator" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"source" "enum__pages_v_blocks_store_locator_source" DEFAULT 'all',
  	"show_map" boolean DEFAULT true,
  	"enabled" boolean DEFAULT true,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"style_background" "enum__pages_v_blocks_store_locator_style_background" DEFAULT 'none',
  	"style_custom_bg" varchar,
  	"style_text_color" varchar,
  	"style_bg_image_id" integer,
  	"style_padding_top" "enum__pages_v_blocks_store_locator_style_padding_top" DEFAULT 'md',
  	"style_padding_bottom" "enum__pages_v_blocks_store_locator_style_padding_bottom" DEFAULT 'md',
  	"style_width" "enum__pages_v_blocks_store_locator_style_width" DEFAULT 'container',
  	"style_visibility" "enum__pages_v_blocks_store_locator_style_visibility" DEFAULT 'all',
  	"style_anchor" varchar,
  	"style_class_name" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_store_locator_locales" (
  	"heading" varchar DEFAULT 'Visit us',
  	"subheading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_latest_posts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"section" "enum__pages_v_blocks_latest_posts_section" DEFAULT 'blog',
  	"limit" numeric DEFAULT 3,
  	"view_all_type" "enum__pages_v_blocks_latest_posts_view_all_type" DEFAULT 'custom',
  	"view_all_new_tab" boolean,
  	"view_all_url" varchar,
  	"enabled" boolean DEFAULT true,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"style_background" "enum__pages_v_blocks_latest_posts_style_background" DEFAULT 'none',
  	"style_custom_bg" varchar,
  	"style_text_color" varchar,
  	"style_bg_image_id" integer,
  	"style_padding_top" "enum__pages_v_blocks_latest_posts_style_padding_top" DEFAULT 'md',
  	"style_padding_bottom" "enum__pages_v_blocks_latest_posts_style_padding_bottom" DEFAULT 'md',
  	"style_width" "enum__pages_v_blocks_latest_posts_style_width" DEFAULT 'container',
  	"style_visibility" "enum__pages_v_blocks_latest_posts_style_visibility" DEFAULT 'all',
  	"style_anchor" varchar,
  	"style_class_name" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_latest_posts_locales" (
  	"heading" varchar,
  	"subheading" varchar,
  	"view_all_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__pages_v_blocks_spacer_size" DEFAULT 'md',
  	"divider" boolean,
  	"enabled" boolean DEFAULT true,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"style_background" "enum__pages_v_blocks_spacer_style_background" DEFAULT 'none',
  	"style_custom_bg" varchar,
  	"style_text_color" varchar,
  	"style_bg_image_id" integer,
  	"style_padding_top" "enum__pages_v_blocks_spacer_style_padding_top" DEFAULT 'md',
  	"style_padding_bottom" "enum__pages_v_blocks_spacer_style_padding_bottom" DEFAULT 'md',
  	"style_width" "enum__pages_v_blocks_spacer_style_width" DEFAULT 'container',
  	"style_visibility" "enum__pages_v_blocks_spacer_style_visibility" DEFAULT 'all',
  	"style_anchor" varchar,
  	"style_class_name" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_meta_image_id" integer,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__pages_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_title" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"products_id" integer,
  	"categories_id" integer,
  	"reviews_id" integer,
  	"stores_id" integer
  );
  
  CREATE TABLE "products_variants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"sku" varchar,
  	"weight" numeric,
  	"price" numeric,
  	"mrp" numeric,
  	"stock" numeric DEFAULT 100
  );
  
  CREATE TABLE "products_variants_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_badges" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_products_badges",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"is_veg" boolean DEFAULT true,
  	"eggless" boolean DEFAULT true,
  	"meta_image_id" integer,
  	"slug" varchar,
  	"featured" boolean,
  	"sort_order" numeric DEFAULT 0,
  	"price_from" numeric,
  	"max_discount" numeric,
  	"in_stock" boolean DEFAULT true,
  	"ships_pan_india" boolean DEFAULT true,
  	"rating" numeric DEFAULT 0,
  	"review_count" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_products_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "products_locales" (
  	"name" varchar,
  	"short_description" varchar,
  	"description" jsonb,
  	"shelf_life" varchar,
  	"storage" varchar,
  	"ingredients" varchar,
  	"allergens" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "products_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "products_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"products_id" integer,
  	"categories_id" integer,
  	"delivery_zones_id" integer
  );
  
  CREATE TABLE "_products_v_version_variants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"sku" varchar,
  	"weight" numeric,
  	"price" numeric,
  	"mrp" numeric,
  	"stock" numeric DEFAULT 100,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_variants_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_version_badges" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__products_v_version_badges",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_products_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_is_veg" boolean DEFAULT true,
  	"version_eggless" boolean DEFAULT true,
  	"version_meta_image_id" integer,
  	"version_slug" varchar,
  	"version_featured" boolean,
  	"version_sort_order" numeric DEFAULT 0,
  	"version_price_from" numeric,
  	"version_max_discount" numeric,
  	"version_in_stock" boolean DEFAULT true,
  	"version_ships_pan_india" boolean DEFAULT true,
  	"version_rating" numeric DEFAULT 0,
  	"version_review_count" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__products_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__products_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_products_v_locales" (
  	"version_name" varchar,
  	"version_short_description" varchar,
  	"version_description" jsonb,
  	"version_shelf_life" varchar,
  	"version_storage" varchar,
  	"version_ingredients" varchar,
  	"version_allergens" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_products_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"products_id" integer,
  	"categories_id" integer,
  	"delivery_zones_id" integer
  );
  
  CREATE TABLE "categories_blocks_banner_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"cta_type" "enum_categories_blocks_banner_strip_cta_type" DEFAULT 'custom',
  	"cta_new_tab" boolean,
  	"cta_url" varchar,
  	"variant" "enum_categories_blocks_banner_strip_variant" DEFAULT 'slim',
  	"align" "enum_categories_blocks_banner_strip_align" DEFAULT 'center',
  	"enabled" boolean DEFAULT true,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"style_background" "enum_categories_blocks_banner_strip_style_background" DEFAULT 'none',
  	"style_custom_bg" varchar,
  	"style_text_color" varchar,
  	"style_bg_image_id" integer,
  	"style_padding_top" "enum_categories_blocks_banner_strip_style_padding_top" DEFAULT 'md',
  	"style_padding_bottom" "enum_categories_blocks_banner_strip_style_padding_bottom" DEFAULT 'md',
  	"style_width" "enum_categories_blocks_banner_strip_style_width" DEFAULT 'container',
  	"style_visibility" "enum_categories_blocks_banner_strip_style_visibility" DEFAULT 'all',
  	"style_anchor" varchar,
  	"style_class_name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "categories_blocks_banner_strip_locales" (
  	"heading" varchar NOT NULL,
  	"text" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "categories_blocks_image_with_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"image_position" "enum_categories_blocks_image_with_text_image_position" DEFAULT 'left',
  	"variant" "enum_categories_blocks_image_with_text_variant" DEFAULT 'default',
  	"cta_type" "enum_categories_blocks_image_with_text_cta_type" DEFAULT 'custom',
  	"cta_new_tab" boolean,
  	"cta_url" varchar,
  	"enabled" boolean DEFAULT true,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"style_background" "enum_categories_blocks_image_with_text_style_background" DEFAULT 'none',
  	"style_custom_bg" varchar,
  	"style_text_color" varchar,
  	"style_bg_image_id" integer,
  	"style_padding_top" "enum_categories_blocks_image_with_text_style_padding_top" DEFAULT 'md',
  	"style_padding_bottom" "enum_categories_blocks_image_with_text_style_padding_bottom" DEFAULT 'md',
  	"style_width" "enum_categories_blocks_image_with_text_style_width" DEFAULT 'container',
  	"style_visibility" "enum_categories_blocks_image_with_text_style_visibility" DEFAULT 'all',
  	"style_anchor" varchar,
  	"style_class_name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "categories_blocks_image_with_text_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"content" jsonb,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "categories_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"width" "enum_categories_blocks_rich_text_width" DEFAULT 'narrow',
  	"align" "enum_categories_blocks_rich_text_align" DEFAULT 'left',
  	"enabled" boolean DEFAULT true,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"style_background" "enum_categories_blocks_rich_text_style_background" DEFAULT 'none',
  	"style_custom_bg" varchar,
  	"style_text_color" varchar,
  	"style_bg_image_id" integer,
  	"style_padding_top" "enum_categories_blocks_rich_text_style_padding_top" DEFAULT 'md',
  	"style_padding_bottom" "enum_categories_blocks_rich_text_style_padding_bottom" DEFAULT 'md',
  	"style_width" "enum_categories_blocks_rich_text_style_width" DEFAULT 'container',
  	"style_visibility" "enum_categories_blocks_rich_text_style_visibility" DEFAULT 'all',
  	"style_anchor" varchar,
  	"style_class_name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "categories_blocks_rich_text_locales" (
  	"content" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "categories_blocks_feature_tiles_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"link_type" "enum_categories_blocks_feature_tiles_tiles_link_type" DEFAULT 'custom',
  	"link_new_tab" boolean,
  	"link_url" varchar
  );
  
  CREATE TABLE "categories_blocks_feature_tiles_tiles_locales" (
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "categories_blocks_feature_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_categories_blocks_feature_tiles_variant" DEFAULT 'cards',
  	"columns" numeric DEFAULT 4,
  	"enabled" boolean DEFAULT true,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"style_background" "enum_categories_blocks_feature_tiles_style_background" DEFAULT 'none',
  	"style_custom_bg" varchar,
  	"style_text_color" varchar,
  	"style_bg_image_id" integer,
  	"style_padding_top" "enum_categories_blocks_feature_tiles_style_padding_top" DEFAULT 'md',
  	"style_padding_bottom" "enum_categories_blocks_feature_tiles_style_padding_bottom" DEFAULT 'md',
  	"style_width" "enum_categories_blocks_feature_tiles_style_width" DEFAULT 'container',
  	"style_visibility" "enum_categories_blocks_feature_tiles_style_visibility" DEFAULT 'all',
  	"style_anchor" varchar,
  	"style_class_name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "categories_blocks_feature_tiles_locales" (
  	"heading" varchar,
  	"subheading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "categories_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "categories_blocks_faq_items_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "categories_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"style_background" "enum_categories_blocks_faq_style_background" DEFAULT 'none',
  	"style_custom_bg" varchar,
  	"style_text_color" varchar,
  	"style_bg_image_id" integer,
  	"style_padding_top" "enum_categories_blocks_faq_style_padding_top" DEFAULT 'md',
  	"style_padding_bottom" "enum_categories_blocks_faq_style_padding_bottom" DEFAULT 'md',
  	"style_width" "enum_categories_blocks_faq_style_width" DEFAULT 'container',
  	"style_visibility" "enum_categories_blocks_faq_style_visibility" DEFAULT 'all',
  	"style_anchor" varchar,
  	"style_class_name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "categories_blocks_faq_locales" (
  	"heading" varchar,
  	"subheading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"image_id" integer,
  	"meta_image_id" integer,
  	"slug" varchar,
  	"parent_id" integer,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "categories_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "categories_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"products_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "reviews" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"author" varchar NOT NULL,
  	"designation" varchar,
  	"product_id" integer,
  	"rating" numeric DEFAULT 5 NOT NULL,
  	"image_id" integer,
  	"approved" boolean DEFAULT false,
  	"featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "reviews_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "delivery_zones_slots" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "delivery_zones_blackout_dates" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "delivery_zones" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"kind" "enum_delivery_zones_kind" DEFAULT 'local' NOT NULL,
  	"pincodes" varchar,
  	"is_default" boolean,
  	"active" boolean DEFAULT true,
  	"lead_time_days" numeric DEFAULT 1,
  	"same_day_cutoff" varchar,
  	"shipping_fee" numeric DEFAULT 0,
  	"free_shipping_above" numeric,
  	"cod_allowed" boolean DEFAULT true,
  	"cod_limit" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "enquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_enquiries_type" DEFAULT 'corporate' NOT NULL,
  	"status" "enum_enquiries_status" DEFAULT 'new',
  	"name" varchar NOT NULL,
  	"company" varchar,
  	"email" varchar,
  	"phone" varchar,
  	"quantity" numeric,
  	"budget" numeric,
  	"event_date" timestamp(3) with time zone,
  	"message" varchar,
  	"notes" varchar,
  	"assigned_to_id" integer,
  	"follow_up_at" timestamp(3) with time zone,
  	"quote_value" numeric,
  	"source" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "subscribers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"source" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_users_role" DEFAULT 'owner' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "otp_codes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"phone" varchar NOT NULL,
  	"purpose" varchar NOT NULL,
  	"code_hash" varchar NOT NULL,
  	"expires_at" timestamp(3) with time zone NOT NULL,
  	"attempts" numeric DEFAULT 0,
  	"used" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"orders_id" integer,
  	"customers_id" integer,
  	"coupons_id" integer,
  	"quantity_discounts_id" integer,
  	"gift_boxes_id" integer,
  	"posts_id" integer,
  	"stores_id" integer,
  	"pages_id" integer,
  	"products_id" integer,
  	"categories_id" integer,
  	"reviews_id" integer,
  	"delivery_zones_id" integer,
  	"media_id" integer,
  	"enquiries_id" integer,
  	"subscribers_id" integer,
  	"users_id" integer,
  	"otp_codes_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "theme" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"primary" varchar DEFAULT '#8B1E1E',
  	"primary_foreground" varchar DEFAULT '#FFFFFF',
  	"accent" varchar DEFAULT '#C9962B',
  	"background" varchar DEFAULT '#FFF8EE',
  	"surface" varchar DEFAULT '#FFFFFF',
  	"secondary" varchar DEFAULT '#F6E7CC',
  	"text" varchar DEFAULT '#2B1B12',
  	"muted" varchar DEFAULT '#7A6A5E',
  	"border" varchar DEFAULT '#EADCC8',
  	"success" varchar DEFAULT '#2F7D4F',
  	"danger" varchar DEFAULT '#B42318',
  	"font_source" "enum_theme_font_source" DEFAULT 'google',
  	"heading_font" varchar DEFAULT 'Fraunces',
  	"body_font" varchar DEFAULT 'Inter',
  	"base_font_size" numeric DEFAULT 16,
  	"heading_weight" "enum_theme_heading_weight" DEFAULT '600',
  	"heading_case" "enum_theme_heading_case" DEFAULT 'none',
  	"radius" numeric DEFAULT 12,
  	"button_shape" "enum_theme_button_shape" DEFAULT 'rounded',
  	"container_width" numeric DEFAULT 1280,
  	"card_style" "enum_theme_card_style" DEFAULT 'border',
  	"image_ratio" "enum_theme_image_ratio" DEFAULT 'square',
  	"show_rating" boolean DEFAULT true,
  	"show_discount_badge" boolean DEFAULT true,
  	"show_quick_add" boolean DEFAULT true,
  	"show_view_details" boolean DEFAULT true,
  	"custom_css" varchar,
  	"_status" "enum_theme_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_theme_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_primary" varchar DEFAULT '#8B1E1E',
  	"version_primary_foreground" varchar DEFAULT '#FFFFFF',
  	"version_accent" varchar DEFAULT '#C9962B',
  	"version_background" varchar DEFAULT '#FFF8EE',
  	"version_surface" varchar DEFAULT '#FFFFFF',
  	"version_secondary" varchar DEFAULT '#F6E7CC',
  	"version_text" varchar DEFAULT '#2B1B12',
  	"version_muted" varchar DEFAULT '#7A6A5E',
  	"version_border" varchar DEFAULT '#EADCC8',
  	"version_success" varchar DEFAULT '#2F7D4F',
  	"version_danger" varchar DEFAULT '#B42318',
  	"version_font_source" "enum__theme_v_version_font_source" DEFAULT 'google',
  	"version_heading_font" varchar DEFAULT 'Fraunces',
  	"version_body_font" varchar DEFAULT 'Inter',
  	"version_base_font_size" numeric DEFAULT 16,
  	"version_heading_weight" "enum__theme_v_version_heading_weight" DEFAULT '600',
  	"version_heading_case" "enum__theme_v_version_heading_case" DEFAULT 'none',
  	"version_radius" numeric DEFAULT 12,
  	"version_button_shape" "enum__theme_v_version_button_shape" DEFAULT 'rounded',
  	"version_container_width" numeric DEFAULT 1280,
  	"version_card_style" "enum__theme_v_version_card_style" DEFAULT 'border',
  	"version_image_ratio" "enum__theme_v_version_image_ratio" DEFAULT 'square',
  	"version_show_rating" boolean DEFAULT true,
  	"version_show_discount_badge" boolean DEFAULT true,
  	"version_show_quick_add" boolean DEFAULT true,
  	"version_show_view_details" boolean DEFAULT true,
  	"version_custom_css" varchar,
  	"version__status" "enum__theme_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__theme_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "header_nav_items_columns_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_header_nav_items_columns_items_link_type" DEFAULT 'custom',
  	"link_new_tab" boolean,
  	"link_url" varchar
  );
  
  CREATE TABLE "header_nav_items_columns_items_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "header_nav_items_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_link_type" "enum_header_nav_items_columns_heading_link_type" DEFAULT 'custom',
  	"heading_link_new_tab" boolean,
  	"heading_link_url" varchar
  );
  
  CREATE TABLE "header_nav_items_columns_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "header_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout" "enum_header_nav_items_layout" DEFAULT 'link',
  	"link_type" "enum_header_nav_items_link_type" DEFAULT 'custom',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"promo_image_id" integer,
  	"promo_link_type" "enum_header_nav_items_promo_link_type" DEFAULT 'custom',
  	"promo_link_new_tab" boolean,
  	"promo_link_url" varchar
  );
  
  CREATE TABLE "header_nav_items_locales" (
  	"label" varchar,
  	"promo_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"logo_height" numeric DEFAULT 44,
  	"utility_enabled" boolean DEFAULT true,
  	"utility_show_phone" boolean DEFAULT true,
  	"utility_show_whatsapp" boolean DEFAULT true,
  	"utility_show_socials" boolean DEFAULT true,
  	"utility_background" varchar,
  	"utility_text_color" varchar,
  	"sticky" boolean DEFAULT true,
  	"show_search" boolean DEFAULT true,
  	"show_account" boolean DEFAULT true,
  	"show_cart" boolean DEFAULT true,
  	"_status" "enum_header_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "header_locales" (
  	"logo_text" varchar DEFAULT 'Real Bengal Sweets',
  	"utility_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "header_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar,
  	"locale" "_locales"
  );
  
  CREATE TABLE "header_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"products_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "_header_v_version_nav_items_columns_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__header_v_version_nav_items_columns_items_link_type" DEFAULT 'custom',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_header_v_version_nav_items_columns_items_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_header_v_version_nav_items_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_link_type" "enum__header_v_version_nav_items_columns_heading_link_type" DEFAULT 'custom',
  	"heading_link_new_tab" boolean,
  	"heading_link_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_header_v_version_nav_items_columns_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_header_v_version_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout" "enum__header_v_version_nav_items_layout" DEFAULT 'link',
  	"link_type" "enum__header_v_version_nav_items_link_type" DEFAULT 'custom',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"promo_image_id" integer,
  	"promo_link_type" "enum__header_v_version_nav_items_promo_link_type" DEFAULT 'custom',
  	"promo_link_new_tab" boolean,
  	"promo_link_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_header_v_version_nav_items_locales" (
  	"label" varchar,
  	"promo_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_header_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_logo_id" integer,
  	"version_logo_height" numeric DEFAULT 44,
  	"version_utility_enabled" boolean DEFAULT true,
  	"version_utility_show_phone" boolean DEFAULT true,
  	"version_utility_show_whatsapp" boolean DEFAULT true,
  	"version_utility_show_socials" boolean DEFAULT true,
  	"version_utility_background" varchar,
  	"version_utility_text_color" varchar,
  	"version_sticky" boolean DEFAULT true,
  	"version_show_search" boolean DEFAULT true,
  	"version_show_account" boolean DEFAULT true,
  	"version_show_cart" boolean DEFAULT true,
  	"version__status" "enum__header_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__header_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_header_v_locales" (
  	"version_logo_text" varchar DEFAULT 'Real Bengal Sweets',
  	"version_utility_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_header_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar,
  	"locale" "_locales"
  );
  
  CREATE TABLE "_header_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"products_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "announcement_bar_messages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_announcement_bar_messages_link_type" DEFAULT 'custom',
  	"link_new_tab" boolean,
  	"link_url" varchar
  );
  
  CREATE TABLE "announcement_bar_messages_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "announcement_bar" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"rotate_seconds" numeric DEFAULT 5,
  	"dismissible" boolean DEFAULT false,
  	"background" varchar,
  	"text_color" varchar,
  	"show_from" timestamp(3) with time zone,
  	"show_until" timestamp(3) with time zone,
  	"_status" "enum_announcement_bar_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "announcement_bar_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"products_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "_announcement_bar_v_version_messages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__announcement_bar_v_version_messages_link_type" DEFAULT 'custom',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_announcement_bar_v_version_messages_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_announcement_bar_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_enabled" boolean DEFAULT true,
  	"version_rotate_seconds" numeric DEFAULT 5,
  	"version_dismissible" boolean DEFAULT false,
  	"version_background" varchar,
  	"version_text_color" varchar,
  	"version_show_from" timestamp(3) with time zone,
  	"version_show_until" timestamp(3) with time zone,
  	"version__status" "enum__announcement_bar_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__announcement_bar_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_announcement_bar_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"products_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_columns_links_link_type" DEFAULT 'custom',
  	"link_new_tab" boolean,
  	"link_url" varchar
  );
  
  CREATE TABLE "footer_columns_links_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "footer_columns_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_bottom_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_bottom_links_link_type" DEFAULT 'custom',
  	"link_new_tab" boolean,
  	"link_url" varchar
  );
  
  CREATE TABLE "footer_bottom_links_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"show_newsletter" boolean DEFAULT true,
  	"show_contact" boolean DEFAULT true,
  	"show_socials" boolean DEFAULT true,
  	"background" varchar,
  	"text_color" varchar,
  	"_status" "enum_footer_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_locales" (
  	"about" varchar,
  	"newsletter_heading" varchar DEFAULT 'Stay in the loop',
  	"newsletter_text" varchar DEFAULT 'Subscribe for festive launches, workshops and members-only offers.',
  	"newsletter_placeholder" varchar DEFAULT 'Your email address',
  	"newsletter_button" varchar DEFAULT 'Subscribe',
  	"newsletter_disclaimer" varchar DEFAULT 'We don’t spam. It’s a promise.',
  	"copyright" varchar DEFAULT '© {year} Real Bengal Sweets. All rights reserved.',
  	"legal_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "footer_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"products_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "_footer_v_version_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__footer_v_version_columns_links_link_type" DEFAULT 'custom',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_footer_v_version_columns_links_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_footer_v_version_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_footer_v_version_columns_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_footer_v_version_bottom_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__footer_v_version_bottom_links_link_type" DEFAULT 'custom',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_footer_v_version_bottom_links_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_footer_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_show_newsletter" boolean DEFAULT true,
  	"version_show_contact" boolean DEFAULT true,
  	"version_show_socials" boolean DEFAULT true,
  	"version_background" varchar,
  	"version_text_color" varchar,
  	"version__status" "enum__footer_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__footer_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_footer_v_locales" (
  	"version_about" varchar,
  	"version_newsletter_heading" varchar DEFAULT 'Stay in the loop',
  	"version_newsletter_text" varchar DEFAULT 'Subscribe for festive launches, workshops and members-only offers.',
  	"version_newsletter_placeholder" varchar DEFAULT 'Your email address',
  	"version_newsletter_button" varchar DEFAULT 'Subscribe',
  	"version_newsletter_disclaimer" varchar DEFAULT 'We don’t spam. It’s a promise.',
  	"version_copyright" varchar DEFAULT '© {year} Real Bengal Sweets. All rights reserved.',
  	"version_legal_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_footer_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"products_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "site_settings_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_site_settings_socials_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'Real Bengal Sweets' NOT NULL,
  	"favicon_id" integer,
  	"title_template" varchar DEFAULT '%s | Real Bengal Sweets',
  	"og_image_id" integer,
  	"phone" varchar,
  	"whatsapp" varchar,
  	"email" varchar,
  	"whatsapp_float" boolean DEFAULT true,
  	"whatsapp_message" varchar DEFAULT 'Hi! I have a question about an order.',
  	"currency" "enum_site_settings_currency" DEFAULT 'INR',
  	"prices_include_tax" boolean DEFAULT true,
  	"min_order_value" numeric DEFAULT 0,
  	"razorpay_enabled" boolean DEFAULT true,
  	"cod_enabled" boolean DEFAULT true,
  	"upi_first" boolean DEFAULT true,
  	"cod_requires_otp" boolean DEFAULT true,
  	"gift_options" boolean DEFAULT true,
  	"order_prefix" varchar DEFAULT 'RBS',
  	"payment_window_minutes" numeric DEFAULT 30,
  	"auto_create_shipment" boolean DEFAULT true,
  	"package_length" numeric DEFAULT 20,
  	"package_breadth" numeric DEFAULT 15,
  	"package_height" numeric DEFAULT 10,
  	"packaging_weight" numeric DEFAULT 150,
  	"enable_bengali" boolean DEFAULT false,
  	"ga4_id" varchar,
  	"meta_pixel_id" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_locales" (
  	"tagline" varchar,
  	"meta_description" varchar,
  	"address" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "ui_strings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "ui_strings_locales" (
  	"add_to_cart" varchar DEFAULT 'Add to Cart',
  	"added" varchar DEFAULT 'Added ✓',
  	"view_details" varchar DEFAULT 'View details',
  	"from_price" varchar DEFAULT 'From',
  	"off" varchar DEFAULT '{percent}% off',
  	"tax_note" varchar DEFAULT 'MRP inclusive of all taxes',
  	"out_of_stock" varchar DEFAULT 'Out of stock',
  	"select_variant" varchar DEFAULT 'Choose size',
  	"quantity" varchar DEFAULT 'Quantity',
  	"reviews" varchar DEFAULT 'Reviews',
  	"no_reviews" varchar DEFAULT 'No reviews yet.',
  	"related_products" varchar DEFAULT 'You may also like',
  	"veg_label" varchar DEFAULT 'Pure veg',
  	"cart_title" varchar DEFAULT 'Your cart',
  	"cart_empty" varchar DEFAULT 'Your cart is empty',
  	"continue_shopping" varchar DEFAULT 'Continue shopping',
  	"subtotal" varchar DEFAULT 'Subtotal',
  	"you_save" varchar DEFAULT 'You save',
  	"checkout" varchar DEFAULT 'Checkout',
  	"view_cart" varchar DEFAULT 'View cart',
  	"remove" varchar DEFAULT 'Remove',
  	"pincode_label" varchar DEFAULT 'Check delivery',
  	"pincode_placeholder" varchar DEFAULT 'Enter 6-digit pincode',
  	"pincode_check" varchar DEFAULT 'Check',
  	"pincode_invalid" varchar DEFAULT 'Please enter a valid 6-digit pincode.',
  	"pincode_unserviceable" varchar DEFAULT 'Sorry, we don’t deliver to {pincode} yet.',
  	"pincode_restricted" varchar DEFAULT 'This item is made fresh and delivered only in {zones}. Explore our pan-India range!',
  	"pincode_ok" varchar DEFAULT 'Delivers to {pincode} by {date}.',
  	"pincode_cod" varchar DEFAULT 'Cash on Delivery available.',
  	"checkout_title" varchar DEFAULT 'Checkout',
  	"contact_details" varchar DEFAULT 'Contact details',
  	"full_name" varchar DEFAULT 'Full name',
  	"phone_label" varchar DEFAULT 'Mobile number',
  	"email_label" varchar DEFAULT 'Email (for order updates)',
  	"shipping_address" varchar DEFAULT 'Delivery address',
  	"address_line1" varchar DEFAULT 'Flat / house no., building',
  	"address_line2" varchar DEFAULT 'Area, street',
  	"landmark" varchar DEFAULT 'Landmark (optional)',
  	"city" varchar DEFAULT 'City',
  	"state" varchar DEFAULT 'State',
  	"pincode" varchar DEFAULT 'Pincode',
  	"delivery_schedule" varchar DEFAULT 'Delivery date & time',
  	"delivery_date" varchar DEFAULT 'Delivery date',
  	"delivery_slot" varchar DEFAULT 'Time slot',
  	"estimated_delivery" varchar DEFAULT 'Estimated delivery by {date}',
  	"enter_pincode_first" varchar DEFAULT 'Enter your pincode to see delivery options.',
  	"gift_option" varchar DEFAULT 'This is a gift',
  	"gift_message" varchar DEFAULT 'Gift message',
  	"hide_prices" varchar DEFAULT 'Hide prices on the invoice',
  	"order_notes" varchar DEFAULT 'Order notes (optional)',
  	"coupon_label" varchar DEFAULT 'Coupon code',
  	"coupon_apply" varchar DEFAULT 'Apply',
  	"coupon_remove" varchar DEFAULT 'Remove',
  	"payment_method" varchar DEFAULT 'Payment',
  	"pay_online" varchar DEFAULT 'Pay online — UPI, cards, netbanking, wallets',
  	"pay_cod" varchar DEFAULT 'Cash on Delivery',
  	"cod_unavailable" varchar DEFAULT 'Cash on Delivery isn’t available for this order.',
  	"otp_send" varchar DEFAULT 'Send OTP',
  	"otp_resend" varchar DEFAULT 'Resend OTP',
  	"otp_sent" varchar DEFAULT 'OTP sent to {phone}.',
  	"otp_label" varchar DEFAULT 'Enter the 6-digit OTP',
  	"otp_required" varchar DEFAULT 'Verify your mobile number to place a Cash on Delivery order.',
  	"place_order" varchar DEFAULT 'Place order',
  	"pay_now" varchar DEFAULT 'Pay {amount}',
  	"placing_order" varchar DEFAULT 'Placing your order…',
  	"order_summary" varchar DEFAULT 'Order summary',
  	"shipping_fee" varchar DEFAULT 'Delivery',
  	"free" varchar DEFAULT 'Free',
  	"discount" varchar DEFAULT 'Discount',
  	"total" varchar DEFAULT 'Total',
  	"free_shipping_hint" varchar DEFAULT 'Add {amount} more for free delivery.',
  	"min_order_not_met" varchar DEFAULT 'The minimum order value is {amount}.',
  	"items_need_attention" varchar DEFAULT 'Some items in your cart need attention.',
  	"order_confirmed_title" varchar DEFAULT 'Thank you! Your order is confirmed.',
  	"order_pending_title" varchar DEFAULT 'Complete your payment',
  	"order_pending_text" varchar DEFAULT 'Your order is reserved until {time}. Complete the payment to confirm it.',
  	"order_closed_title" varchar DEFAULT 'This order is {status}.',
  	"order_number_label" varchar DEFAULT 'Order {number}',
  	"retry_payment" varchar DEFAULT 'Complete payment',
  	"payment_failed" varchar DEFAULT 'The payment didn’t go through. You can try again.',
  	"search_placeholder" varchar DEFAULT 'Search rosogolla, sandesh, hampers…',
  	"popular_searches" varchar DEFAULT 'Popular searches',
  	"search_results" varchar DEFAULT 'Results for “{query}”',
  	"no_results" varchar DEFAULT 'No products found.',
  	"sort_by" varchar DEFAULT 'Sort by',
  	"all_products" varchar DEFAULT 'All products',
  	"newsletter_success" varchar DEFAULT 'Thank you! You’re on the list.',
  	"newsletter_invalid" varchar DEFAULT 'Please enter a valid email address.',
  	"not_found_title" varchar DEFAULT 'Page not found',
  	"not_found_text" varchar DEFAULT 'This page has melted away like a rosogolla in warm syrup.',
  	"back_home" varchar DEFAULT 'Back to home',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "ui_strings_account" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "ui_strings_account_locales" (
  	"login_title" varchar DEFAULT 'Log in or sign up',
  	"login_subtitle" varchar DEFAULT 'Use your mobile number — we’ll send you a one-time code.',
  	"continue_with_google" varchar DEFAULT 'Continue with Google',
  	"or_divider" varchar DEFAULT 'or',
  	"your_name_optional" varchar DEFAULT 'Your name (for new accounts)',
  	"verify_and_continue" varchar DEFAULT 'Verify & continue',
  	"account_title" varchar DEFAULT 'My account',
  	"account_greeting" varchar DEFAULT 'Hi, {name}!',
  	"my_orders" varchar DEFAULT 'My orders',
  	"no_orders" varchar DEFAULT 'You haven’t placed any orders yet.',
  	"view_order" varchar DEFAULT 'View order',
  	"saved_addresses" varchar DEFAULT 'Saved addresses',
  	"add_address" varchar DEFAULT 'Add a new address',
  	"edit_address" varchar DEFAULT 'Edit',
  	"delete_address" varchar DEFAULT 'Delete',
  	"make_default" varchar DEFAULT 'Make default',
  	"default_label" varchar DEFAULT 'Default',
  	"address_label" varchar DEFAULT 'Label (Home, Office…)',
  	"save_address" varchar DEFAULT 'Save address',
  	"cancel" varchar DEFAULT 'Cancel',
  	"profile" varchar DEFAULT 'Profile',
  	"save_changes" varchar DEFAULT 'Save changes',
  	"saved" varchar DEFAULT 'Saved ✓',
  	"logout" varchar DEFAULT 'Log out',
  	"login_methods" varchar DEFAULT 'Login methods',
  	"link_google" varchar DEFAULT 'Link your Google account',
  	"google_linked" varchar DEFAULT 'Google account linked',
  	"add_phone" varchar DEFAULT 'Add & verify your mobile number',
  	"phone_verified_label" varchar DEFAULT 'Mobile number verified',
  	"login_for_faster_checkout" varchar DEFAULT 'Have an account? Log in for faster checkout',
  	"saved_addresses_pick" varchar DEFAULT 'Deliver to a saved address',
  	"new_address" varchar DEFAULT 'New address',
  	"save_address_to_account" varchar DEFAULT 'Save this address to my account',
  	"track_order_number" varchar DEFAULT 'Order number',
  	"track_phone" varchar DEFAULT 'Mobile number used for the order',
  	"track_not_found" varchar DEFAULT 'We couldn’t find an order with those details. Please check and try again.',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "ui_strings_extra" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "ui_strings_extra_locales" (
  	"qty_offer_title" varchar DEFAULT 'Buy more, save more',
  	"qty_offer_mix" varchar DEFAULT 'Mix & match across selected sweets',
  	"qty_tier_line" varchar DEFAULT 'Buy {qty} or more',
  	"qty_next_hint" varchar DEFAULT 'Add {count} more to get {off}',
  	"qty_applied" varchar DEFAULT '{off} bulk discount applied',
  	"quantity_discount" varchar DEFAULT 'Quantity discount',
  	"bulk_offer_badge" varchar DEFAULT 'Bulk offer',
  	"box_title" varchar DEFAULT 'Build your own box',
  	"box_intro" varchar DEFAULT 'Pick a box size, fill it with your favourite sweets and add a personal note.',
  	"box_start" varchar DEFAULT 'Start building',
  	"box_choose_size" varchar DEFAULT 'Choose a box size',
  	"box_pieces" varchar DEFAULT '{count} pieces',
  	"box_fill" varchar DEFAULT 'Fill your box',
  	"box_filled" varchar DEFAULT '{count} of {total} filled',
  	"box_fill_to_continue" varchar DEFAULT 'Fill all {total} slots to continue',
  	"box_clear" varchar DEFAULT 'Clear',
  	"box_packaging" varchar DEFAULT 'Packaging',
  	"box_message" varchar DEFAULT 'Message card (optional)',
  	"box_add" varchar DEFAULT 'Add box to cart',
  	"box_max_reached" varchar DEFAULT 'Max {max} of this sweet per box',
  	"enquiry_occasion" varchar DEFAULT 'Occasion',
  	"enquiry_company" varchar DEFAULT 'Company (optional)',
  	"enquiry_quantity" varchar DEFAULT 'Approx. number of boxes',
  	"enquiry_budget" varchar DEFAULT 'Budget per box (₹)',
  	"enquiry_date" varchar DEFAULT 'Event / delivery date',
  	"enquiry_message" varchar DEFAULT 'Tell us what you have in mind',
  	"enquiry_submit" varchar DEFAULT 'Send enquiry',
  	"enquiry_success" varchar DEFAULT 'Thank you! Our gifting team will get back to you within 24 hours.',
  	"enquiry_contact_required" varchar DEFAULT 'Please share a phone number or email so we can reach you.',
  	"store_hours" varchar DEFAULT 'Opening hours',
  	"store_directions" varchar DEFAULT 'Get directions',
  	"store_call" varchar DEFAULT 'Call',
  	"blog_title" varchar DEFAULT 'Blog',
  	"blog_intro" varchar DEFAULT 'Stories, recipes and festival notes from our kitchen.',
  	"library_title" varchar DEFAULT 'Sweets Library',
  	"library_intro" varchar DEFAULT 'Get to know Bengali sweets — their story, ingredients and how to enjoy them.',
  	"read_more" varchar DEFAULT 'Read more',
  	"reading_time" varchar DEFAULT '{minutes} min read',
  	"related_reading" varchar DEFAULT 'Shop the story',
  	"no_posts" varchar DEFAULT 'Nothing here yet — check back soon.',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "notifications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"admin_email" varchar,
  	"send_admin_alerts" boolean DEFAULT true,
  	"order_confirmed_enabled" boolean DEFAULT true,
  	"shipped_enabled" boolean DEFAULT true,
  	"out_for_delivery_enabled" boolean DEFAULT true,
  	"delivered_enabled" boolean DEFAULT true,
  	"cancelled_enabled" boolean DEFAULT true,
  	"refunded_enabled" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "notifications_locales" (
  	"order_confirmed_email_subject" varchar DEFAULT 'Your {siteName} order {orderNumber} is confirmed',
  	"order_confirmed_email_body" varchar DEFAULT 'Hi {name},
  
  Thank you for your order! We’ve received order {orderNumber} for {total} and our kitchen is getting it ready.
  
  Expected delivery: {deliveryDate}.
  
  View your order: {orderUrl}',
  	"order_confirmed_sms" varchar DEFAULT '{siteName}: Order {orderNumber} confirmed ({total}). Delivery {deliveryDate}. Details: {orderUrl}',
  	"shipped_email_subject" varchar DEFAULT 'Order {orderNumber} is on its way',
  	"shipped_email_body" varchar DEFAULT 'Hi {name},
  
  Good news — order {orderNumber} has been shipped.
  
  Track it here: {trackingUrl}',
  	"shipped_sms" varchar DEFAULT '{siteName}: Order {orderNumber} has shipped. Track: {trackingUrl}',
  	"out_for_delivery_email_subject" varchar DEFAULT 'Order {orderNumber} is out for delivery',
  	"out_for_delivery_email_body" varchar DEFAULT 'Hi {name},
  
  Your sweets are out for delivery and will reach you soon!',
  	"out_for_delivery_sms" varchar DEFAULT '{siteName}: Order {orderNumber} is out for delivery today.',
  	"delivered_email_subject" varchar DEFAULT 'Order {orderNumber} delivered — enjoy!',
  	"delivered_email_body" varchar DEFAULT 'Hi {name},
  
  Your order {orderNumber} has been delivered. We hope you love it — reply to this email to tell us how it was.',
  	"delivered_sms" varchar DEFAULT '{siteName}: Order {orderNumber} delivered. Enjoy your mishti!',
  	"cancelled_email_subject" varchar DEFAULT 'Order {orderNumber} has been cancelled',
  	"cancelled_email_body" varchar DEFAULT 'Hi {name},
  
  Order {orderNumber} has been cancelled. If you paid online, any amount charged will be refunded to the original payment method.',
  	"cancelled_sms" varchar DEFAULT '{siteName}: Order {orderNumber} was cancelled.',
  	"refunded_email_subject" varchar DEFAULT 'Refund issued for order {orderNumber}',
  	"refunded_email_body" varchar DEFAULT 'Hi {name},
  
  We’ve issued a refund of {total} for order {orderNumber}. It usually reaches your account in 5–7 working days.',
  	"refunded_sms" varchar DEFAULT '{siteName}: Refund of {total} issued for order {orderNumber}.',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders_status_history" ADD CONSTRAINT "orders_status_history_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_delivery_zone_id_delivery_zones_id_fk" FOREIGN KEY ("delivery_zone_id") REFERENCES "public"."delivery_zones"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "customers_auth_providers" ADD CONSTRAINT "customers_auth_providers_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "customers_addresses" ADD CONSTRAINT "customers_addresses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "coupons_locales" ADD CONSTRAINT "coupons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."coupons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quantity_discounts_tiers" ADD CONSTRAINT "quantity_discounts_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."quantity_discounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quantity_discounts_locales" ADD CONSTRAINT "quantity_discounts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."quantity_discounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quantity_discounts_rels" ADD CONSTRAINT "quantity_discounts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."quantity_discounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quantity_discounts_rels" ADD CONSTRAINT "quantity_discounts_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quantity_discounts_rels" ADD CONSTRAINT "quantity_discounts_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "gift_boxes_sizes" ADD CONSTRAINT "gift_boxes_sizes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."gift_boxes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "gift_boxes_sizes_locales" ADD CONSTRAINT "gift_boxes_sizes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."gift_boxes_sizes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "gift_boxes_items" ADD CONSTRAINT "gift_boxes_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gift_boxes_items" ADD CONSTRAINT "gift_boxes_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."gift_boxes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "gift_boxes_items_locales" ADD CONSTRAINT "gift_boxes_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."gift_boxes_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "gift_boxes_packaging" ADD CONSTRAINT "gift_boxes_packaging_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."gift_boxes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "gift_boxes_packaging_locales" ADD CONSTRAINT "gift_boxes_packaging_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."gift_boxes_packaging"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "gift_boxes" ADD CONSTRAINT "gift_boxes_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gift_boxes" ADD CONSTRAINT "gift_boxes_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gift_boxes_locales" ADD CONSTRAINT "gift_boxes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."gift_boxes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "gift_boxes_rels" ADD CONSTRAINT "gift_boxes_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."gift_boxes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "gift_boxes_rels" ADD CONSTRAINT "gift_boxes_rels_delivery_zones_fk" FOREIGN KEY ("delivery_zones_id") REFERENCES "public"."delivery_zones"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_texts" ADD CONSTRAINT "posts_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_texts" ADD CONSTRAINT "_posts_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stores_hours" ADD CONSTRAINT "stores_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stores_hours_locales" ADD CONSTRAINT "stores_hours_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stores_hours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stores_services" ADD CONSTRAINT "stores_services_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stores" ADD CONSTRAINT "stores_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stores_locales" ADD CONSTRAINT "stores_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_slides_ctas" ADD CONSTRAINT "pages_blocks_hero_slides_ctas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_slides_ctas_locales" ADD CONSTRAINT "pages_blocks_hero_slides_ctas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_slides_ctas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_slides" ADD CONSTRAINT "pages_blocks_hero_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_slides" ADD CONSTRAINT "pages_blocks_hero_slides_mobile_image_id_media_id_fk" FOREIGN KEY ("mobile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_slides" ADD CONSTRAINT "pages_blocks_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_slides_locales" ADD CONSTRAINT "pages_blocks_hero_slides_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_style_bg_image_id_media_id_fk" FOREIGN KEY ("style_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_category_grid_tiles" ADD CONSTRAINT "pages_blocks_category_grid_tiles_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_category_grid_tiles" ADD CONSTRAINT "pages_blocks_category_grid_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_category_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_category_grid_tiles_locales" ADD CONSTRAINT "pages_blocks_category_grid_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_category_grid_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_category_grid" ADD CONSTRAINT "pages_blocks_category_grid_style_bg_image_id_media_id_fk" FOREIGN KEY ("style_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_category_grid" ADD CONSTRAINT "pages_blocks_category_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_category_grid_locales" ADD CONSTRAINT "pages_blocks_category_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_category_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_collection" ADD CONSTRAINT "pages_blocks_product_collection_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_collection" ADD CONSTRAINT "pages_blocks_product_collection_style_bg_image_id_media_id_fk" FOREIGN KEY ("style_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_collection" ADD CONSTRAINT "pages_blocks_product_collection_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_collection_locales" ADD CONSTRAINT "pages_blocks_product_collection_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_product_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_marquee_logos" ADD CONSTRAINT "pages_blocks_logo_marquee_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_marquee_logos" ADD CONSTRAINT "pages_blocks_logo_marquee_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_logo_marquee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_marquee" ADD CONSTRAINT "pages_blocks_logo_marquee_style_bg_image_id_media_id_fk" FOREIGN KEY ("style_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_marquee" ADD CONSTRAINT "pages_blocks_logo_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_marquee_locales" ADD CONSTRAINT "pages_blocks_logo_marquee_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_logo_marquee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_tiles_tiles" ADD CONSTRAINT "pages_blocks_feature_tiles_tiles_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_tiles_tiles" ADD CONSTRAINT "pages_blocks_feature_tiles_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_tiles_tiles_locales" ADD CONSTRAINT "pages_blocks_feature_tiles_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_tiles_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_tiles" ADD CONSTRAINT "pages_blocks_feature_tiles_style_bg_image_id_media_id_fk" FOREIGN KEY ("style_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_tiles" ADD CONSTRAINT "pages_blocks_feature_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_tiles_locales" ADD CONSTRAINT "pages_blocks_feature_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_style_bg_image_id_media_id_fk" FOREIGN KEY ("style_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_locales" ADD CONSTRAINT "pages_blocks_testimonials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_items" ADD CONSTRAINT "pages_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_items_locales" ADD CONSTRAINT "pages_blocks_stats_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats" ADD CONSTRAINT "pages_blocks_stats_style_bg_image_id_media_id_fk" FOREIGN KEY ("style_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats" ADD CONSTRAINT "pages_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_locales" ADD CONSTRAINT "pages_blocks_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_with_text" ADD CONSTRAINT "pages_blocks_image_with_text_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_with_text" ADD CONSTRAINT "pages_blocks_image_with_text_style_bg_image_id_media_id_fk" FOREIGN KEY ("style_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_with_text" ADD CONSTRAINT "pages_blocks_image_with_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_with_text_locales" ADD CONSTRAINT "pages_blocks_image_with_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_image_with_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_banner_strip" ADD CONSTRAINT "pages_blocks_banner_strip_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_banner_strip" ADD CONSTRAINT "pages_blocks_banner_strip_style_bg_image_id_media_id_fk" FOREIGN KEY ("style_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_banner_strip" ADD CONSTRAINT "pages_blocks_banner_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_banner_strip_locales" ADD CONSTRAINT "pages_blocks_banner_strip_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_banner_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_style_bg_image_id_media_id_fk" FOREIGN KEY ("style_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text_locales" ADD CONSTRAINT "pages_blocks_rich_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_newsletter" ADD CONSTRAINT "pages_blocks_newsletter_style_bg_image_id_media_id_fk" FOREIGN KEY ("style_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_newsletter" ADD CONSTRAINT "pages_blocks_newsletter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_newsletter_locales" ADD CONSTRAINT "pages_blocks_newsletter_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_newsletter"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_items" ADD CONSTRAINT "pages_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_items_locales" ADD CONSTRAINT "pages_blocks_faq_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_style_bg_image_id_media_id_fk" FOREIGN KEY ("style_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_locales" ADD CONSTRAINT "pages_blocks_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_track_order" ADD CONSTRAINT "pages_blocks_track_order_style_bg_image_id_media_id_fk" FOREIGN KEY ("style_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_track_order" ADD CONSTRAINT "pages_blocks_track_order_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_track_order_locales" ADD CONSTRAINT "pages_blocks_track_order_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_track_order"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_enquiry_form" ADD CONSTRAINT "pages_blocks_enquiry_form_style_bg_image_id_media_id_fk" FOREIGN KEY ("style_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_enquiry_form" ADD CONSTRAINT "pages_blocks_enquiry_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_enquiry_form_locales" ADD CONSTRAINT "pages_blocks_enquiry_form_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_enquiry_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_store_locator" ADD CONSTRAINT "pages_blocks_store_locator_style_bg_image_id_media_id_fk" FOREIGN KEY ("style_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_store_locator" ADD CONSTRAINT "pages_blocks_store_locator_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_store_locator_locales" ADD CONSTRAINT "pages_blocks_store_locator_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_store_locator"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_latest_posts" ADD CONSTRAINT "pages_blocks_latest_posts_style_bg_image_id_media_id_fk" FOREIGN KEY ("style_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_latest_posts" ADD CONSTRAINT "pages_blocks_latest_posts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_latest_posts_locales" ADD CONSTRAINT "pages_blocks_latest_posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_latest_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_spacer" ADD CONSTRAINT "pages_blocks_spacer_style_bg_image_id_media_id_fk" FOREIGN KEY ("style_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_spacer" ADD CONSTRAINT "pages_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_stores_fk" FOREIGN KEY ("stores_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_slides_ctas" ADD CONSTRAINT "_pages_v_blocks_hero_slides_ctas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_slides_ctas_locales" ADD CONSTRAINT "_pages_v_blocks_hero_slides_ctas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero_slides_ctas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_slides" ADD CONSTRAINT "_pages_v_blocks_hero_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_slides" ADD CONSTRAINT "_pages_v_blocks_hero_slides_mobile_image_id_media_id_fk" FOREIGN KEY ("mobile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_slides" ADD CONSTRAINT "_pages_v_blocks_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_slides_locales" ADD CONSTRAINT "_pages_v_blocks_hero_slides_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_style_bg_image_id_media_id_fk" FOREIGN KEY ("style_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_category_grid_tiles" ADD CONSTRAINT "_pages_v_blocks_category_grid_tiles_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_category_grid_tiles" ADD CONSTRAINT "_pages_v_blocks_category_grid_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_category_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_category_grid_tiles_locales" ADD CONSTRAINT "_pages_v_blocks_category_grid_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_category_grid_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_category_grid" ADD CONSTRAINT "_pages_v_blocks_category_grid_style_bg_image_id_media_id_fk" FOREIGN KEY ("style_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_category_grid" ADD CONSTRAINT "_pages_v_blocks_category_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_category_grid_locales" ADD CONSTRAINT "_pages_v_blocks_category_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_category_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_product_collection" ADD CONSTRAINT "_pages_v_blocks_product_collection_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_product_collection" ADD CONSTRAINT "_pages_v_blocks_product_collection_style_bg_image_id_media_id_fk" FOREIGN KEY ("style_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_product_collection" ADD CONSTRAINT "_pages_v_blocks_product_collection_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_product_collection_locales" ADD CONSTRAINT "_pages_v_blocks_product_collection_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_product_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_marquee_logos" ADD CONSTRAINT "_pages_v_blocks_logo_marquee_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_marquee_logos" ADD CONSTRAINT "_pages_v_blocks_logo_marquee_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_logo_marquee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_marquee" ADD CONSTRAINT "_pages_v_blocks_logo_marquee_style_bg_image_id_media_id_fk" FOREIGN KEY ("style_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_marquee" ADD CONSTRAINT "_pages_v_blocks_logo_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_marquee_locales" ADD CONSTRAINT "_pages_v_blocks_logo_marquee_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_logo_marquee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_tiles_tiles" ADD CONSTRAINT "_pages_v_blocks_feature_tiles_tiles_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_tiles_tiles" ADD CONSTRAINT "_pages_v_blocks_feature_tiles_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_tiles_tiles_locales" ADD CONSTRAINT "_pages_v_blocks_feature_tiles_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_tiles_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_tiles" ADD CONSTRAINT "_pages_v_blocks_feature_tiles_style_bg_image_id_media_id_fk" FOREIGN KEY ("style_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_tiles" ADD CONSTRAINT "_pages_v_blocks_feature_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_tiles_locales" ADD CONSTRAINT "_pages_v_blocks_feature_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_style_bg_image_id_media_id_fk" FOREIGN KEY ("style_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_locales" ADD CONSTRAINT "_pages_v_blocks_testimonials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_items" ADD CONSTRAINT "_pages_v_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_items_locales" ADD CONSTRAINT "_pages_v_blocks_stats_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats" ADD CONSTRAINT "_pages_v_blocks_stats_style_bg_image_id_media_id_fk" FOREIGN KEY ("style_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats" ADD CONSTRAINT "_pages_v_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_locales" ADD CONSTRAINT "_pages_v_blocks_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_with_text" ADD CONSTRAINT "_pages_v_blocks_image_with_text_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_with_text" ADD CONSTRAINT "_pages_v_blocks_image_with_text_style_bg_image_id_media_id_fk" FOREIGN KEY ("style_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_with_text" ADD CONSTRAINT "_pages_v_blocks_image_with_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_with_text_locales" ADD CONSTRAINT "_pages_v_blocks_image_with_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_image_with_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_banner_strip" ADD CONSTRAINT "_pages_v_blocks_banner_strip_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_banner_strip" ADD CONSTRAINT "_pages_v_blocks_banner_strip_style_bg_image_id_media_id_fk" FOREIGN KEY ("style_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_banner_strip" ADD CONSTRAINT "_pages_v_blocks_banner_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_banner_strip_locales" ADD CONSTRAINT "_pages_v_blocks_banner_strip_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_banner_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD CONSTRAINT "_pages_v_blocks_rich_text_style_bg_image_id_media_id_fk" FOREIGN KEY ("style_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD CONSTRAINT "_pages_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text_locales" ADD CONSTRAINT "_pages_v_blocks_rich_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_newsletter" ADD CONSTRAINT "_pages_v_blocks_newsletter_style_bg_image_id_media_id_fk" FOREIGN KEY ("style_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_newsletter" ADD CONSTRAINT "_pages_v_blocks_newsletter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_newsletter_locales" ADD CONSTRAINT "_pages_v_blocks_newsletter_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_newsletter"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_items" ADD CONSTRAINT "_pages_v_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_items_locales" ADD CONSTRAINT "_pages_v_blocks_faq_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_style_bg_image_id_media_id_fk" FOREIGN KEY ("style_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_locales" ADD CONSTRAINT "_pages_v_blocks_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_track_order" ADD CONSTRAINT "_pages_v_blocks_track_order_style_bg_image_id_media_id_fk" FOREIGN KEY ("style_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_track_order" ADD CONSTRAINT "_pages_v_blocks_track_order_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_track_order_locales" ADD CONSTRAINT "_pages_v_blocks_track_order_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_track_order"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_enquiry_form" ADD CONSTRAINT "_pages_v_blocks_enquiry_form_style_bg_image_id_media_id_fk" FOREIGN KEY ("style_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_enquiry_form" ADD CONSTRAINT "_pages_v_blocks_enquiry_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_enquiry_form_locales" ADD CONSTRAINT "_pages_v_blocks_enquiry_form_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_enquiry_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_store_locator" ADD CONSTRAINT "_pages_v_blocks_store_locator_style_bg_image_id_media_id_fk" FOREIGN KEY ("style_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_store_locator" ADD CONSTRAINT "_pages_v_blocks_store_locator_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_store_locator_locales" ADD CONSTRAINT "_pages_v_blocks_store_locator_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_store_locator"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_latest_posts" ADD CONSTRAINT "_pages_v_blocks_latest_posts_style_bg_image_id_media_id_fk" FOREIGN KEY ("style_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_latest_posts" ADD CONSTRAINT "_pages_v_blocks_latest_posts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_latest_posts_locales" ADD CONSTRAINT "_pages_v_blocks_latest_posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_latest_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_spacer" ADD CONSTRAINT "_pages_v_blocks_spacer_style_bg_image_id_media_id_fk" FOREIGN KEY ("style_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_spacer" ADD CONSTRAINT "_pages_v_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_stores_fk" FOREIGN KEY ("stores_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_variants" ADD CONSTRAINT "products_variants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_variants_locales" ADD CONSTRAINT "products_variants_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_variants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_badges" ADD CONSTRAINT "products_badges_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_texts" ADD CONSTRAINT "products_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_delivery_zones_fk" FOREIGN KEY ("delivery_zones_id") REFERENCES "public"."delivery_zones"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_variants" ADD CONSTRAINT "_products_v_version_variants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_variants_locales" ADD CONSTRAINT "_products_v_version_variants_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_version_variants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_badges" ADD CONSTRAINT "_products_v_version_badges_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_parent_id_products_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_locales" ADD CONSTRAINT "_products_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_texts" ADD CONSTRAINT "_products_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_delivery_zones_fk" FOREIGN KEY ("delivery_zones_id") REFERENCES "public"."delivery_zones"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_banner_strip" ADD CONSTRAINT "categories_blocks_banner_strip_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_blocks_banner_strip" ADD CONSTRAINT "categories_blocks_banner_strip_style_bg_image_id_media_id_fk" FOREIGN KEY ("style_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_blocks_banner_strip" ADD CONSTRAINT "categories_blocks_banner_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_banner_strip_locales" ADD CONSTRAINT "categories_blocks_banner_strip_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories_blocks_banner_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_image_with_text" ADD CONSTRAINT "categories_blocks_image_with_text_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_blocks_image_with_text" ADD CONSTRAINT "categories_blocks_image_with_text_style_bg_image_id_media_id_fk" FOREIGN KEY ("style_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_blocks_image_with_text" ADD CONSTRAINT "categories_blocks_image_with_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_image_with_text_locales" ADD CONSTRAINT "categories_blocks_image_with_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories_blocks_image_with_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_rich_text" ADD CONSTRAINT "categories_blocks_rich_text_style_bg_image_id_media_id_fk" FOREIGN KEY ("style_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_blocks_rich_text" ADD CONSTRAINT "categories_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_rich_text_locales" ADD CONSTRAINT "categories_blocks_rich_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_feature_tiles_tiles" ADD CONSTRAINT "categories_blocks_feature_tiles_tiles_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_blocks_feature_tiles_tiles" ADD CONSTRAINT "categories_blocks_feature_tiles_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories_blocks_feature_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_feature_tiles_tiles_locales" ADD CONSTRAINT "categories_blocks_feature_tiles_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories_blocks_feature_tiles_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_feature_tiles" ADD CONSTRAINT "categories_blocks_feature_tiles_style_bg_image_id_media_id_fk" FOREIGN KEY ("style_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_blocks_feature_tiles" ADD CONSTRAINT "categories_blocks_feature_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_feature_tiles_locales" ADD CONSTRAINT "categories_blocks_feature_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories_blocks_feature_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_faq_items" ADD CONSTRAINT "categories_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_faq_items_locales" ADD CONSTRAINT "categories_blocks_faq_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories_blocks_faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_faq" ADD CONSTRAINT "categories_blocks_faq_style_bg_image_id_media_id_fk" FOREIGN KEY ("style_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_blocks_faq" ADD CONSTRAINT "categories_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_faq_locales" ADD CONSTRAINT "categories_blocks_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_locales" ADD CONSTRAINT "categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_rels" ADD CONSTRAINT "categories_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_rels" ADD CONSTRAINT "categories_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_rels" ADD CONSTRAINT "categories_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_rels" ADD CONSTRAINT "categories_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reviews" ADD CONSTRAINT "reviews_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reviews_locales" ADD CONSTRAINT "reviews_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "delivery_zones_slots" ADD CONSTRAINT "delivery_zones_slots_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."delivery_zones"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "delivery_zones_blackout_dates" ADD CONSTRAINT "delivery_zones_blackout_dates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."delivery_zones"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_assigned_to_id_users_id_fk" FOREIGN KEY ("assigned_to_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_customers_fk" FOREIGN KEY ("customers_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_coupons_fk" FOREIGN KEY ("coupons_id") REFERENCES "public"."coupons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_quantity_discounts_fk" FOREIGN KEY ("quantity_discounts_id") REFERENCES "public"."quantity_discounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_gift_boxes_fk" FOREIGN KEY ("gift_boxes_id") REFERENCES "public"."gift_boxes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_stores_fk" FOREIGN KEY ("stores_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_delivery_zones_fk" FOREIGN KEY ("delivery_zones_id") REFERENCES "public"."delivery_zones"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_enquiries_fk" FOREIGN KEY ("enquiries_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subscribers_fk" FOREIGN KEY ("subscribers_id") REFERENCES "public"."subscribers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_otp_codes_fk" FOREIGN KEY ("otp_codes_id") REFERENCES "public"."otp_codes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items_columns_items" ADD CONSTRAINT "header_nav_items_columns_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items_columns_items_locales" ADD CONSTRAINT "header_nav_items_columns_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items_columns_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items_columns" ADD CONSTRAINT "header_nav_items_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items_columns_locales" ADD CONSTRAINT "header_nav_items_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items" ADD CONSTRAINT "header_nav_items_promo_image_id_media_id_fk" FOREIGN KEY ("promo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_nav_items" ADD CONSTRAINT "header_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items_locales" ADD CONSTRAINT "header_nav_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header" ADD CONSTRAINT "header_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_locales" ADD CONSTRAINT "header_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_texts" ADD CONSTRAINT "header_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_header_v_version_nav_items_columns_items" ADD CONSTRAINT "_header_v_version_nav_items_columns_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_header_v_version_nav_items_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_header_v_version_nav_items_columns_items_locales" ADD CONSTRAINT "_header_v_version_nav_items_columns_items_locales_parent__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_header_v_version_nav_items_columns_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_header_v_version_nav_items_columns" ADD CONSTRAINT "_header_v_version_nav_items_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_header_v_version_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_header_v_version_nav_items_columns_locales" ADD CONSTRAINT "_header_v_version_nav_items_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_header_v_version_nav_items_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_header_v_version_nav_items" ADD CONSTRAINT "_header_v_version_nav_items_promo_image_id_media_id_fk" FOREIGN KEY ("promo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_header_v_version_nav_items" ADD CONSTRAINT "_header_v_version_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_header_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_header_v_version_nav_items_locales" ADD CONSTRAINT "_header_v_version_nav_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_header_v_version_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_header_v" ADD CONSTRAINT "_header_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_header_v_locales" ADD CONSTRAINT "_header_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_header_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_header_v_texts" ADD CONSTRAINT "_header_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_header_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_header_v_rels" ADD CONSTRAINT "_header_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_header_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_header_v_rels" ADD CONSTRAINT "_header_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_header_v_rels" ADD CONSTRAINT "_header_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_header_v_rels" ADD CONSTRAINT "_header_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "announcement_bar_messages" ADD CONSTRAINT "announcement_bar_messages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."announcement_bar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "announcement_bar_messages_locales" ADD CONSTRAINT "announcement_bar_messages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."announcement_bar_messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "announcement_bar_rels" ADD CONSTRAINT "announcement_bar_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."announcement_bar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "announcement_bar_rels" ADD CONSTRAINT "announcement_bar_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "announcement_bar_rels" ADD CONSTRAINT "announcement_bar_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "announcement_bar_rels" ADD CONSTRAINT "announcement_bar_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_announcement_bar_v_version_messages" ADD CONSTRAINT "_announcement_bar_v_version_messages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_announcement_bar_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_announcement_bar_v_version_messages_locales" ADD CONSTRAINT "_announcement_bar_v_version_messages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_announcement_bar_v_version_messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_announcement_bar_v_rels" ADD CONSTRAINT "_announcement_bar_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_announcement_bar_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_announcement_bar_v_rels" ADD CONSTRAINT "_announcement_bar_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_announcement_bar_v_rels" ADD CONSTRAINT "_announcement_bar_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_announcement_bar_v_rels" ADD CONSTRAINT "_announcement_bar_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_links_locales" ADD CONSTRAINT "footer_columns_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns" ADD CONSTRAINT "footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_locales" ADD CONSTRAINT "footer_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_bottom_links" ADD CONSTRAINT "footer_bottom_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_bottom_links_locales" ADD CONSTRAINT "footer_bottom_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_bottom_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_locales" ADD CONSTRAINT "footer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_version_columns_links" ADD CONSTRAINT "_footer_v_version_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v_version_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_version_columns_links_locales" ADD CONSTRAINT "_footer_v_version_columns_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v_version_columns_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_version_columns" ADD CONSTRAINT "_footer_v_version_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_version_columns_locales" ADD CONSTRAINT "_footer_v_version_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v_version_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_version_bottom_links" ADD CONSTRAINT "_footer_v_version_bottom_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_version_bottom_links_locales" ADD CONSTRAINT "_footer_v_version_bottom_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v_version_bottom_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_locales" ADD CONSTRAINT "_footer_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_rels" ADD CONSTRAINT "_footer_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_rels" ADD CONSTRAINT "_footer_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_rels" ADD CONSTRAINT "_footer_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_rels" ADD CONSTRAINT "_footer_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_socials" ADD CONSTRAINT "site_settings_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_strings_locales" ADD CONSTRAINT "ui_strings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_strings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_strings_account_locales" ADD CONSTRAINT "ui_strings_account_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_strings_account"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_strings_extra_locales" ADD CONSTRAINT "ui_strings_extra_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_strings_extra"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "notifications_locales" ADD CONSTRAINT "notifications_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."notifications"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "orders_items_order_idx" ON "orders_items" USING btree ("_order");
  CREATE INDEX "orders_items_parent_id_idx" ON "orders_items" USING btree ("_parent_id");
  CREATE INDEX "orders_items_product_idx" ON "orders_items" USING btree ("product_id");
  CREATE INDEX "orders_status_history_order_idx" ON "orders_status_history" USING btree ("_order");
  CREATE INDEX "orders_status_history_parent_id_idx" ON "orders_status_history" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "orders_order_number_idx" ON "orders" USING btree ("order_number");
  CREATE INDEX "orders_delivery_zone_idx" ON "orders" USING btree ("delivery_zone_id");
  CREATE INDEX "orders_customer_idx" ON "orders" USING btree ("customer_id");
  CREATE INDEX "orders_updated_at_idx" ON "orders" USING btree ("updated_at");
  CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");
  CREATE INDEX "customers_auth_providers_order_idx" ON "customers_auth_providers" USING btree ("order");
  CREATE INDEX "customers_auth_providers_parent_idx" ON "customers_auth_providers" USING btree ("parent_id");
  CREATE INDEX "customers_addresses_order_idx" ON "customers_addresses" USING btree ("_order");
  CREATE INDEX "customers_addresses_parent_id_idx" ON "customers_addresses" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "customers_phone_idx" ON "customers" USING btree ("phone");
  CREATE UNIQUE INDEX "customers_email_idx" ON "customers" USING btree ("email");
  CREATE UNIQUE INDEX "customers_google_id_idx" ON "customers" USING btree ("google_id");
  CREATE INDEX "customers_updated_at_idx" ON "customers" USING btree ("updated_at");
  CREATE INDEX "customers_created_at_idx" ON "customers" USING btree ("created_at");
  CREATE UNIQUE INDEX "coupons_code_idx" ON "coupons" USING btree ("code");
  CREATE INDEX "coupons_updated_at_idx" ON "coupons" USING btree ("updated_at");
  CREATE INDEX "coupons_created_at_idx" ON "coupons" USING btree ("created_at");
  CREATE UNIQUE INDEX "coupons_locales_locale_parent_id_unique" ON "coupons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "coupons_locales_parent_id_idx" ON "coupons_locales" USING btree ("_parent_id");
  CREATE INDEX "quantity_discounts_tiers_order_idx" ON "quantity_discounts_tiers" USING btree ("_order");
  CREATE INDEX "quantity_discounts_tiers_parent_id_idx" ON "quantity_discounts_tiers" USING btree ("_parent_id");
  CREATE INDEX "quantity_discounts_updated_at_idx" ON "quantity_discounts" USING btree ("updated_at");
  CREATE INDEX "quantity_discounts_created_at_idx" ON "quantity_discounts" USING btree ("created_at");
  CREATE UNIQUE INDEX "quantity_discounts_locales_locale_parent_id_unique" ON "quantity_discounts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "quantity_discounts_locales_parent_id_idx" ON "quantity_discounts_locales" USING btree ("_parent_id");
  CREATE INDEX "quantity_discounts_rels_order_idx" ON "quantity_discounts_rels" USING btree ("order");
  CREATE INDEX "quantity_discounts_rels_parent_idx" ON "quantity_discounts_rels" USING btree ("parent_id");
  CREATE INDEX "quantity_discounts_rels_path_idx" ON "quantity_discounts_rels" USING btree ("path");
  CREATE INDEX "quantity_discounts_rels_products_id_idx" ON "quantity_discounts_rels" USING btree ("products_id");
  CREATE INDEX "quantity_discounts_rels_categories_id_idx" ON "quantity_discounts_rels" USING btree ("categories_id");
  CREATE INDEX "gift_boxes_sizes_order_idx" ON "gift_boxes_sizes" USING btree ("_order");
  CREATE INDEX "gift_boxes_sizes_parent_id_idx" ON "gift_boxes_sizes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "gift_boxes_sizes_locales_locale_parent_id_unique" ON "gift_boxes_sizes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "gift_boxes_sizes_locales_parent_id_idx" ON "gift_boxes_sizes_locales" USING btree ("_parent_id");
  CREATE INDEX "gift_boxes_items_order_idx" ON "gift_boxes_items" USING btree ("_order");
  CREATE INDEX "gift_boxes_items_parent_id_idx" ON "gift_boxes_items" USING btree ("_parent_id");
  CREATE INDEX "gift_boxes_items_image_idx" ON "gift_boxes_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "gift_boxes_items_locales_locale_parent_id_unique" ON "gift_boxes_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "gift_boxes_items_locales_parent_id_idx" ON "gift_boxes_items_locales" USING btree ("_parent_id");
  CREATE INDEX "gift_boxes_packaging_order_idx" ON "gift_boxes_packaging" USING btree ("_order");
  CREATE INDEX "gift_boxes_packaging_parent_id_idx" ON "gift_boxes_packaging" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "gift_boxes_packaging_locales_locale_parent_id_unique" ON "gift_boxes_packaging_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "gift_boxes_packaging_locales_parent_id_idx" ON "gift_boxes_packaging_locales" USING btree ("_parent_id");
  CREATE INDEX "gift_boxes_image_idx" ON "gift_boxes" USING btree ("image_id");
  CREATE INDEX "gift_boxes_meta_meta_image_idx" ON "gift_boxes" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "gift_boxes_slug_idx" ON "gift_boxes" USING btree ("slug");
  CREATE INDEX "gift_boxes_updated_at_idx" ON "gift_boxes" USING btree ("updated_at");
  CREATE INDEX "gift_boxes_created_at_idx" ON "gift_boxes" USING btree ("created_at");
  CREATE UNIQUE INDEX "gift_boxes_locales_locale_parent_id_unique" ON "gift_boxes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "gift_boxes_locales_parent_id_idx" ON "gift_boxes_locales" USING btree ("_parent_id");
  CREATE INDEX "gift_boxes_rels_order_idx" ON "gift_boxes_rels" USING btree ("order");
  CREATE INDEX "gift_boxes_rels_parent_idx" ON "gift_boxes_rels" USING btree ("parent_id");
  CREATE INDEX "gift_boxes_rels_path_idx" ON "gift_boxes_rels" USING btree ("path");
  CREATE INDEX "gift_boxes_rels_delivery_zones_id_idx" ON "gift_boxes_rels" USING btree ("delivery_zones_id");
  CREATE INDEX "posts_cover_idx" ON "posts" USING btree ("cover_id");
  CREATE INDEX "posts_meta_meta_image_idx" ON "posts" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE UNIQUE INDEX "posts_locales_locale_parent_id_unique" ON "posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_locales_parent_id_idx" ON "posts_locales" USING btree ("_parent_id");
  CREATE INDEX "posts_texts_order_parent" ON "posts_texts" USING btree ("order","parent_id");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_products_id_idx" ON "posts_rels" USING btree ("products_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_cover_idx" ON "_posts_v" USING btree ("version_cover_id");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_snapshot_idx" ON "_posts_v" USING btree ("snapshot");
  CREATE INDEX "_posts_v_published_locale_idx" ON "_posts_v" USING btree ("published_locale");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_autosave_idx" ON "_posts_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_posts_v_locales_locale_parent_id_unique" ON "_posts_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_locales_parent_id_idx" ON "_posts_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_texts_order_parent" ON "_posts_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_products_id_idx" ON "_posts_v_rels" USING btree ("products_id");
  CREATE INDEX "stores_hours_order_idx" ON "stores_hours" USING btree ("_order");
  CREATE INDEX "stores_hours_parent_id_idx" ON "stores_hours" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "stores_hours_locales_locale_parent_id_unique" ON "stores_hours_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "stores_hours_locales_parent_id_idx" ON "stores_hours_locales" USING btree ("_parent_id");
  CREATE INDEX "stores_services_order_idx" ON "stores_services" USING btree ("order");
  CREATE INDEX "stores_services_parent_idx" ON "stores_services" USING btree ("parent_id");
  CREATE INDEX "stores_image_idx" ON "stores" USING btree ("image_id");
  CREATE INDEX "stores_updated_at_idx" ON "stores" USING btree ("updated_at");
  CREATE INDEX "stores_created_at_idx" ON "stores" USING btree ("created_at");
  CREATE UNIQUE INDEX "stores_locales_locale_parent_id_unique" ON "stores_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "stores_locales_parent_id_idx" ON "stores_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_slides_ctas_order_idx" ON "pages_blocks_hero_slides_ctas" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_slides_ctas_parent_id_idx" ON "pages_blocks_hero_slides_ctas" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_hero_slides_ctas_locales_locale_parent_id_uniqu" ON "pages_blocks_hero_slides_ctas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_hero_slides_ctas_locales_parent_id_idx" ON "pages_blocks_hero_slides_ctas_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_slides_order_idx" ON "pages_blocks_hero_slides" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_slides_parent_id_idx" ON "pages_blocks_hero_slides" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_slides_image_idx" ON "pages_blocks_hero_slides" USING btree ("image_id");
  CREATE INDEX "pages_blocks_hero_slides_mobile_image_idx" ON "pages_blocks_hero_slides" USING btree ("mobile_image_id");
  CREATE UNIQUE INDEX "pages_blocks_hero_slides_locales_locale_parent_id_unique" ON "pages_blocks_hero_slides_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_hero_slides_locales_parent_id_idx" ON "pages_blocks_hero_slides_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_style_style_bg_image_idx" ON "pages_blocks_hero" USING btree ("style_bg_image_id");
  CREATE INDEX "pages_blocks_category_grid_tiles_order_idx" ON "pages_blocks_category_grid_tiles" USING btree ("_order");
  CREATE INDEX "pages_blocks_category_grid_tiles_parent_id_idx" ON "pages_blocks_category_grid_tiles" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_category_grid_tiles_image_idx" ON "pages_blocks_category_grid_tiles" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_category_grid_tiles_locales_locale_parent_id_un" ON "pages_blocks_category_grid_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_category_grid_tiles_locales_parent_id_idx" ON "pages_blocks_category_grid_tiles_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_category_grid_order_idx" ON "pages_blocks_category_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_category_grid_parent_id_idx" ON "pages_blocks_category_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_category_grid_path_idx" ON "pages_blocks_category_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_category_grid_style_style_bg_image_idx" ON "pages_blocks_category_grid" USING btree ("style_bg_image_id");
  CREATE UNIQUE INDEX "pages_blocks_category_grid_locales_locale_parent_id_unique" ON "pages_blocks_category_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_category_grid_locales_parent_id_idx" ON "pages_blocks_category_grid_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_product_collection_order_idx" ON "pages_blocks_product_collection" USING btree ("_order");
  CREATE INDEX "pages_blocks_product_collection_parent_id_idx" ON "pages_blocks_product_collection" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_product_collection_path_idx" ON "pages_blocks_product_collection" USING btree ("_path");
  CREATE INDEX "pages_blocks_product_collection_category_idx" ON "pages_blocks_product_collection" USING btree ("category_id");
  CREATE INDEX "pages_blocks_product_collection_style_style_bg_image_idx" ON "pages_blocks_product_collection" USING btree ("style_bg_image_id");
  CREATE UNIQUE INDEX "pages_blocks_product_collection_locales_locale_parent_id_uni" ON "pages_blocks_product_collection_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_product_collection_locales_parent_id_idx" ON "pages_blocks_product_collection_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_marquee_logos_order_idx" ON "pages_blocks_logo_marquee_logos" USING btree ("_order");
  CREATE INDEX "pages_blocks_logo_marquee_logos_parent_id_idx" ON "pages_blocks_logo_marquee_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_marquee_logos_image_idx" ON "pages_blocks_logo_marquee_logos" USING btree ("image_id");
  CREATE INDEX "pages_blocks_logo_marquee_order_idx" ON "pages_blocks_logo_marquee" USING btree ("_order");
  CREATE INDEX "pages_blocks_logo_marquee_parent_id_idx" ON "pages_blocks_logo_marquee" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_marquee_path_idx" ON "pages_blocks_logo_marquee" USING btree ("_path");
  CREATE INDEX "pages_blocks_logo_marquee_style_style_bg_image_idx" ON "pages_blocks_logo_marquee" USING btree ("style_bg_image_id");
  CREATE UNIQUE INDEX "pages_blocks_logo_marquee_locales_locale_parent_id_unique" ON "pages_blocks_logo_marquee_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_logo_marquee_locales_parent_id_idx" ON "pages_blocks_logo_marquee_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_tiles_tiles_order_idx" ON "pages_blocks_feature_tiles_tiles" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_tiles_tiles_parent_id_idx" ON "pages_blocks_feature_tiles_tiles" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_tiles_tiles_image_idx" ON "pages_blocks_feature_tiles_tiles" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_feature_tiles_tiles_locales_locale_parent_id_un" ON "pages_blocks_feature_tiles_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_feature_tiles_tiles_locales_parent_id_idx" ON "pages_blocks_feature_tiles_tiles_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_tiles_order_idx" ON "pages_blocks_feature_tiles" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_tiles_parent_id_idx" ON "pages_blocks_feature_tiles" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_tiles_path_idx" ON "pages_blocks_feature_tiles" USING btree ("_path");
  CREATE INDEX "pages_blocks_feature_tiles_style_style_bg_image_idx" ON "pages_blocks_feature_tiles" USING btree ("style_bg_image_id");
  CREATE UNIQUE INDEX "pages_blocks_feature_tiles_locales_locale_parent_id_unique" ON "pages_blocks_feature_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_feature_tiles_locales_parent_id_idx" ON "pages_blocks_feature_tiles_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_order_idx" ON "pages_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_parent_id_idx" ON "pages_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_path_idx" ON "pages_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "pages_blocks_testimonials_style_style_bg_image_idx" ON "pages_blocks_testimonials" USING btree ("style_bg_image_id");
  CREATE UNIQUE INDEX "pages_blocks_testimonials_locales_locale_parent_id_unique" ON "pages_blocks_testimonials_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_testimonials_locales_parent_id_idx" ON "pages_blocks_testimonials_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_items_order_idx" ON "pages_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_items_parent_id_idx" ON "pages_blocks_stats_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_stats_items_locales_locale_parent_id_unique" ON "pages_blocks_stats_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_stats_items_locales_parent_id_idx" ON "pages_blocks_stats_items_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_order_idx" ON "pages_blocks_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_parent_id_idx" ON "pages_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_path_idx" ON "pages_blocks_stats" USING btree ("_path");
  CREATE INDEX "pages_blocks_stats_style_style_bg_image_idx" ON "pages_blocks_stats" USING btree ("style_bg_image_id");
  CREATE UNIQUE INDEX "pages_blocks_stats_locales_locale_parent_id_unique" ON "pages_blocks_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_stats_locales_parent_id_idx" ON "pages_blocks_stats_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_with_text_order_idx" ON "pages_blocks_image_with_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_with_text_parent_id_idx" ON "pages_blocks_image_with_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_with_text_path_idx" ON "pages_blocks_image_with_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_with_text_image_idx" ON "pages_blocks_image_with_text" USING btree ("image_id");
  CREATE INDEX "pages_blocks_image_with_text_style_style_bg_image_idx" ON "pages_blocks_image_with_text" USING btree ("style_bg_image_id");
  CREATE UNIQUE INDEX "pages_blocks_image_with_text_locales_locale_parent_id_unique" ON "pages_blocks_image_with_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_image_with_text_locales_parent_id_idx" ON "pages_blocks_image_with_text_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_banner_strip_order_idx" ON "pages_blocks_banner_strip" USING btree ("_order");
  CREATE INDEX "pages_blocks_banner_strip_parent_id_idx" ON "pages_blocks_banner_strip" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_banner_strip_path_idx" ON "pages_blocks_banner_strip" USING btree ("_path");
  CREATE INDEX "pages_blocks_banner_strip_image_idx" ON "pages_blocks_banner_strip" USING btree ("image_id");
  CREATE INDEX "pages_blocks_banner_strip_style_style_bg_image_idx" ON "pages_blocks_banner_strip" USING btree ("style_bg_image_id");
  CREATE UNIQUE INDEX "pages_blocks_banner_strip_locales_locale_parent_id_unique" ON "pages_blocks_banner_strip_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_banner_strip_locales_parent_id_idx" ON "pages_blocks_banner_strip_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_order_idx" ON "pages_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_parent_id_idx" ON "pages_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_path_idx" ON "pages_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_rich_text_style_style_bg_image_idx" ON "pages_blocks_rich_text" USING btree ("style_bg_image_id");
  CREATE UNIQUE INDEX "pages_blocks_rich_text_locales_locale_parent_id_unique" ON "pages_blocks_rich_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_rich_text_locales_parent_id_idx" ON "pages_blocks_rich_text_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_newsletter_order_idx" ON "pages_blocks_newsletter" USING btree ("_order");
  CREATE INDEX "pages_blocks_newsletter_parent_id_idx" ON "pages_blocks_newsletter" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_newsletter_path_idx" ON "pages_blocks_newsletter" USING btree ("_path");
  CREATE INDEX "pages_blocks_newsletter_style_style_bg_image_idx" ON "pages_blocks_newsletter" USING btree ("style_bg_image_id");
  CREATE UNIQUE INDEX "pages_blocks_newsletter_locales_locale_parent_id_unique" ON "pages_blocks_newsletter_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_newsletter_locales_parent_id_idx" ON "pages_blocks_newsletter_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_items_order_idx" ON "pages_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_items_parent_id_idx" ON "pages_blocks_faq_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_faq_items_locales_locale_parent_id_unique" ON "pages_blocks_faq_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_faq_items_locales_parent_id_idx" ON "pages_blocks_faq_items_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_style_style_bg_image_idx" ON "pages_blocks_faq" USING btree ("style_bg_image_id");
  CREATE UNIQUE INDEX "pages_blocks_faq_locales_locale_parent_id_unique" ON "pages_blocks_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_faq_locales_parent_id_idx" ON "pages_blocks_faq_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_track_order_order_idx" ON "pages_blocks_track_order" USING btree ("_order");
  CREATE INDEX "pages_blocks_track_order_parent_id_idx" ON "pages_blocks_track_order" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_track_order_path_idx" ON "pages_blocks_track_order" USING btree ("_path");
  CREATE INDEX "pages_blocks_track_order_style_style_bg_image_idx" ON "pages_blocks_track_order" USING btree ("style_bg_image_id");
  CREATE UNIQUE INDEX "pages_blocks_track_order_locales_locale_parent_id_unique" ON "pages_blocks_track_order_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_track_order_locales_parent_id_idx" ON "pages_blocks_track_order_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_enquiry_form_order_idx" ON "pages_blocks_enquiry_form" USING btree ("_order");
  CREATE INDEX "pages_blocks_enquiry_form_parent_id_idx" ON "pages_blocks_enquiry_form" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_enquiry_form_path_idx" ON "pages_blocks_enquiry_form" USING btree ("_path");
  CREATE INDEX "pages_blocks_enquiry_form_style_style_bg_image_idx" ON "pages_blocks_enquiry_form" USING btree ("style_bg_image_id");
  CREATE UNIQUE INDEX "pages_blocks_enquiry_form_locales_locale_parent_id_unique" ON "pages_blocks_enquiry_form_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_enquiry_form_locales_parent_id_idx" ON "pages_blocks_enquiry_form_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_store_locator_order_idx" ON "pages_blocks_store_locator" USING btree ("_order");
  CREATE INDEX "pages_blocks_store_locator_parent_id_idx" ON "pages_blocks_store_locator" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_store_locator_path_idx" ON "pages_blocks_store_locator" USING btree ("_path");
  CREATE INDEX "pages_blocks_store_locator_style_style_bg_image_idx" ON "pages_blocks_store_locator" USING btree ("style_bg_image_id");
  CREATE UNIQUE INDEX "pages_blocks_store_locator_locales_locale_parent_id_unique" ON "pages_blocks_store_locator_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_store_locator_locales_parent_id_idx" ON "pages_blocks_store_locator_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_latest_posts_order_idx" ON "pages_blocks_latest_posts" USING btree ("_order");
  CREATE INDEX "pages_blocks_latest_posts_parent_id_idx" ON "pages_blocks_latest_posts" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_latest_posts_path_idx" ON "pages_blocks_latest_posts" USING btree ("_path");
  CREATE INDEX "pages_blocks_latest_posts_style_style_bg_image_idx" ON "pages_blocks_latest_posts" USING btree ("style_bg_image_id");
  CREATE UNIQUE INDEX "pages_blocks_latest_posts_locales_locale_parent_id_unique" ON "pages_blocks_latest_posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_latest_posts_locales_parent_id_idx" ON "pages_blocks_latest_posts_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_spacer_order_idx" ON "pages_blocks_spacer" USING btree ("_order");
  CREATE INDEX "pages_blocks_spacer_parent_id_idx" ON "pages_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_spacer_path_idx" ON "pages_blocks_spacer" USING btree ("_path");
  CREATE INDEX "pages_blocks_spacer_style_style_bg_image_idx" ON "pages_blocks_spacer" USING btree ("style_bg_image_id");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_locales_parent_id_idx" ON "pages_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_pages_id_idx" ON "pages_rels" USING btree ("pages_id");
  CREATE INDEX "pages_rels_products_id_idx" ON "pages_rels" USING btree ("products_id");
  CREATE INDEX "pages_rels_categories_id_idx" ON "pages_rels" USING btree ("categories_id");
  CREATE INDEX "pages_rels_reviews_id_idx" ON "pages_rels" USING btree ("reviews_id");
  CREATE INDEX "pages_rels_stores_id_idx" ON "pages_rels" USING btree ("stores_id");
  CREATE INDEX "_pages_v_blocks_hero_slides_ctas_order_idx" ON "_pages_v_blocks_hero_slides_ctas" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_slides_ctas_parent_id_idx" ON "_pages_v_blocks_hero_slides_ctas" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_hero_slides_ctas_locales_locale_parent_id_un" ON "_pages_v_blocks_hero_slides_ctas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_slides_ctas_locales_parent_id_idx" ON "_pages_v_blocks_hero_slides_ctas_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_slides_order_idx" ON "_pages_v_blocks_hero_slides" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_slides_parent_id_idx" ON "_pages_v_blocks_hero_slides" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_slides_image_idx" ON "_pages_v_blocks_hero_slides" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_hero_slides_mobile_image_idx" ON "_pages_v_blocks_hero_slides" USING btree ("mobile_image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_hero_slides_locales_locale_parent_id_unique" ON "_pages_v_blocks_hero_slides_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_slides_locales_parent_id_idx" ON "_pages_v_blocks_hero_slides_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_order_idx" ON "_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_parent_id_idx" ON "_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_path_idx" ON "_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_style_style_bg_image_idx" ON "_pages_v_blocks_hero" USING btree ("style_bg_image_id");
  CREATE INDEX "_pages_v_blocks_category_grid_tiles_order_idx" ON "_pages_v_blocks_category_grid_tiles" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_category_grid_tiles_parent_id_idx" ON "_pages_v_blocks_category_grid_tiles" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_category_grid_tiles_image_idx" ON "_pages_v_blocks_category_grid_tiles" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_category_grid_tiles_locales_locale_parent_id" ON "_pages_v_blocks_category_grid_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_category_grid_tiles_locales_parent_id_idx" ON "_pages_v_blocks_category_grid_tiles_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_category_grid_order_idx" ON "_pages_v_blocks_category_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_category_grid_parent_id_idx" ON "_pages_v_blocks_category_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_category_grid_path_idx" ON "_pages_v_blocks_category_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_category_grid_style_style_bg_image_idx" ON "_pages_v_blocks_category_grid" USING btree ("style_bg_image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_category_grid_locales_locale_parent_id_uniqu" ON "_pages_v_blocks_category_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_category_grid_locales_parent_id_idx" ON "_pages_v_blocks_category_grid_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_product_collection_order_idx" ON "_pages_v_blocks_product_collection" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_product_collection_parent_id_idx" ON "_pages_v_blocks_product_collection" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_product_collection_path_idx" ON "_pages_v_blocks_product_collection" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_product_collection_category_idx" ON "_pages_v_blocks_product_collection" USING btree ("category_id");
  CREATE INDEX "_pages_v_blocks_product_collection_style_style_bg_image_idx" ON "_pages_v_blocks_product_collection" USING btree ("style_bg_image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_product_collection_locales_locale_parent_id_" ON "_pages_v_blocks_product_collection_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_product_collection_locales_parent_id_idx" ON "_pages_v_blocks_product_collection_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logo_marquee_logos_order_idx" ON "_pages_v_blocks_logo_marquee_logos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_logo_marquee_logos_parent_id_idx" ON "_pages_v_blocks_logo_marquee_logos" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logo_marquee_logos_image_idx" ON "_pages_v_blocks_logo_marquee_logos" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_logo_marquee_order_idx" ON "_pages_v_blocks_logo_marquee" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_logo_marquee_parent_id_idx" ON "_pages_v_blocks_logo_marquee" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logo_marquee_path_idx" ON "_pages_v_blocks_logo_marquee" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_logo_marquee_style_style_bg_image_idx" ON "_pages_v_blocks_logo_marquee" USING btree ("style_bg_image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_logo_marquee_locales_locale_parent_id_unique" ON "_pages_v_blocks_logo_marquee_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_logo_marquee_locales_parent_id_idx" ON "_pages_v_blocks_logo_marquee_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_tiles_tiles_order_idx" ON "_pages_v_blocks_feature_tiles_tiles" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_tiles_tiles_parent_id_idx" ON "_pages_v_blocks_feature_tiles_tiles" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_tiles_tiles_image_idx" ON "_pages_v_blocks_feature_tiles_tiles" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_feature_tiles_tiles_locales_locale_parent_id" ON "_pages_v_blocks_feature_tiles_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_tiles_tiles_locales_parent_id_idx" ON "_pages_v_blocks_feature_tiles_tiles_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_tiles_order_idx" ON "_pages_v_blocks_feature_tiles" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_tiles_parent_id_idx" ON "_pages_v_blocks_feature_tiles" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_tiles_path_idx" ON "_pages_v_blocks_feature_tiles" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_feature_tiles_style_style_bg_image_idx" ON "_pages_v_blocks_feature_tiles" USING btree ("style_bg_image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_feature_tiles_locales_locale_parent_id_uniqu" ON "_pages_v_blocks_feature_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_tiles_locales_parent_id_idx" ON "_pages_v_blocks_feature_tiles_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_order_idx" ON "_pages_v_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_parent_id_idx" ON "_pages_v_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_path_idx" ON "_pages_v_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_testimonials_style_style_bg_image_idx" ON "_pages_v_blocks_testimonials" USING btree ("style_bg_image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_testimonials_locales_locale_parent_id_unique" ON "_pages_v_blocks_testimonials_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_locales_parent_id_idx" ON "_pages_v_blocks_testimonials_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_items_order_idx" ON "_pages_v_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_items_parent_id_idx" ON "_pages_v_blocks_stats_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_stats_items_locales_locale_parent_id_unique" ON "_pages_v_blocks_stats_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_items_locales_parent_id_idx" ON "_pages_v_blocks_stats_items_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_order_idx" ON "_pages_v_blocks_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_parent_id_idx" ON "_pages_v_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_path_idx" ON "_pages_v_blocks_stats" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_stats_style_style_bg_image_idx" ON "_pages_v_blocks_stats" USING btree ("style_bg_image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_stats_locales_locale_parent_id_unique" ON "_pages_v_blocks_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_locales_parent_id_idx" ON "_pages_v_blocks_stats_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_with_text_order_idx" ON "_pages_v_blocks_image_with_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_with_text_parent_id_idx" ON "_pages_v_blocks_image_with_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_with_text_path_idx" ON "_pages_v_blocks_image_with_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_with_text_image_idx" ON "_pages_v_blocks_image_with_text" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_image_with_text_style_style_bg_image_idx" ON "_pages_v_blocks_image_with_text" USING btree ("style_bg_image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_image_with_text_locales_locale_parent_id_uni" ON "_pages_v_blocks_image_with_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_image_with_text_locales_parent_id_idx" ON "_pages_v_blocks_image_with_text_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_banner_strip_order_idx" ON "_pages_v_blocks_banner_strip" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_banner_strip_parent_id_idx" ON "_pages_v_blocks_banner_strip" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_banner_strip_path_idx" ON "_pages_v_blocks_banner_strip" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_banner_strip_image_idx" ON "_pages_v_blocks_banner_strip" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_banner_strip_style_style_bg_image_idx" ON "_pages_v_blocks_banner_strip" USING btree ("style_bg_image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_banner_strip_locales_locale_parent_id_unique" ON "_pages_v_blocks_banner_strip_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_banner_strip_locales_parent_id_idx" ON "_pages_v_blocks_banner_strip_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_order_idx" ON "_pages_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_parent_id_idx" ON "_pages_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_path_idx" ON "_pages_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_rich_text_style_style_bg_image_idx" ON "_pages_v_blocks_rich_text" USING btree ("style_bg_image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_rich_text_locales_locale_parent_id_unique" ON "_pages_v_blocks_rich_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_locales_parent_id_idx" ON "_pages_v_blocks_rich_text_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_newsletter_order_idx" ON "_pages_v_blocks_newsletter" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_newsletter_parent_id_idx" ON "_pages_v_blocks_newsletter" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_newsletter_path_idx" ON "_pages_v_blocks_newsletter" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_newsletter_style_style_bg_image_idx" ON "_pages_v_blocks_newsletter" USING btree ("style_bg_image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_newsletter_locales_locale_parent_id_unique" ON "_pages_v_blocks_newsletter_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_newsletter_locales_parent_id_idx" ON "_pages_v_blocks_newsletter_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_items_order_idx" ON "_pages_v_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_items_parent_id_idx" ON "_pages_v_blocks_faq_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_faq_items_locales_locale_parent_id_unique" ON "_pages_v_blocks_faq_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_items_locales_parent_id_idx" ON "_pages_v_blocks_faq_items_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_order_idx" ON "_pages_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_parent_id_idx" ON "_pages_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_path_idx" ON "_pages_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faq_style_style_bg_image_idx" ON "_pages_v_blocks_faq" USING btree ("style_bg_image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_faq_locales_locale_parent_id_unique" ON "_pages_v_blocks_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_locales_parent_id_idx" ON "_pages_v_blocks_faq_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_track_order_order_idx" ON "_pages_v_blocks_track_order" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_track_order_parent_id_idx" ON "_pages_v_blocks_track_order" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_track_order_path_idx" ON "_pages_v_blocks_track_order" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_track_order_style_style_bg_image_idx" ON "_pages_v_blocks_track_order" USING btree ("style_bg_image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_track_order_locales_locale_parent_id_unique" ON "_pages_v_blocks_track_order_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_track_order_locales_parent_id_idx" ON "_pages_v_blocks_track_order_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_enquiry_form_order_idx" ON "_pages_v_blocks_enquiry_form" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_enquiry_form_parent_id_idx" ON "_pages_v_blocks_enquiry_form" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_enquiry_form_path_idx" ON "_pages_v_blocks_enquiry_form" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_enquiry_form_style_style_bg_image_idx" ON "_pages_v_blocks_enquiry_form" USING btree ("style_bg_image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_enquiry_form_locales_locale_parent_id_unique" ON "_pages_v_blocks_enquiry_form_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_enquiry_form_locales_parent_id_idx" ON "_pages_v_blocks_enquiry_form_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_store_locator_order_idx" ON "_pages_v_blocks_store_locator" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_store_locator_parent_id_idx" ON "_pages_v_blocks_store_locator" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_store_locator_path_idx" ON "_pages_v_blocks_store_locator" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_store_locator_style_style_bg_image_idx" ON "_pages_v_blocks_store_locator" USING btree ("style_bg_image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_store_locator_locales_locale_parent_id_uniqu" ON "_pages_v_blocks_store_locator_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_store_locator_locales_parent_id_idx" ON "_pages_v_blocks_store_locator_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_latest_posts_order_idx" ON "_pages_v_blocks_latest_posts" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_latest_posts_parent_id_idx" ON "_pages_v_blocks_latest_posts" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_latest_posts_path_idx" ON "_pages_v_blocks_latest_posts" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_latest_posts_style_style_bg_image_idx" ON "_pages_v_blocks_latest_posts" USING btree ("style_bg_image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_latest_posts_locales_locale_parent_id_unique" ON "_pages_v_blocks_latest_posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_latest_posts_locales_parent_id_idx" ON "_pages_v_blocks_latest_posts_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_spacer_order_idx" ON "_pages_v_blocks_spacer" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_spacer_parent_id_idx" ON "_pages_v_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_spacer_path_idx" ON "_pages_v_blocks_spacer" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_spacer_style_style_bg_image_idx" ON "_pages_v_blocks_spacer" USING btree ("style_bg_image_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_locales_parent_id_idx" ON "_pages_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_pages_id_idx" ON "_pages_v_rels" USING btree ("pages_id");
  CREATE INDEX "_pages_v_rels_products_id_idx" ON "_pages_v_rels" USING btree ("products_id");
  CREATE INDEX "_pages_v_rels_categories_id_idx" ON "_pages_v_rels" USING btree ("categories_id");
  CREATE INDEX "_pages_v_rels_reviews_id_idx" ON "_pages_v_rels" USING btree ("reviews_id");
  CREATE INDEX "_pages_v_rels_stores_id_idx" ON "_pages_v_rels" USING btree ("stores_id");
  CREATE INDEX "products_variants_order_idx" ON "products_variants" USING btree ("_order");
  CREATE INDEX "products_variants_parent_id_idx" ON "products_variants" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_variants_locales_locale_parent_id_unique" ON "products_variants_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_variants_locales_parent_id_idx" ON "products_variants_locales" USING btree ("_parent_id");
  CREATE INDEX "products_badges_order_idx" ON "products_badges" USING btree ("order");
  CREATE INDEX "products_badges_parent_idx" ON "products_badges" USING btree ("parent_id");
  CREATE INDEX "products_meta_meta_image_idx" ON "products" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "products__status_idx" ON "products" USING btree ("_status");
  CREATE UNIQUE INDEX "products_locales_locale_parent_id_unique" ON "products_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_locales_parent_id_idx" ON "products_locales" USING btree ("_parent_id");
  CREATE INDEX "products_texts_order_parent" ON "products_texts" USING btree ("order","parent_id");
  CREATE INDEX "products_rels_order_idx" ON "products_rels" USING btree ("order");
  CREATE INDEX "products_rels_parent_idx" ON "products_rels" USING btree ("parent_id");
  CREATE INDEX "products_rels_path_idx" ON "products_rels" USING btree ("path");
  CREATE INDEX "products_rels_media_id_idx" ON "products_rels" USING btree ("media_id");
  CREATE INDEX "products_rels_products_id_idx" ON "products_rels" USING btree ("products_id");
  CREATE INDEX "products_rels_categories_id_idx" ON "products_rels" USING btree ("categories_id");
  CREATE INDEX "products_rels_delivery_zones_id_idx" ON "products_rels" USING btree ("delivery_zones_id");
  CREATE INDEX "_products_v_version_variants_order_idx" ON "_products_v_version_variants" USING btree ("_order");
  CREATE INDEX "_products_v_version_variants_parent_id_idx" ON "_products_v_version_variants" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_products_v_version_variants_locales_locale_parent_id_unique" ON "_products_v_version_variants_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_version_variants_locales_parent_id_idx" ON "_products_v_version_variants_locales" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_badges_order_idx" ON "_products_v_version_badges" USING btree ("order");
  CREATE INDEX "_products_v_version_badges_parent_idx" ON "_products_v_version_badges" USING btree ("parent_id");
  CREATE INDEX "_products_v_parent_idx" ON "_products_v" USING btree ("parent_id");
  CREATE INDEX "_products_v_version_meta_version_meta_image_idx" ON "_products_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_products_v_version_version_slug_idx" ON "_products_v" USING btree ("version_slug");
  CREATE INDEX "_products_v_version_version_updated_at_idx" ON "_products_v" USING btree ("version_updated_at");
  CREATE INDEX "_products_v_version_version_created_at_idx" ON "_products_v" USING btree ("version_created_at");
  CREATE INDEX "_products_v_version_version__status_idx" ON "_products_v" USING btree ("version__status");
  CREATE INDEX "_products_v_created_at_idx" ON "_products_v" USING btree ("created_at");
  CREATE INDEX "_products_v_updated_at_idx" ON "_products_v" USING btree ("updated_at");
  CREATE INDEX "_products_v_snapshot_idx" ON "_products_v" USING btree ("snapshot");
  CREATE INDEX "_products_v_published_locale_idx" ON "_products_v" USING btree ("published_locale");
  CREATE INDEX "_products_v_latest_idx" ON "_products_v" USING btree ("latest");
  CREATE INDEX "_products_v_autosave_idx" ON "_products_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_products_v_locales_locale_parent_id_unique" ON "_products_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_locales_parent_id_idx" ON "_products_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_products_v_texts_order_parent" ON "_products_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_products_v_rels_order_idx" ON "_products_v_rels" USING btree ("order");
  CREATE INDEX "_products_v_rels_parent_idx" ON "_products_v_rels" USING btree ("parent_id");
  CREATE INDEX "_products_v_rels_path_idx" ON "_products_v_rels" USING btree ("path");
  CREATE INDEX "_products_v_rels_media_id_idx" ON "_products_v_rels" USING btree ("media_id");
  CREATE INDEX "_products_v_rels_products_id_idx" ON "_products_v_rels" USING btree ("products_id");
  CREATE INDEX "_products_v_rels_categories_id_idx" ON "_products_v_rels" USING btree ("categories_id");
  CREATE INDEX "_products_v_rels_delivery_zones_id_idx" ON "_products_v_rels" USING btree ("delivery_zones_id");
  CREATE INDEX "categories_blocks_banner_strip_order_idx" ON "categories_blocks_banner_strip" USING btree ("_order");
  CREATE INDEX "categories_blocks_banner_strip_parent_id_idx" ON "categories_blocks_banner_strip" USING btree ("_parent_id");
  CREATE INDEX "categories_blocks_banner_strip_path_idx" ON "categories_blocks_banner_strip" USING btree ("_path");
  CREATE INDEX "categories_blocks_banner_strip_image_idx" ON "categories_blocks_banner_strip" USING btree ("image_id");
  CREATE INDEX "categories_blocks_banner_strip_style_style_bg_image_idx" ON "categories_blocks_banner_strip" USING btree ("style_bg_image_id");
  CREATE UNIQUE INDEX "categories_blocks_banner_strip_locales_locale_parent_id_uniq" ON "categories_blocks_banner_strip_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categories_blocks_banner_strip_locales_parent_id_idx" ON "categories_blocks_banner_strip_locales" USING btree ("_parent_id");
  CREATE INDEX "categories_blocks_image_with_text_order_idx" ON "categories_blocks_image_with_text" USING btree ("_order");
  CREATE INDEX "categories_blocks_image_with_text_parent_id_idx" ON "categories_blocks_image_with_text" USING btree ("_parent_id");
  CREATE INDEX "categories_blocks_image_with_text_path_idx" ON "categories_blocks_image_with_text" USING btree ("_path");
  CREATE INDEX "categories_blocks_image_with_text_image_idx" ON "categories_blocks_image_with_text" USING btree ("image_id");
  CREATE INDEX "categories_blocks_image_with_text_style_style_bg_image_idx" ON "categories_blocks_image_with_text" USING btree ("style_bg_image_id");
  CREATE UNIQUE INDEX "categories_blocks_image_with_text_locales_locale_parent_id_u" ON "categories_blocks_image_with_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categories_blocks_image_with_text_locales_parent_id_idx" ON "categories_blocks_image_with_text_locales" USING btree ("_parent_id");
  CREATE INDEX "categories_blocks_rich_text_order_idx" ON "categories_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "categories_blocks_rich_text_parent_id_idx" ON "categories_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "categories_blocks_rich_text_path_idx" ON "categories_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "categories_blocks_rich_text_style_style_bg_image_idx" ON "categories_blocks_rich_text" USING btree ("style_bg_image_id");
  CREATE UNIQUE INDEX "categories_blocks_rich_text_locales_locale_parent_id_unique" ON "categories_blocks_rich_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categories_blocks_rich_text_locales_parent_id_idx" ON "categories_blocks_rich_text_locales" USING btree ("_parent_id");
  CREATE INDEX "categories_blocks_feature_tiles_tiles_order_idx" ON "categories_blocks_feature_tiles_tiles" USING btree ("_order");
  CREATE INDEX "categories_blocks_feature_tiles_tiles_parent_id_idx" ON "categories_blocks_feature_tiles_tiles" USING btree ("_parent_id");
  CREATE INDEX "categories_blocks_feature_tiles_tiles_image_idx" ON "categories_blocks_feature_tiles_tiles" USING btree ("image_id");
  CREATE UNIQUE INDEX "categories_blocks_feature_tiles_tiles_locales_locale_parent_" ON "categories_blocks_feature_tiles_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categories_blocks_feature_tiles_tiles_locales_parent_id_idx" ON "categories_blocks_feature_tiles_tiles_locales" USING btree ("_parent_id");
  CREATE INDEX "categories_blocks_feature_tiles_order_idx" ON "categories_blocks_feature_tiles" USING btree ("_order");
  CREATE INDEX "categories_blocks_feature_tiles_parent_id_idx" ON "categories_blocks_feature_tiles" USING btree ("_parent_id");
  CREATE INDEX "categories_blocks_feature_tiles_path_idx" ON "categories_blocks_feature_tiles" USING btree ("_path");
  CREATE INDEX "categories_blocks_feature_tiles_style_style_bg_image_idx" ON "categories_blocks_feature_tiles" USING btree ("style_bg_image_id");
  CREATE UNIQUE INDEX "categories_blocks_feature_tiles_locales_locale_parent_id_uni" ON "categories_blocks_feature_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categories_blocks_feature_tiles_locales_parent_id_idx" ON "categories_blocks_feature_tiles_locales" USING btree ("_parent_id");
  CREATE INDEX "categories_blocks_faq_items_order_idx" ON "categories_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "categories_blocks_faq_items_parent_id_idx" ON "categories_blocks_faq_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "categories_blocks_faq_items_locales_locale_parent_id_unique" ON "categories_blocks_faq_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categories_blocks_faq_items_locales_parent_id_idx" ON "categories_blocks_faq_items_locales" USING btree ("_parent_id");
  CREATE INDEX "categories_blocks_faq_order_idx" ON "categories_blocks_faq" USING btree ("_order");
  CREATE INDEX "categories_blocks_faq_parent_id_idx" ON "categories_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "categories_blocks_faq_path_idx" ON "categories_blocks_faq" USING btree ("_path");
  CREATE INDEX "categories_blocks_faq_style_style_bg_image_idx" ON "categories_blocks_faq" USING btree ("style_bg_image_id");
  CREATE UNIQUE INDEX "categories_blocks_faq_locales_locale_parent_id_unique" ON "categories_blocks_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categories_blocks_faq_locales_parent_id_idx" ON "categories_blocks_faq_locales" USING btree ("_parent_id");
  CREATE INDEX "categories_icon_idx" ON "categories" USING btree ("icon_id");
  CREATE INDEX "categories_image_idx" ON "categories" USING btree ("image_id");
  CREATE INDEX "categories_meta_meta_image_idx" ON "categories" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_parent_idx" ON "categories" USING btree ("parent_id");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "categories_locales_locale_parent_id_unique" ON "categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categories_locales_parent_id_idx" ON "categories_locales" USING btree ("_parent_id");
  CREATE INDEX "categories_rels_order_idx" ON "categories_rels" USING btree ("order");
  CREATE INDEX "categories_rels_parent_idx" ON "categories_rels" USING btree ("parent_id");
  CREATE INDEX "categories_rels_path_idx" ON "categories_rels" USING btree ("path");
  CREATE INDEX "categories_rels_pages_id_idx" ON "categories_rels" USING btree ("pages_id");
  CREATE INDEX "categories_rels_products_id_idx" ON "categories_rels" USING btree ("products_id");
  CREATE INDEX "categories_rels_categories_id_idx" ON "categories_rels" USING btree ("categories_id");
  CREATE INDEX "reviews_product_idx" ON "reviews" USING btree ("product_id");
  CREATE INDEX "reviews_image_idx" ON "reviews" USING btree ("image_id");
  CREATE INDEX "reviews_updated_at_idx" ON "reviews" USING btree ("updated_at");
  CREATE INDEX "reviews_created_at_idx" ON "reviews" USING btree ("created_at");
  CREATE UNIQUE INDEX "reviews_locales_locale_parent_id_unique" ON "reviews_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "reviews_locales_parent_id_idx" ON "reviews_locales" USING btree ("_parent_id");
  CREATE INDEX "delivery_zones_slots_order_idx" ON "delivery_zones_slots" USING btree ("_order");
  CREATE INDEX "delivery_zones_slots_parent_id_idx" ON "delivery_zones_slots" USING btree ("_parent_id");
  CREATE INDEX "delivery_zones_blackout_dates_order_idx" ON "delivery_zones_blackout_dates" USING btree ("_order");
  CREATE INDEX "delivery_zones_blackout_dates_parent_id_idx" ON "delivery_zones_blackout_dates" USING btree ("_parent_id");
  CREATE INDEX "delivery_zones_updated_at_idx" ON "delivery_zones" USING btree ("updated_at");
  CREATE INDEX "delivery_zones_created_at_idx" ON "delivery_zones" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "enquiries_assigned_to_idx" ON "enquiries" USING btree ("assigned_to_id");
  CREATE INDEX "enquiries_updated_at_idx" ON "enquiries" USING btree ("updated_at");
  CREATE INDEX "enquiries_created_at_idx" ON "enquiries" USING btree ("created_at");
  CREATE UNIQUE INDEX "subscribers_email_idx" ON "subscribers" USING btree ("email");
  CREATE INDEX "subscribers_updated_at_idx" ON "subscribers" USING btree ("updated_at");
  CREATE INDEX "subscribers_created_at_idx" ON "subscribers" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "otp_codes_phone_idx" ON "otp_codes" USING btree ("phone");
  CREATE INDEX "otp_codes_updated_at_idx" ON "otp_codes" USING btree ("updated_at");
  CREATE INDEX "otp_codes_created_at_idx" ON "otp_codes" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("orders_id");
  CREATE INDEX "payload_locked_documents_rels_customers_id_idx" ON "payload_locked_documents_rels" USING btree ("customers_id");
  CREATE INDEX "payload_locked_documents_rels_coupons_id_idx" ON "payload_locked_documents_rels" USING btree ("coupons_id");
  CREATE INDEX "payload_locked_documents_rels_quantity_discounts_id_idx" ON "payload_locked_documents_rels" USING btree ("quantity_discounts_id");
  CREATE INDEX "payload_locked_documents_rels_gift_boxes_id_idx" ON "payload_locked_documents_rels" USING btree ("gift_boxes_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_stores_id_idx" ON "payload_locked_documents_rels" USING btree ("stores_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_reviews_id_idx" ON "payload_locked_documents_rels" USING btree ("reviews_id");
  CREATE INDEX "payload_locked_documents_rels_delivery_zones_id_idx" ON "payload_locked_documents_rels" USING btree ("delivery_zones_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_enquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("enquiries_id");
  CREATE INDEX "payload_locked_documents_rels_subscribers_id_idx" ON "payload_locked_documents_rels" USING btree ("subscribers_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_otp_codes_id_idx" ON "payload_locked_documents_rels" USING btree ("otp_codes_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "theme__status_idx" ON "theme" USING btree ("_status");
  CREATE INDEX "_theme_v_version_version__status_idx" ON "_theme_v" USING btree ("version__status");
  CREATE INDEX "_theme_v_created_at_idx" ON "_theme_v" USING btree ("created_at");
  CREATE INDEX "_theme_v_updated_at_idx" ON "_theme_v" USING btree ("updated_at");
  CREATE INDEX "_theme_v_snapshot_idx" ON "_theme_v" USING btree ("snapshot");
  CREATE INDEX "_theme_v_published_locale_idx" ON "_theme_v" USING btree ("published_locale");
  CREATE INDEX "_theme_v_latest_idx" ON "_theme_v" USING btree ("latest");
  CREATE INDEX "_theme_v_autosave_idx" ON "_theme_v" USING btree ("autosave");
  CREATE INDEX "header_nav_items_columns_items_order_idx" ON "header_nav_items_columns_items" USING btree ("_order");
  CREATE INDEX "header_nav_items_columns_items_parent_id_idx" ON "header_nav_items_columns_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "header_nav_items_columns_items_locales_locale_parent_id_uniq" ON "header_nav_items_columns_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "header_nav_items_columns_items_locales_parent_id_idx" ON "header_nav_items_columns_items_locales" USING btree ("_parent_id");
  CREATE INDEX "header_nav_items_columns_order_idx" ON "header_nav_items_columns" USING btree ("_order");
  CREATE INDEX "header_nav_items_columns_parent_id_idx" ON "header_nav_items_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "header_nav_items_columns_locales_locale_parent_id_unique" ON "header_nav_items_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "header_nav_items_columns_locales_parent_id_idx" ON "header_nav_items_columns_locales" USING btree ("_parent_id");
  CREATE INDEX "header_nav_items_order_idx" ON "header_nav_items" USING btree ("_order");
  CREATE INDEX "header_nav_items_parent_id_idx" ON "header_nav_items" USING btree ("_parent_id");
  CREATE INDEX "header_nav_items_promo_promo_image_idx" ON "header_nav_items" USING btree ("promo_image_id");
  CREATE UNIQUE INDEX "header_nav_items_locales_locale_parent_id_unique" ON "header_nav_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "header_nav_items_locales_parent_id_idx" ON "header_nav_items_locales" USING btree ("_parent_id");
  CREATE INDEX "header_logo_idx" ON "header" USING btree ("logo_id");
  CREATE INDEX "header__status_idx" ON "header" USING btree ("_status");
  CREATE UNIQUE INDEX "header_locales_locale_parent_id_unique" ON "header_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "header_locales_parent_id_idx" ON "header_locales" USING btree ("_parent_id");
  CREATE INDEX "header_texts_order_parent" ON "header_texts" USING btree ("order","parent_id");
  CREATE INDEX "header_texts_locale_parent" ON "header_texts" USING btree ("locale","parent_id");
  CREATE INDEX "header_rels_order_idx" ON "header_rels" USING btree ("order");
  CREATE INDEX "header_rels_parent_idx" ON "header_rels" USING btree ("parent_id");
  CREATE INDEX "header_rels_path_idx" ON "header_rels" USING btree ("path");
  CREATE INDEX "header_rels_pages_id_idx" ON "header_rels" USING btree ("pages_id");
  CREATE INDEX "header_rels_products_id_idx" ON "header_rels" USING btree ("products_id");
  CREATE INDEX "header_rels_categories_id_idx" ON "header_rels" USING btree ("categories_id");
  CREATE INDEX "_header_v_version_nav_items_columns_items_order_idx" ON "_header_v_version_nav_items_columns_items" USING btree ("_order");
  CREATE INDEX "_header_v_version_nav_items_columns_items_parent_id_idx" ON "_header_v_version_nav_items_columns_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_header_v_version_nav_items_columns_items_locales_locale_par" ON "_header_v_version_nav_items_columns_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_header_v_version_nav_items_columns_items_locales_parent_idx" ON "_header_v_version_nav_items_columns_items_locales" USING btree ("_parent_id");
  CREATE INDEX "_header_v_version_nav_items_columns_order_idx" ON "_header_v_version_nav_items_columns" USING btree ("_order");
  CREATE INDEX "_header_v_version_nav_items_columns_parent_id_idx" ON "_header_v_version_nav_items_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_header_v_version_nav_items_columns_locales_locale_parent_id" ON "_header_v_version_nav_items_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_header_v_version_nav_items_columns_locales_parent_id_idx" ON "_header_v_version_nav_items_columns_locales" USING btree ("_parent_id");
  CREATE INDEX "_header_v_version_nav_items_order_idx" ON "_header_v_version_nav_items" USING btree ("_order");
  CREATE INDEX "_header_v_version_nav_items_parent_id_idx" ON "_header_v_version_nav_items" USING btree ("_parent_id");
  CREATE INDEX "_header_v_version_nav_items_promo_promo_image_idx" ON "_header_v_version_nav_items" USING btree ("promo_image_id");
  CREATE UNIQUE INDEX "_header_v_version_nav_items_locales_locale_parent_id_unique" ON "_header_v_version_nav_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_header_v_version_nav_items_locales_parent_id_idx" ON "_header_v_version_nav_items_locales" USING btree ("_parent_id");
  CREATE INDEX "_header_v_version_version_logo_idx" ON "_header_v" USING btree ("version_logo_id");
  CREATE INDEX "_header_v_version_version__status_idx" ON "_header_v" USING btree ("version__status");
  CREATE INDEX "_header_v_created_at_idx" ON "_header_v" USING btree ("created_at");
  CREATE INDEX "_header_v_updated_at_idx" ON "_header_v" USING btree ("updated_at");
  CREATE INDEX "_header_v_snapshot_idx" ON "_header_v" USING btree ("snapshot");
  CREATE INDEX "_header_v_published_locale_idx" ON "_header_v" USING btree ("published_locale");
  CREATE INDEX "_header_v_latest_idx" ON "_header_v" USING btree ("latest");
  CREATE INDEX "_header_v_autosave_idx" ON "_header_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_header_v_locales_locale_parent_id_unique" ON "_header_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_header_v_locales_parent_id_idx" ON "_header_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_header_v_texts_order_parent" ON "_header_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_header_v_texts_locale_parent" ON "_header_v_texts" USING btree ("locale","parent_id");
  CREATE INDEX "_header_v_rels_order_idx" ON "_header_v_rels" USING btree ("order");
  CREATE INDEX "_header_v_rels_parent_idx" ON "_header_v_rels" USING btree ("parent_id");
  CREATE INDEX "_header_v_rels_path_idx" ON "_header_v_rels" USING btree ("path");
  CREATE INDEX "_header_v_rels_pages_id_idx" ON "_header_v_rels" USING btree ("pages_id");
  CREATE INDEX "_header_v_rels_products_id_idx" ON "_header_v_rels" USING btree ("products_id");
  CREATE INDEX "_header_v_rels_categories_id_idx" ON "_header_v_rels" USING btree ("categories_id");
  CREATE INDEX "announcement_bar_messages_order_idx" ON "announcement_bar_messages" USING btree ("_order");
  CREATE INDEX "announcement_bar_messages_parent_id_idx" ON "announcement_bar_messages" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "announcement_bar_messages_locales_locale_parent_id_unique" ON "announcement_bar_messages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "announcement_bar_messages_locales_parent_id_idx" ON "announcement_bar_messages_locales" USING btree ("_parent_id");
  CREATE INDEX "announcement_bar__status_idx" ON "announcement_bar" USING btree ("_status");
  CREATE INDEX "announcement_bar_rels_order_idx" ON "announcement_bar_rels" USING btree ("order");
  CREATE INDEX "announcement_bar_rels_parent_idx" ON "announcement_bar_rels" USING btree ("parent_id");
  CREATE INDEX "announcement_bar_rels_path_idx" ON "announcement_bar_rels" USING btree ("path");
  CREATE INDEX "announcement_bar_rels_pages_id_idx" ON "announcement_bar_rels" USING btree ("pages_id");
  CREATE INDEX "announcement_bar_rels_products_id_idx" ON "announcement_bar_rels" USING btree ("products_id");
  CREATE INDEX "announcement_bar_rels_categories_id_idx" ON "announcement_bar_rels" USING btree ("categories_id");
  CREATE INDEX "_announcement_bar_v_version_messages_order_idx" ON "_announcement_bar_v_version_messages" USING btree ("_order");
  CREATE INDEX "_announcement_bar_v_version_messages_parent_id_idx" ON "_announcement_bar_v_version_messages" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_announcement_bar_v_version_messages_locales_locale_parent_i" ON "_announcement_bar_v_version_messages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_announcement_bar_v_version_messages_locales_parent_id_idx" ON "_announcement_bar_v_version_messages_locales" USING btree ("_parent_id");
  CREATE INDEX "_announcement_bar_v_version_version__status_idx" ON "_announcement_bar_v" USING btree ("version__status");
  CREATE INDEX "_announcement_bar_v_created_at_idx" ON "_announcement_bar_v" USING btree ("created_at");
  CREATE INDEX "_announcement_bar_v_updated_at_idx" ON "_announcement_bar_v" USING btree ("updated_at");
  CREATE INDEX "_announcement_bar_v_snapshot_idx" ON "_announcement_bar_v" USING btree ("snapshot");
  CREATE INDEX "_announcement_bar_v_published_locale_idx" ON "_announcement_bar_v" USING btree ("published_locale");
  CREATE INDEX "_announcement_bar_v_latest_idx" ON "_announcement_bar_v" USING btree ("latest");
  CREATE INDEX "_announcement_bar_v_autosave_idx" ON "_announcement_bar_v" USING btree ("autosave");
  CREATE INDEX "_announcement_bar_v_rels_order_idx" ON "_announcement_bar_v_rels" USING btree ("order");
  CREATE INDEX "_announcement_bar_v_rels_parent_idx" ON "_announcement_bar_v_rels" USING btree ("parent_id");
  CREATE INDEX "_announcement_bar_v_rels_path_idx" ON "_announcement_bar_v_rels" USING btree ("path");
  CREATE INDEX "_announcement_bar_v_rels_pages_id_idx" ON "_announcement_bar_v_rels" USING btree ("pages_id");
  CREATE INDEX "_announcement_bar_v_rels_products_id_idx" ON "_announcement_bar_v_rels" USING btree ("products_id");
  CREATE INDEX "_announcement_bar_v_rels_categories_id_idx" ON "_announcement_bar_v_rels" USING btree ("categories_id");
  CREATE INDEX "footer_columns_links_order_idx" ON "footer_columns_links" USING btree ("_order");
  CREATE INDEX "footer_columns_links_parent_id_idx" ON "footer_columns_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_columns_links_locales_locale_parent_id_unique" ON "footer_columns_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_columns_links_locales_parent_id_idx" ON "footer_columns_links_locales" USING btree ("_parent_id");
  CREATE INDEX "footer_columns_order_idx" ON "footer_columns" USING btree ("_order");
  CREATE INDEX "footer_columns_parent_id_idx" ON "footer_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_columns_locales_locale_parent_id_unique" ON "footer_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_columns_locales_parent_id_idx" ON "footer_columns_locales" USING btree ("_parent_id");
  CREATE INDEX "footer_bottom_links_order_idx" ON "footer_bottom_links" USING btree ("_order");
  CREATE INDEX "footer_bottom_links_parent_id_idx" ON "footer_bottom_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_bottom_links_locales_locale_parent_id_unique" ON "footer_bottom_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_bottom_links_locales_parent_id_idx" ON "footer_bottom_links_locales" USING btree ("_parent_id");
  CREATE INDEX "footer__status_idx" ON "footer" USING btree ("_status");
  CREATE UNIQUE INDEX "footer_locales_locale_parent_id_unique" ON "footer_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_locales_parent_id_idx" ON "footer_locales" USING btree ("_parent_id");
  CREATE INDEX "footer_rels_order_idx" ON "footer_rels" USING btree ("order");
  CREATE INDEX "footer_rels_parent_idx" ON "footer_rels" USING btree ("parent_id");
  CREATE INDEX "footer_rels_path_idx" ON "footer_rels" USING btree ("path");
  CREATE INDEX "footer_rels_pages_id_idx" ON "footer_rels" USING btree ("pages_id");
  CREATE INDEX "footer_rels_products_id_idx" ON "footer_rels" USING btree ("products_id");
  CREATE INDEX "footer_rels_categories_id_idx" ON "footer_rels" USING btree ("categories_id");
  CREATE INDEX "_footer_v_version_columns_links_order_idx" ON "_footer_v_version_columns_links" USING btree ("_order");
  CREATE INDEX "_footer_v_version_columns_links_parent_id_idx" ON "_footer_v_version_columns_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_footer_v_version_columns_links_locales_locale_parent_id_uni" ON "_footer_v_version_columns_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_footer_v_version_columns_links_locales_parent_id_idx" ON "_footer_v_version_columns_links_locales" USING btree ("_parent_id");
  CREATE INDEX "_footer_v_version_columns_order_idx" ON "_footer_v_version_columns" USING btree ("_order");
  CREATE INDEX "_footer_v_version_columns_parent_id_idx" ON "_footer_v_version_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_footer_v_version_columns_locales_locale_parent_id_unique" ON "_footer_v_version_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_footer_v_version_columns_locales_parent_id_idx" ON "_footer_v_version_columns_locales" USING btree ("_parent_id");
  CREATE INDEX "_footer_v_version_bottom_links_order_idx" ON "_footer_v_version_bottom_links" USING btree ("_order");
  CREATE INDEX "_footer_v_version_bottom_links_parent_id_idx" ON "_footer_v_version_bottom_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_footer_v_version_bottom_links_locales_locale_parent_id_uniq" ON "_footer_v_version_bottom_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_footer_v_version_bottom_links_locales_parent_id_idx" ON "_footer_v_version_bottom_links_locales" USING btree ("_parent_id");
  CREATE INDEX "_footer_v_version_version__status_idx" ON "_footer_v" USING btree ("version__status");
  CREATE INDEX "_footer_v_created_at_idx" ON "_footer_v" USING btree ("created_at");
  CREATE INDEX "_footer_v_updated_at_idx" ON "_footer_v" USING btree ("updated_at");
  CREATE INDEX "_footer_v_snapshot_idx" ON "_footer_v" USING btree ("snapshot");
  CREATE INDEX "_footer_v_published_locale_idx" ON "_footer_v" USING btree ("published_locale");
  CREATE INDEX "_footer_v_latest_idx" ON "_footer_v" USING btree ("latest");
  CREATE INDEX "_footer_v_autosave_idx" ON "_footer_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_footer_v_locales_locale_parent_id_unique" ON "_footer_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_footer_v_locales_parent_id_idx" ON "_footer_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_footer_v_rels_order_idx" ON "_footer_v_rels" USING btree ("order");
  CREATE INDEX "_footer_v_rels_parent_idx" ON "_footer_v_rels" USING btree ("parent_id");
  CREATE INDEX "_footer_v_rels_path_idx" ON "_footer_v_rels" USING btree ("path");
  CREATE INDEX "_footer_v_rels_pages_id_idx" ON "_footer_v_rels" USING btree ("pages_id");
  CREATE INDEX "_footer_v_rels_products_id_idx" ON "_footer_v_rels" USING btree ("products_id");
  CREATE INDEX "_footer_v_rels_categories_id_idx" ON "_footer_v_rels" USING btree ("categories_id");
  CREATE INDEX "site_settings_socials_order_idx" ON "site_settings_socials" USING btree ("_order");
  CREATE INDEX "site_settings_socials_parent_id_idx" ON "site_settings_socials" USING btree ("_parent_id");
  CREATE INDEX "site_settings_favicon_idx" ON "site_settings" USING btree ("favicon_id");
  CREATE INDEX "site_settings_og_image_idx" ON "site_settings" USING btree ("og_image_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_locales_parent_id_idx" ON "site_settings_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "ui_strings_locales_locale_parent_id_unique" ON "ui_strings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "ui_strings_locales_parent_id_idx" ON "ui_strings_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "ui_strings_account_locales_locale_parent_id_unique" ON "ui_strings_account_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "ui_strings_account_locales_parent_id_idx" ON "ui_strings_account_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "ui_strings_extra_locales_locale_parent_id_unique" ON "ui_strings_extra_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "ui_strings_extra_locales_parent_id_idx" ON "ui_strings_extra_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "notifications_locales_locale_parent_id_unique" ON "notifications_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "notifications_locales_parent_id_idx" ON "notifications_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "orders_items" CASCADE;
  DROP TABLE "orders_status_history" CASCADE;
  DROP TABLE "orders" CASCADE;
  DROP TABLE "customers_auth_providers" CASCADE;
  DROP TABLE "customers_addresses" CASCADE;
  DROP TABLE "customers" CASCADE;
  DROP TABLE "coupons" CASCADE;
  DROP TABLE "coupons_locales" CASCADE;
  DROP TABLE "quantity_discounts_tiers" CASCADE;
  DROP TABLE "quantity_discounts" CASCADE;
  DROP TABLE "quantity_discounts_locales" CASCADE;
  DROP TABLE "quantity_discounts_rels" CASCADE;
  DROP TABLE "gift_boxes_sizes" CASCADE;
  DROP TABLE "gift_boxes_sizes_locales" CASCADE;
  DROP TABLE "gift_boxes_items" CASCADE;
  DROP TABLE "gift_boxes_items_locales" CASCADE;
  DROP TABLE "gift_boxes_packaging" CASCADE;
  DROP TABLE "gift_boxes_packaging_locales" CASCADE;
  DROP TABLE "gift_boxes" CASCADE;
  DROP TABLE "gift_boxes_locales" CASCADE;
  DROP TABLE "gift_boxes_rels" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_locales" CASCADE;
  DROP TABLE "posts_texts" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_locales" CASCADE;
  DROP TABLE "_posts_v_texts" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  DROP TABLE "stores_hours" CASCADE;
  DROP TABLE "stores_hours_locales" CASCADE;
  DROP TABLE "stores_services" CASCADE;
  DROP TABLE "stores" CASCADE;
  DROP TABLE "stores_locales" CASCADE;
  DROP TABLE "pages_blocks_hero_slides_ctas" CASCADE;
  DROP TABLE "pages_blocks_hero_slides_ctas_locales" CASCADE;
  DROP TABLE "pages_blocks_hero_slides" CASCADE;
  DROP TABLE "pages_blocks_hero_slides_locales" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_category_grid_tiles" CASCADE;
  DROP TABLE "pages_blocks_category_grid_tiles_locales" CASCADE;
  DROP TABLE "pages_blocks_category_grid" CASCADE;
  DROP TABLE "pages_blocks_category_grid_locales" CASCADE;
  DROP TABLE "pages_blocks_product_collection" CASCADE;
  DROP TABLE "pages_blocks_product_collection_locales" CASCADE;
  DROP TABLE "pages_blocks_logo_marquee_logos" CASCADE;
  DROP TABLE "pages_blocks_logo_marquee" CASCADE;
  DROP TABLE "pages_blocks_logo_marquee_locales" CASCADE;
  DROP TABLE "pages_blocks_feature_tiles_tiles" CASCADE;
  DROP TABLE "pages_blocks_feature_tiles_tiles_locales" CASCADE;
  DROP TABLE "pages_blocks_feature_tiles" CASCADE;
  DROP TABLE "pages_blocks_feature_tiles_locales" CASCADE;
  DROP TABLE "pages_blocks_testimonials" CASCADE;
  DROP TABLE "pages_blocks_testimonials_locales" CASCADE;
  DROP TABLE "pages_blocks_stats_items" CASCADE;
  DROP TABLE "pages_blocks_stats_items_locales" CASCADE;
  DROP TABLE "pages_blocks_stats" CASCADE;
  DROP TABLE "pages_blocks_stats_locales" CASCADE;
  DROP TABLE "pages_blocks_image_with_text" CASCADE;
  DROP TABLE "pages_blocks_image_with_text_locales" CASCADE;
  DROP TABLE "pages_blocks_banner_strip" CASCADE;
  DROP TABLE "pages_blocks_banner_strip_locales" CASCADE;
  DROP TABLE "pages_blocks_rich_text" CASCADE;
  DROP TABLE "pages_blocks_rich_text_locales" CASCADE;
  DROP TABLE "pages_blocks_newsletter" CASCADE;
  DROP TABLE "pages_blocks_newsletter_locales" CASCADE;
  DROP TABLE "pages_blocks_faq_items" CASCADE;
  DROP TABLE "pages_blocks_faq_items_locales" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "pages_blocks_faq_locales" CASCADE;
  DROP TABLE "pages_blocks_track_order" CASCADE;
  DROP TABLE "pages_blocks_track_order_locales" CASCADE;
  DROP TABLE "pages_blocks_enquiry_form" CASCADE;
  DROP TABLE "pages_blocks_enquiry_form_locales" CASCADE;
  DROP TABLE "pages_blocks_store_locator" CASCADE;
  DROP TABLE "pages_blocks_store_locator_locales" CASCADE;
  DROP TABLE "pages_blocks_latest_posts" CASCADE;
  DROP TABLE "pages_blocks_latest_posts_locales" CASCADE;
  DROP TABLE "pages_blocks_spacer" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_slides_ctas" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_slides_ctas_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_slides" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_slides_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_category_grid_tiles" CASCADE;
  DROP TABLE "_pages_v_blocks_category_grid_tiles_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_category_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_category_grid_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_product_collection" CASCADE;
  DROP TABLE "_pages_v_blocks_product_collection_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_logo_marquee_logos" CASCADE;
  DROP TABLE "_pages_v_blocks_logo_marquee" CASCADE;
  DROP TABLE "_pages_v_blocks_logo_marquee_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_tiles_tiles" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_tiles_tiles_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_tiles" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_tiles_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_items" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_image_with_text" CASCADE;
  DROP TABLE "_pages_v_blocks_image_with_text_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_banner_strip" CASCADE;
  DROP TABLE "_pages_v_blocks_banner_strip_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_newsletter" CASCADE;
  DROP TABLE "_pages_v_blocks_newsletter_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_items" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_faq" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_track_order" CASCADE;
  DROP TABLE "_pages_v_blocks_track_order_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_enquiry_form" CASCADE;
  DROP TABLE "_pages_v_blocks_enquiry_form_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_store_locator" CASCADE;
  DROP TABLE "_pages_v_blocks_store_locator_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_latest_posts" CASCADE;
  DROP TABLE "_pages_v_blocks_latest_posts_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_spacer" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "products_variants" CASCADE;
  DROP TABLE "products_variants_locales" CASCADE;
  DROP TABLE "products_badges" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_locales" CASCADE;
  DROP TABLE "products_texts" CASCADE;
  DROP TABLE "products_rels" CASCADE;
  DROP TABLE "_products_v_version_variants" CASCADE;
  DROP TABLE "_products_v_version_variants_locales" CASCADE;
  DROP TABLE "_products_v_version_badges" CASCADE;
  DROP TABLE "_products_v" CASCADE;
  DROP TABLE "_products_v_locales" CASCADE;
  DROP TABLE "_products_v_texts" CASCADE;
  DROP TABLE "_products_v_rels" CASCADE;
  DROP TABLE "categories_blocks_banner_strip" CASCADE;
  DROP TABLE "categories_blocks_banner_strip_locales" CASCADE;
  DROP TABLE "categories_blocks_image_with_text" CASCADE;
  DROP TABLE "categories_blocks_image_with_text_locales" CASCADE;
  DROP TABLE "categories_blocks_rich_text" CASCADE;
  DROP TABLE "categories_blocks_rich_text_locales" CASCADE;
  DROP TABLE "categories_blocks_feature_tiles_tiles" CASCADE;
  DROP TABLE "categories_blocks_feature_tiles_tiles_locales" CASCADE;
  DROP TABLE "categories_blocks_feature_tiles" CASCADE;
  DROP TABLE "categories_blocks_feature_tiles_locales" CASCADE;
  DROP TABLE "categories_blocks_faq_items" CASCADE;
  DROP TABLE "categories_blocks_faq_items_locales" CASCADE;
  DROP TABLE "categories_blocks_faq" CASCADE;
  DROP TABLE "categories_blocks_faq_locales" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "categories_locales" CASCADE;
  DROP TABLE "categories_rels" CASCADE;
  DROP TABLE "reviews" CASCADE;
  DROP TABLE "reviews_locales" CASCADE;
  DROP TABLE "delivery_zones_slots" CASCADE;
  DROP TABLE "delivery_zones_blackout_dates" CASCADE;
  DROP TABLE "delivery_zones" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "enquiries" CASCADE;
  DROP TABLE "subscribers" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "otp_codes" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "theme" CASCADE;
  DROP TABLE "_theme_v" CASCADE;
  DROP TABLE "header_nav_items_columns_items" CASCADE;
  DROP TABLE "header_nav_items_columns_items_locales" CASCADE;
  DROP TABLE "header_nav_items_columns" CASCADE;
  DROP TABLE "header_nav_items_columns_locales" CASCADE;
  DROP TABLE "header_nav_items" CASCADE;
  DROP TABLE "header_nav_items_locales" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "header_locales" CASCADE;
  DROP TABLE "header_texts" CASCADE;
  DROP TABLE "header_rels" CASCADE;
  DROP TABLE "_header_v_version_nav_items_columns_items" CASCADE;
  DROP TABLE "_header_v_version_nav_items_columns_items_locales" CASCADE;
  DROP TABLE "_header_v_version_nav_items_columns" CASCADE;
  DROP TABLE "_header_v_version_nav_items_columns_locales" CASCADE;
  DROP TABLE "_header_v_version_nav_items" CASCADE;
  DROP TABLE "_header_v_version_nav_items_locales" CASCADE;
  DROP TABLE "_header_v" CASCADE;
  DROP TABLE "_header_v_locales" CASCADE;
  DROP TABLE "_header_v_texts" CASCADE;
  DROP TABLE "_header_v_rels" CASCADE;
  DROP TABLE "announcement_bar_messages" CASCADE;
  DROP TABLE "announcement_bar_messages_locales" CASCADE;
  DROP TABLE "announcement_bar" CASCADE;
  DROP TABLE "announcement_bar_rels" CASCADE;
  DROP TABLE "_announcement_bar_v_version_messages" CASCADE;
  DROP TABLE "_announcement_bar_v_version_messages_locales" CASCADE;
  DROP TABLE "_announcement_bar_v" CASCADE;
  DROP TABLE "_announcement_bar_v_rels" CASCADE;
  DROP TABLE "footer_columns_links" CASCADE;
  DROP TABLE "footer_columns_links_locales" CASCADE;
  DROP TABLE "footer_columns" CASCADE;
  DROP TABLE "footer_columns_locales" CASCADE;
  DROP TABLE "footer_bottom_links" CASCADE;
  DROP TABLE "footer_bottom_links_locales" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_locales" CASCADE;
  DROP TABLE "footer_rels" CASCADE;
  DROP TABLE "_footer_v_version_columns_links" CASCADE;
  DROP TABLE "_footer_v_version_columns_links_locales" CASCADE;
  DROP TABLE "_footer_v_version_columns" CASCADE;
  DROP TABLE "_footer_v_version_columns_locales" CASCADE;
  DROP TABLE "_footer_v_version_bottom_links" CASCADE;
  DROP TABLE "_footer_v_version_bottom_links_locales" CASCADE;
  DROP TABLE "_footer_v" CASCADE;
  DROP TABLE "_footer_v_locales" CASCADE;
  DROP TABLE "_footer_v_rels" CASCADE;
  DROP TABLE "site_settings_socials" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP TABLE "ui_strings" CASCADE;
  DROP TABLE "ui_strings_locales" CASCADE;
  DROP TABLE "ui_strings_account" CASCADE;
  DROP TABLE "ui_strings_account_locales" CASCADE;
  DROP TABLE "ui_strings_extra" CASCADE;
  DROP TABLE "ui_strings_extra_locales" CASCADE;
  DROP TABLE "notifications" CASCADE;
  DROP TABLE "notifications_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_orders_items_kind";
  DROP TYPE "public"."enum_orders_status";
  DROP TYPE "public"."enum_orders_payment_method";
  DROP TYPE "public"."enum_orders_payment_status";
  DROP TYPE "public"."enum_customers_auth_providers";
  DROP TYPE "public"."enum_coupons_type";
  DROP TYPE "public"."enum_quantity_discounts_tiers_type";
  DROP TYPE "public"."enum_quantity_discounts_apply_to";
  DROP TYPE "public"."enum_posts_section";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_section";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum__posts_v_published_locale";
  DROP TYPE "public"."enum_stores_services";
  DROP TYPE "public"."enum_pages_blocks_hero_slides_ctas_link_type";
  DROP TYPE "public"."enum_pages_blocks_hero_slides_ctas_appearance";
  DROP TYPE "public"."enum_pages_blocks_hero_slides_align";
  DROP TYPE "public"."enum_pages_blocks_hero_slides_tone";
  DROP TYPE "public"."enum_pages_blocks_hero_variant";
  DROP TYPE "public"."enum_pages_blocks_hero_height";
  DROP TYPE "public"."enum_pages_blocks_hero_style_background";
  DROP TYPE "public"."enum_pages_blocks_hero_style_padding_top";
  DROP TYPE "public"."enum_pages_blocks_hero_style_padding_bottom";
  DROP TYPE "public"."enum_pages_blocks_hero_style_width";
  DROP TYPE "public"."enum_pages_blocks_hero_style_visibility";
  DROP TYPE "public"."enum_pages_blocks_category_grid_tiles_link_type";
  DROP TYPE "public"."enum_pages_blocks_category_grid_source";
  DROP TYPE "public"."enum_pages_blocks_category_grid_variant";
  DROP TYPE "public"."enum_pages_blocks_category_grid_style_background";
  DROP TYPE "public"."enum_pages_blocks_category_grid_style_padding_top";
  DROP TYPE "public"."enum_pages_blocks_category_grid_style_padding_bottom";
  DROP TYPE "public"."enum_pages_blocks_category_grid_style_width";
  DROP TYPE "public"."enum_pages_blocks_category_grid_style_visibility";
  DROP TYPE "public"."enum_pages_blocks_product_collection_source";
  DROP TYPE "public"."enum_pages_blocks_product_collection_variant";
  DROP TYPE "public"."enum_pages_blocks_product_collection_view_all_type";
  DROP TYPE "public"."enum_pages_blocks_product_collection_style_background";
  DROP TYPE "public"."enum_pages_blocks_product_collection_style_padding_top";
  DROP TYPE "public"."enum_pages_blocks_product_collection_style_padding_bottom";
  DROP TYPE "public"."enum_pages_blocks_product_collection_style_width";
  DROP TYPE "public"."enum_pages_blocks_product_collection_style_visibility";
  DROP TYPE "public"."enum_pages_blocks_logo_marquee_variant";
  DROP TYPE "public"."enum_pages_blocks_logo_marquee_speed";
  DROP TYPE "public"."enum_pages_blocks_logo_marquee_style_background";
  DROP TYPE "public"."enum_pages_blocks_logo_marquee_style_padding_top";
  DROP TYPE "public"."enum_pages_blocks_logo_marquee_style_padding_bottom";
  DROP TYPE "public"."enum_pages_blocks_logo_marquee_style_width";
  DROP TYPE "public"."enum_pages_blocks_logo_marquee_style_visibility";
  DROP TYPE "public"."enum_pages_blocks_feature_tiles_tiles_link_type";
  DROP TYPE "public"."enum_pages_blocks_feature_tiles_variant";
  DROP TYPE "public"."enum_pages_blocks_feature_tiles_style_background";
  DROP TYPE "public"."enum_pages_blocks_feature_tiles_style_padding_top";
  DROP TYPE "public"."enum_pages_blocks_feature_tiles_style_padding_bottom";
  DROP TYPE "public"."enum_pages_blocks_feature_tiles_style_width";
  DROP TYPE "public"."enum_pages_blocks_feature_tiles_style_visibility";
  DROP TYPE "public"."enum_pages_blocks_testimonials_source";
  DROP TYPE "public"."enum_pages_blocks_testimonials_variant";
  DROP TYPE "public"."enum_pages_blocks_testimonials_style_background";
  DROP TYPE "public"."enum_pages_blocks_testimonials_style_padding_top";
  DROP TYPE "public"."enum_pages_blocks_testimonials_style_padding_bottom";
  DROP TYPE "public"."enum_pages_blocks_testimonials_style_width";
  DROP TYPE "public"."enum_pages_blocks_testimonials_style_visibility";
  DROP TYPE "public"."enum_pages_blocks_stats_variant";
  DROP TYPE "public"."enum_pages_blocks_stats_style_background";
  DROP TYPE "public"."enum_pages_blocks_stats_style_padding_top";
  DROP TYPE "public"."enum_pages_blocks_stats_style_padding_bottom";
  DROP TYPE "public"."enum_pages_blocks_stats_style_width";
  DROP TYPE "public"."enum_pages_blocks_stats_style_visibility";
  DROP TYPE "public"."enum_pages_blocks_image_with_text_image_position";
  DROP TYPE "public"."enum_pages_blocks_image_with_text_variant";
  DROP TYPE "public"."enum_pages_blocks_image_with_text_cta_type";
  DROP TYPE "public"."enum_pages_blocks_image_with_text_style_background";
  DROP TYPE "public"."enum_pages_blocks_image_with_text_style_padding_top";
  DROP TYPE "public"."enum_pages_blocks_image_with_text_style_padding_bottom";
  DROP TYPE "public"."enum_pages_blocks_image_with_text_style_width";
  DROP TYPE "public"."enum_pages_blocks_image_with_text_style_visibility";
  DROP TYPE "public"."enum_pages_blocks_banner_strip_cta_type";
  DROP TYPE "public"."enum_pages_blocks_banner_strip_variant";
  DROP TYPE "public"."enum_pages_blocks_banner_strip_align";
  DROP TYPE "public"."enum_pages_blocks_banner_strip_style_background";
  DROP TYPE "public"."enum_pages_blocks_banner_strip_style_padding_top";
  DROP TYPE "public"."enum_pages_blocks_banner_strip_style_padding_bottom";
  DROP TYPE "public"."enum_pages_blocks_banner_strip_style_width";
  DROP TYPE "public"."enum_pages_blocks_banner_strip_style_visibility";
  DROP TYPE "public"."enum_pages_blocks_rich_text_width";
  DROP TYPE "public"."enum_pages_blocks_rich_text_align";
  DROP TYPE "public"."enum_pages_blocks_rich_text_style_background";
  DROP TYPE "public"."enum_pages_blocks_rich_text_style_padding_top";
  DROP TYPE "public"."enum_pages_blocks_rich_text_style_padding_bottom";
  DROP TYPE "public"."enum_pages_blocks_rich_text_style_width";
  DROP TYPE "public"."enum_pages_blocks_rich_text_style_visibility";
  DROP TYPE "public"."enum_pages_blocks_newsletter_variant";
  DROP TYPE "public"."enum_pages_blocks_newsletter_style_background";
  DROP TYPE "public"."enum_pages_blocks_newsletter_style_padding_top";
  DROP TYPE "public"."enum_pages_blocks_newsletter_style_padding_bottom";
  DROP TYPE "public"."enum_pages_blocks_newsletter_style_width";
  DROP TYPE "public"."enum_pages_blocks_newsletter_style_visibility";
  DROP TYPE "public"."enum_pages_blocks_faq_style_background";
  DROP TYPE "public"."enum_pages_blocks_faq_style_padding_top";
  DROP TYPE "public"."enum_pages_blocks_faq_style_padding_bottom";
  DROP TYPE "public"."enum_pages_blocks_faq_style_width";
  DROP TYPE "public"."enum_pages_blocks_faq_style_visibility";
  DROP TYPE "public"."enum_pages_blocks_track_order_style_background";
  DROP TYPE "public"."enum_pages_blocks_track_order_style_padding_top";
  DROP TYPE "public"."enum_pages_blocks_track_order_style_padding_bottom";
  DROP TYPE "public"."enum_pages_blocks_track_order_style_width";
  DROP TYPE "public"."enum_pages_blocks_track_order_style_visibility";
  DROP TYPE "public"."enum_pages_blocks_enquiry_form_enquiry_type";
  DROP TYPE "public"."enum_pages_blocks_enquiry_form_style_background";
  DROP TYPE "public"."enum_pages_blocks_enquiry_form_style_padding_top";
  DROP TYPE "public"."enum_pages_blocks_enquiry_form_style_padding_bottom";
  DROP TYPE "public"."enum_pages_blocks_enquiry_form_style_width";
  DROP TYPE "public"."enum_pages_blocks_enquiry_form_style_visibility";
  DROP TYPE "public"."enum_pages_blocks_store_locator_source";
  DROP TYPE "public"."enum_pages_blocks_store_locator_style_background";
  DROP TYPE "public"."enum_pages_blocks_store_locator_style_padding_top";
  DROP TYPE "public"."enum_pages_blocks_store_locator_style_padding_bottom";
  DROP TYPE "public"."enum_pages_blocks_store_locator_style_width";
  DROP TYPE "public"."enum_pages_blocks_store_locator_style_visibility";
  DROP TYPE "public"."enum_pages_blocks_latest_posts_section";
  DROP TYPE "public"."enum_pages_blocks_latest_posts_view_all_type";
  DROP TYPE "public"."enum_pages_blocks_latest_posts_style_background";
  DROP TYPE "public"."enum_pages_blocks_latest_posts_style_padding_top";
  DROP TYPE "public"."enum_pages_blocks_latest_posts_style_padding_bottom";
  DROP TYPE "public"."enum_pages_blocks_latest_posts_style_width";
  DROP TYPE "public"."enum_pages_blocks_latest_posts_style_visibility";
  DROP TYPE "public"."enum_pages_blocks_spacer_size";
  DROP TYPE "public"."enum_pages_blocks_spacer_style_background";
  DROP TYPE "public"."enum_pages_blocks_spacer_style_padding_top";
  DROP TYPE "public"."enum_pages_blocks_spacer_style_padding_bottom";
  DROP TYPE "public"."enum_pages_blocks_spacer_style_width";
  DROP TYPE "public"."enum_pages_blocks_spacer_style_visibility";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_hero_slides_ctas_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_hero_slides_ctas_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_hero_slides_align";
  DROP TYPE "public"."enum__pages_v_blocks_hero_slides_tone";
  DROP TYPE "public"."enum__pages_v_blocks_hero_variant";
  DROP TYPE "public"."enum__pages_v_blocks_hero_height";
  DROP TYPE "public"."enum__pages_v_blocks_hero_style_background";
  DROP TYPE "public"."enum__pages_v_blocks_hero_style_padding_top";
  DROP TYPE "public"."enum__pages_v_blocks_hero_style_padding_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_hero_style_width";
  DROP TYPE "public"."enum__pages_v_blocks_hero_style_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_category_grid_tiles_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_category_grid_source";
  DROP TYPE "public"."enum__pages_v_blocks_category_grid_variant";
  DROP TYPE "public"."enum__pages_v_blocks_category_grid_style_background";
  DROP TYPE "public"."enum__pages_v_blocks_category_grid_style_padding_top";
  DROP TYPE "public"."enum__pages_v_blocks_category_grid_style_padding_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_category_grid_style_width";
  DROP TYPE "public"."enum__pages_v_blocks_category_grid_style_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_product_collection_source";
  DROP TYPE "public"."enum__pages_v_blocks_product_collection_variant";
  DROP TYPE "public"."enum__pages_v_blocks_product_collection_view_all_type";
  DROP TYPE "public"."enum__pages_v_blocks_product_collection_style_background";
  DROP TYPE "public"."enum__pages_v_blocks_product_collection_style_padding_top";
  DROP TYPE "public"."enum__pages_v_blocks_product_collection_style_padding_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_product_collection_style_width";
  DROP TYPE "public"."enum__pages_v_blocks_product_collection_style_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_logo_marquee_variant";
  DROP TYPE "public"."enum__pages_v_blocks_logo_marquee_speed";
  DROP TYPE "public"."enum__pages_v_blocks_logo_marquee_style_background";
  DROP TYPE "public"."enum__pages_v_blocks_logo_marquee_style_padding_top";
  DROP TYPE "public"."enum__pages_v_blocks_logo_marquee_style_padding_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_logo_marquee_style_width";
  DROP TYPE "public"."enum__pages_v_blocks_logo_marquee_style_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_feature_tiles_tiles_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_feature_tiles_variant";
  DROP TYPE "public"."enum__pages_v_blocks_feature_tiles_style_background";
  DROP TYPE "public"."enum__pages_v_blocks_feature_tiles_style_padding_top";
  DROP TYPE "public"."enum__pages_v_blocks_feature_tiles_style_padding_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_feature_tiles_style_width";
  DROP TYPE "public"."enum__pages_v_blocks_feature_tiles_style_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_source";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_variant";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_style_background";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_style_padding_top";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_style_padding_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_style_width";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_style_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_stats_variant";
  DROP TYPE "public"."enum__pages_v_blocks_stats_style_background";
  DROP TYPE "public"."enum__pages_v_blocks_stats_style_padding_top";
  DROP TYPE "public"."enum__pages_v_blocks_stats_style_padding_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_stats_style_width";
  DROP TYPE "public"."enum__pages_v_blocks_stats_style_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_image_with_text_image_position";
  DROP TYPE "public"."enum__pages_v_blocks_image_with_text_variant";
  DROP TYPE "public"."enum__pages_v_blocks_image_with_text_cta_type";
  DROP TYPE "public"."enum__pages_v_blocks_image_with_text_style_background";
  DROP TYPE "public"."enum__pages_v_blocks_image_with_text_style_padding_top";
  DROP TYPE "public"."enum__pages_v_blocks_image_with_text_style_padding_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_image_with_text_style_width";
  DROP TYPE "public"."enum__pages_v_blocks_image_with_text_style_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_banner_strip_cta_type";
  DROP TYPE "public"."enum__pages_v_blocks_banner_strip_variant";
  DROP TYPE "public"."enum__pages_v_blocks_banner_strip_align";
  DROP TYPE "public"."enum__pages_v_blocks_banner_strip_style_background";
  DROP TYPE "public"."enum__pages_v_blocks_banner_strip_style_padding_top";
  DROP TYPE "public"."enum__pages_v_blocks_banner_strip_style_padding_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_banner_strip_style_width";
  DROP TYPE "public"."enum__pages_v_blocks_banner_strip_style_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_width";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_align";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_style_background";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_style_padding_top";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_style_padding_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_style_width";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_style_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_newsletter_variant";
  DROP TYPE "public"."enum__pages_v_blocks_newsletter_style_background";
  DROP TYPE "public"."enum__pages_v_blocks_newsletter_style_padding_top";
  DROP TYPE "public"."enum__pages_v_blocks_newsletter_style_padding_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_newsletter_style_width";
  DROP TYPE "public"."enum__pages_v_blocks_newsletter_style_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_faq_style_background";
  DROP TYPE "public"."enum__pages_v_blocks_faq_style_padding_top";
  DROP TYPE "public"."enum__pages_v_blocks_faq_style_padding_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_faq_style_width";
  DROP TYPE "public"."enum__pages_v_blocks_faq_style_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_track_order_style_background";
  DROP TYPE "public"."enum__pages_v_blocks_track_order_style_padding_top";
  DROP TYPE "public"."enum__pages_v_blocks_track_order_style_padding_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_track_order_style_width";
  DROP TYPE "public"."enum__pages_v_blocks_track_order_style_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_enquiry_form_enquiry_type";
  DROP TYPE "public"."enum__pages_v_blocks_enquiry_form_style_background";
  DROP TYPE "public"."enum__pages_v_blocks_enquiry_form_style_padding_top";
  DROP TYPE "public"."enum__pages_v_blocks_enquiry_form_style_padding_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_enquiry_form_style_width";
  DROP TYPE "public"."enum__pages_v_blocks_enquiry_form_style_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_store_locator_source";
  DROP TYPE "public"."enum__pages_v_blocks_store_locator_style_background";
  DROP TYPE "public"."enum__pages_v_blocks_store_locator_style_padding_top";
  DROP TYPE "public"."enum__pages_v_blocks_store_locator_style_padding_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_store_locator_style_width";
  DROP TYPE "public"."enum__pages_v_blocks_store_locator_style_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_latest_posts_section";
  DROP TYPE "public"."enum__pages_v_blocks_latest_posts_view_all_type";
  DROP TYPE "public"."enum__pages_v_blocks_latest_posts_style_background";
  DROP TYPE "public"."enum__pages_v_blocks_latest_posts_style_padding_top";
  DROP TYPE "public"."enum__pages_v_blocks_latest_posts_style_padding_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_latest_posts_style_width";
  DROP TYPE "public"."enum__pages_v_blocks_latest_posts_style_visibility";
  DROP TYPE "public"."enum__pages_v_blocks_spacer_size";
  DROP TYPE "public"."enum__pages_v_blocks_spacer_style_background";
  DROP TYPE "public"."enum__pages_v_blocks_spacer_style_padding_top";
  DROP TYPE "public"."enum__pages_v_blocks_spacer_style_padding_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_spacer_style_width";
  DROP TYPE "public"."enum__pages_v_blocks_spacer_style_visibility";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_products_badges";
  DROP TYPE "public"."enum_products_status";
  DROP TYPE "public"."enum__products_v_version_badges";
  DROP TYPE "public"."enum__products_v_version_status";
  DROP TYPE "public"."enum__products_v_published_locale";
  DROP TYPE "public"."enum_categories_blocks_banner_strip_cta_type";
  DROP TYPE "public"."enum_categories_blocks_banner_strip_variant";
  DROP TYPE "public"."enum_categories_blocks_banner_strip_align";
  DROP TYPE "public"."enum_categories_blocks_banner_strip_style_background";
  DROP TYPE "public"."enum_categories_blocks_banner_strip_style_padding_top";
  DROP TYPE "public"."enum_categories_blocks_banner_strip_style_padding_bottom";
  DROP TYPE "public"."enum_categories_blocks_banner_strip_style_width";
  DROP TYPE "public"."enum_categories_blocks_banner_strip_style_visibility";
  DROP TYPE "public"."enum_categories_blocks_image_with_text_image_position";
  DROP TYPE "public"."enum_categories_blocks_image_with_text_variant";
  DROP TYPE "public"."enum_categories_blocks_image_with_text_cta_type";
  DROP TYPE "public"."enum_categories_blocks_image_with_text_style_background";
  DROP TYPE "public"."enum_categories_blocks_image_with_text_style_padding_top";
  DROP TYPE "public"."enum_categories_blocks_image_with_text_style_padding_bottom";
  DROP TYPE "public"."enum_categories_blocks_image_with_text_style_width";
  DROP TYPE "public"."enum_categories_blocks_image_with_text_style_visibility";
  DROP TYPE "public"."enum_categories_blocks_rich_text_width";
  DROP TYPE "public"."enum_categories_blocks_rich_text_align";
  DROP TYPE "public"."enum_categories_blocks_rich_text_style_background";
  DROP TYPE "public"."enum_categories_blocks_rich_text_style_padding_top";
  DROP TYPE "public"."enum_categories_blocks_rich_text_style_padding_bottom";
  DROP TYPE "public"."enum_categories_blocks_rich_text_style_width";
  DROP TYPE "public"."enum_categories_blocks_rich_text_style_visibility";
  DROP TYPE "public"."enum_categories_blocks_feature_tiles_tiles_link_type";
  DROP TYPE "public"."enum_categories_blocks_feature_tiles_variant";
  DROP TYPE "public"."enum_categories_blocks_feature_tiles_style_background";
  DROP TYPE "public"."enum_categories_blocks_feature_tiles_style_padding_top";
  DROP TYPE "public"."enum_categories_blocks_feature_tiles_style_padding_bottom";
  DROP TYPE "public"."enum_categories_blocks_feature_tiles_style_width";
  DROP TYPE "public"."enum_categories_blocks_feature_tiles_style_visibility";
  DROP TYPE "public"."enum_categories_blocks_faq_style_background";
  DROP TYPE "public"."enum_categories_blocks_faq_style_padding_top";
  DROP TYPE "public"."enum_categories_blocks_faq_style_padding_bottom";
  DROP TYPE "public"."enum_categories_blocks_faq_style_width";
  DROP TYPE "public"."enum_categories_blocks_faq_style_visibility";
  DROP TYPE "public"."enum_delivery_zones_kind";
  DROP TYPE "public"."enum_enquiries_type";
  DROP TYPE "public"."enum_enquiries_status";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_theme_font_source";
  DROP TYPE "public"."enum_theme_heading_weight";
  DROP TYPE "public"."enum_theme_heading_case";
  DROP TYPE "public"."enum_theme_button_shape";
  DROP TYPE "public"."enum_theme_card_style";
  DROP TYPE "public"."enum_theme_image_ratio";
  DROP TYPE "public"."enum_theme_status";
  DROP TYPE "public"."enum__theme_v_version_font_source";
  DROP TYPE "public"."enum__theme_v_version_heading_weight";
  DROP TYPE "public"."enum__theme_v_version_heading_case";
  DROP TYPE "public"."enum__theme_v_version_button_shape";
  DROP TYPE "public"."enum__theme_v_version_card_style";
  DROP TYPE "public"."enum__theme_v_version_image_ratio";
  DROP TYPE "public"."enum__theme_v_version_status";
  DROP TYPE "public"."enum__theme_v_published_locale";
  DROP TYPE "public"."enum_header_nav_items_columns_items_link_type";
  DROP TYPE "public"."enum_header_nav_items_columns_heading_link_type";
  DROP TYPE "public"."enum_header_nav_items_layout";
  DROP TYPE "public"."enum_header_nav_items_link_type";
  DROP TYPE "public"."enum_header_nav_items_promo_link_type";
  DROP TYPE "public"."enum_header_status";
  DROP TYPE "public"."enum__header_v_version_nav_items_columns_items_link_type";
  DROP TYPE "public"."enum__header_v_version_nav_items_columns_heading_link_type";
  DROP TYPE "public"."enum__header_v_version_nav_items_layout";
  DROP TYPE "public"."enum__header_v_version_nav_items_link_type";
  DROP TYPE "public"."enum__header_v_version_nav_items_promo_link_type";
  DROP TYPE "public"."enum__header_v_version_status";
  DROP TYPE "public"."enum__header_v_published_locale";
  DROP TYPE "public"."enum_announcement_bar_messages_link_type";
  DROP TYPE "public"."enum_announcement_bar_status";
  DROP TYPE "public"."enum__announcement_bar_v_version_messages_link_type";
  DROP TYPE "public"."enum__announcement_bar_v_version_status";
  DROP TYPE "public"."enum__announcement_bar_v_published_locale";
  DROP TYPE "public"."enum_footer_columns_links_link_type";
  DROP TYPE "public"."enum_footer_bottom_links_link_type";
  DROP TYPE "public"."enum_footer_status";
  DROP TYPE "public"."enum__footer_v_version_columns_links_link_type";
  DROP TYPE "public"."enum__footer_v_version_bottom_links_link_type";
  DROP TYPE "public"."enum__footer_v_version_status";
  DROP TYPE "public"."enum__footer_v_published_locale";
  DROP TYPE "public"."enum_site_settings_socials_platform";
  DROP TYPE "public"."enum_site_settings_currency";`)
}
