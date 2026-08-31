import { NextResponse } from 'next/server';
import { getProductEditorialByHandle } from '@/sanity/lib/product-editorial';

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
        const producteditorial = await getProductEditorialByHandle(handle);

        if (!producteditorial) {
            return NextResponse.json(
                {
                    message: "Sanity product editorial not found!",
                },
                {
                    status: 404
                }
            );
        }

        return NextResponse.json(
            { producteditorial },
            { status: 200 }
        );
    } catch (error: unknown) {
        const message = error instanceof Error
            ? error.message : "Unknown message";

        console.error("[SANITY][PRODUCT_BY_HANDLE]", { message });

        return NextResponse.json(
            {
                message: "Sanity product editorial request failed!",
            },
            {
                status: 500
            }
        );
    }
}
