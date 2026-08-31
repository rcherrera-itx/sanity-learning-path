export function getShopifyProductCacheTag(
    handle: string
): string {
    return `shopify:product:${handle}`;
}