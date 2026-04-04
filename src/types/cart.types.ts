// =================================================================
// CÁC INTERFACE PHỤ TRỢ (NESTED OBJECTS)
// Tách nhỏ ra để dễ tái sử dụng và file không bị rối
// =================================================================
import { QuantityRule } from './common.types';

export interface FeaturedImage {
    alt: string | null;
    aspect_ratio: number;
    height: number;
    url: string;
    width: number;
}

export interface OptionWithValue {
    name: string;
    value: string;
}

// =================================================================
// INTERFACE CHÍNH CHO 1 SẢN PHẨM TRONG GIỎ HÀNG (CART ITEM)
// Bao gồm toàn bộ data từ cả add.js và cart.js
// =================================================================

export interface CartItem {
    id: number;
    properties: Record<string, string> | null; // Ví dụ: { "_uuid": "...", "_tradeInEligible": "true" }
    quantity: number;
    variant_id: number;
    key: string;
    title: string;
    product_title: string;
    variant_title: string | null;
    price: number;
    original_price: number;
    discounted_price: number;
    line_price: number;
    original_line_price: number;
    presentment_price: number;
    total_discount: number;
    discounts: any[]; // Có thể custom thành interface Discount nếu sau này bạn dùng mã giảm giá
    sku: string;
    grams: number;
    vendor: string;
    taxable: boolean;
    product_id: number;
    product_has_only_default_variant: boolean;
    gift_card: boolean;
    final_price: number;
    final_line_price: number;
    url: string;
    featured_image: FeaturedImage;
    image: string;
    handle: string;
    requires_shipping: boolean;
    product_type: string;
    untranslated_product_title?: string; // Xuất hiện trong add.js
    untranslated_variant_title?: string | null; // Xuất hiện trong add.js
    product_description: string;
    variant_options: string[];
    options_with_values: OptionWithValue[];
    line_level_discount_allocations: any[];
    line_level_total_discount: number;
    quantity_rule?: QuantityRule; // Xuất hiện trong cart.js
    has_components?: boolean; // Xuất hiện trong cart.js
}

// =================================================================
// INTERFACE CHO API RESPONSE
// =================================================================

/**
 * Dùng cho response của POST /cart/add.js
 */
export interface AddCartResponse {
    items: CartItem[];
}

/**
 * Dùng cho response của GET /cart.js 
 * (Chứa toàn bộ thông tin tổng quan của giỏ hàng)
 */
export interface CartResponse {
    token: string;
    note: string | null;
    attributes: Record<string, string>; // Ví dụ: { "Point Used": "0", ... }
    original_total_price: number;
    total_price: number;
    total_discount: number;
    total_weight: number;
    item_count: number;
    items: CartItem[];
    requires_shipping: boolean;
    currency: string;       // Ví dụ: "THB"
    items_subtotal_price: number;
    cart_level_discount_applications: any[];
    discount_codes: any[];
}