import { getProductByHandle } from '@/shopify/queries/product';
import { NextResponse } from 'next/server';

export async function GET(params: Promise<{
    handle: string
}>) {
    const { handle } = await params;
    const product = await getProductByHandle(handle);

    if(product) {
        return 200;
    }

    if(product === null) {
        return 400;
    }

    return 500;
}