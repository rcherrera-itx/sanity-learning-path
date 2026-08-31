export const SANITY_WEBHOOK_CACHE_TAGS = {
    page: 'webhook:type:page',
    product: 'webhook:type:product'
} as const;

export type SanityDocumentType = keyof typeof SANITY_WEBHOOK_CACHE_TAGS;

export function isSanityDocumentType(value: string): value is SanityDocumentType {
    return Object.prototype.hasOwnProperty.call(
        SANITY_WEBHOOK_CACHE_TAGS,
        value
    );
}

export function getSanityProductCacheTag(
    handle: string
): string {
    return `sanity:product:${handle}`;
}