import { NextResponse } from 'next/server';
import { getProductEditorialByHandle } from '@/sanity/lib/product-editorial';

type SanityProductRouteContext = {
    params: Promise<{
        handle: string
    }>;
};

export async function GET(
    _request: Request,
    { params }: SanityProductRouteContext
) {
    try {
        const { handle } = await params;
        const editorial = await getProductEditorialByHandle(handle, {
            perspective: "published",
            stega: false
        });

        if (!editorial) {
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
            { editorial },
            { status: 200 }
        );
    } catch (error: unknown) {
        const message = error instanceof Error
            ? error.message : "Unknown message";

        console.error("[SANITY][PRODUCT_EDITORIAL_BY_HANDLE]", { message });

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
