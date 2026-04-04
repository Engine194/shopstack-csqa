import { QuantityRule } from './common.types';
export interface ShopifyProductResponse {
    product: Product;
}

export interface Product {
    id: number;
    title: string;
    body_html: string;
    vendor: string;
    product_type: string;
    created_at: string;
    handle: string;
    updated_at: string;
    published_at: string;
    template_suffix: string | null;
    published_scope: string;
    tags: string;
    variants: Variant[];
    options: ProductOption[];
    images: ProductImage[];
    image: ProductImage;
}

export interface Variant {
    id: number;
    product_id: number;
    title: string;
    price: string;
    sku: string;
    position: number;
    compare_at_price: string | null;
    fulfillment_service: string;
    inventory_management: string | null;
    option1: string | null;
    option2: string | null;
    option3: string | null;
    created_at: string;
    updated_at: string;
    taxable: boolean;
    barcode: string;
    grams: number;
    image_id: number | null;
    weight: Weight;
    weight_unit: string;
    tax_code: string;
    requires_shipping: boolean;
    quantity_rule: QuantityRule;
    price_currency: string;
    compare_at_price_currency: string;
    quantity_price_breaks: any[]; // Có thể định nghĩa cụ thể nếu có data mẫu
}

export interface Weight {
    source: string;
    parsedValue: number;
}

export interface ProductOption {
    id: number;
    product_id: number;
    name: string;
    position: number;
    values: string[];
}

export interface ProductImage {
    id: number;
    product_id: number;
    position: number;
    created_at: string;
    updated_at: string;
    alt: string | null;
    width: number;
    height: number;
    src: string;
    variant_ids: number[];
}