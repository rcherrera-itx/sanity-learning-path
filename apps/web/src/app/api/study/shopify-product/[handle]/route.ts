import { NextResponse } from 'next/server';
import { getProductByHandle } from '@/shopify/queries/product';

type ShopifyProductRouteContext = {
    params: Promise<{
        handle: string
    }>;
};

export async function GET(
    _request: Request,
    { params }: ShopifyProductRouteContext
) {
    try {
        const { handle } = await params;
        const product = await getProductByHandle(handle);

        if (!product) {
            return NextResponse.json(
                {
                    message: "Shopify product not found!",
                },
                {
                    status: 404
                }
            );
        }

        return NextResponse.json(
            { product },
            { status: 200 }
        );
    } catch (error: unknown) {
        const message = error instanceof Error
            ? error.message : "Unkown message";

        console.error("[SHOPIFY][PRODUCT_BY_HANDLE]", { message });

        return NextResponse.json(
            {
                message: "Shopify product request failed!",
            },
            {
                status: 500
            }
        );
    }
}
