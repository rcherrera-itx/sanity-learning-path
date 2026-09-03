import { createHmac, timingSafeEqual } from 'node:crypto';

import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

import { getShopifyProductCacheTag } from '@/shopify/cache-tags';


const SHOPIFY_PRODUCT_UPDATE_TOPIC = "products/update";

type ShopifyProductUpdatePayload = {
    id?: number;
    handle?: unknown;
};

function normalizeShopDomain(domain: string): string {
    return domain
        .trim()
        .toLowerCase()
        .replace(/^https?:\/\//, "")
        .replace(/\/$/, "");
};

function hasValidHmac(
    rawBody: string,
    receivedHmac: string,
    clientSecret: string
): boolean {
    const calculatedHmac = createHmac('sha256', clientSecret)
        .update(rawBody, 'utf8')
        .digest();

    const receivedHmacBuffer = Buffer.from(
        receivedHmac,
        'base64'
    );

    return receivedHmacBuffer.length === calculatedHmac.length
        && timingSafeEqual(receivedHmacBuffer, calculatedHmac);
}

export async function POST(request: Request) {
    const clientSecret = process.env.SHOPIFY_APP_CLIENT_SECRET;
    const configuredShopDomain = process.env.SHOPIFY_STORE_DOMAIN;

    if (!clientSecret || !configuredShopDomain) {
        console.error("[SHOPIFY][WEBHOOK][MISSING_CONFIGURATION]");

        return NextResponse.json(
            { message: "Shopify webhook configuration is missing." },
            { status: 500 }
        );
    }

    try {
        const rawBody = await request.text();
        const receivedHmac = request.headers.get('x-shopify-hmac-sha256');

        if (!receivedHmac || !hasValidHmac(rawBody, receivedHmac, clientSecret)) {
            console.error("[SHOPIFY][WEBHOOK][INVALID]");

            return NextResponse.json(
                { message: "Invalid Shopify webhook signature." },
                { status: 401 }
            );
        }

        const topic = request.headers.get('x-shopify-topic');


        if (topic !== SHOPIFY_PRODUCT_UPDATE_TOPIC) {
            console.error("[SHOPIFY][WEBHOOK][UNSUPPORTED]");

            return NextResponse.json(
                { message: "Unsupported Shopify webhook topic." },
                { status: 400 }
            );
        }

        const shopDomain = request.headers.get('x-shopify-shop-domain');

        if (
            !shopDomain
            || normalizeShopDomain(shopDomain) !== normalizeShopDomain(configuredShopDomain)
        ) {
            console.error("[SHOPIFY][WEBHOOK][UNEXPECTED]");

            return NextResponse.json(
                { message: "Unexpected Shopify shop domain." },
                { status: 400 }
            );
        }

        let parsedBody: unknown;

        try {
            parsedBody = JSON.parse(rawBody) as unknown;
        } catch (error: unknown) {

            const message = error instanceof Error
                ? error.message
                : "unknown";

            console.error(
                "[SHOPIFY][WEBHOOK][PAYLOAD]",
                message
            );

            return NextResponse.json(
                { message: "Invalid Shopify webhook payload." },
                { status: 400 }
            );
        }

        if (!parsedBody || typeof parsedBody !== 'object') {
            console.error("[SHOPIFY][WEBHOOK][PAYLOAD]");

            return NextResponse.json(
                { message: "Invalid Shopify webhook payload." },
                { status: 400 }
            );
        }

        const body = parsedBody as ShopifyProductUpdatePayload;
        const handle = typeof body.handle === 'string'
            ? body.handle.trim() : '';

        if (!handle) {
            console.error("[SHOPIFY][WEBHOOK][HANDLE]");

            return NextResponse.json(
                { message: "Missing Shopify product handle." },
                { status: 400 }
            );
        }

        const invalidateTag = getShopifyProductCacheTag(handle);

        revalidateTag(invalidateTag, 'max');

        console.log("[SHOPIFY][WEBHOOK][PRODUCTS_UPDATE]", {
            webhookId: request.headers.get('x-shopify-webhook-id'),
            productId: body.id,
            handle,
            invalidateTag
        });

        return NextResponse.json({
            revalidateTag: true,
            productId: body.id ?? null,
            handle,
            invalidateTag
        });
    } catch (error: unknown) {
        console.error(
            "[SHOPIFY][WEBHOOK][ERROR]",
            { error }
        );

        return NextResponse.json(
            { message: "Shopify webhook failed!" },
            { status: 500 }
        );
    }
}