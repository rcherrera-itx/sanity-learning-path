import { NextResponse } from "next/server";

import { getCachedProductCatalogByHandle } from "@/shopify/queries/product-catalog";

type ShopifyProductCatalogRouteContext = {
    params: Promise<{
        handle: string;
    }>;
};


export async function GET(
    request: Request,
    { params }: ShopifyProductCatalogRouteContext
) {
    try {
        const { handle } = await params;
        const probe = new URL(request.url).searchParams.get("probe");
        const catalog = await getCachedProductCatalogByHandle(handle);

        if (!catalog) {
            return NextResponse.json(
                { message: "Shopify product catalog not found!" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { probe, catalog },
            {
                status: 404,
                headers: {
                    "Cache-Control": "no-store"
                }
            }
        );
    } catch (error: unknown) {
        const message = error instanceof Error
            ? error.message
            : "unknown";

        return NextResponse.json(
            { message: "Shopify product catalog request failed!" },
            { status: 500 }
        );
    }
}