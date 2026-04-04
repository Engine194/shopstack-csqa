// =================================================================
// COMMON TYPES (Dùng chung cho cả Product và Cart)
// =================================================================

export interface QuantityRule {
    min: number;
    max: number | null;
    increment: number;
}
