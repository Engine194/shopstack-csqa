1. go to product detail

1.1. Go to a product detail url
1.2. Test format of url: https://ss-plus-store.myshopify.com/products/2022-apple-watch-ocean-band-mqec3fe-a
1.3. Extract product sku from url
1.4. Extract response from product detail api, extract product info:
1.5. Check button add to cart enable, click it
1.6. Wait for cart api to get previous qty of product if any
1.7. Wait for add cart api to get response
1.8. Extract payload of add to cart api -> get variantId
1.9. Extract current cart to check product qty + 1 or not
1.10. Extract cart item infor to check variant id must match
1.11. Navigate to cart page.

# Verify lại các step trong product details.
# Xác định các edge cases ngay trong luồng này. (ví dụ stock có thể ko đủ, cần kiểm tra stock trước, ko đủ dừng test luôn và có thông báo về report)

# waitForResponse // tranh bi xung dot khi lang nghe response
# Cach lay ra response data tu 1 api
# expect(<cai gi>).mongMuonGi();
# Đóng gói thông tin để chuyển thông tin từ POM này sang POM khác.

2. Verify cart page item. 

2.1. Verify product name
2.2. Verify options
2.3. Verify qty
2.4. Price (total price / unit price)
2.5. Funtional button (+- qty, remove button, link match with product detail url)
2.6. Checkout button enable
2.6. Click checkout

3. Checkout ...