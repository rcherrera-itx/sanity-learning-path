import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

import {
    isSanityDocumentType,
    SANITY_WEBHOOK_CACHE_TAGS,
    getSanityProductCacheTag
} from '@/sanity/lib/cache-tags';

type SanityWebhookPayload = {
    _id?: string;
    _type?: string;
    handle?: string;
}

export async function POST(request: NextRequest) {
    const secret = process.env.SANITY_REVALIDATE_SECRET;

    if (!secret) {
        return NextResponse.json(
            { message: 'Missing environment variable: SANITY_REVALIDATE_SECRET' },
            { status: 500 }
        );
    }

    try {
        const { body, isValidSignature } = await parseBody<SanityWebhookPayload>(
            request,
            secret,
            true
        );

        if (!isValidSignature) {
            return NextResponse.json(
                { message: 'Invalid signature.' },
                { status: 401 }
            );
        }

        if (!body?._type || !isSanityDocumentType(body._type)) {

            const receivedKeys = body ? Object.keys(body) : [];

            console.warn('[WEBHOOK][UNSUPPORTED-DOCUMENT-TYPES]', {
                documentId: body?._id,
                documentType: body?._type,
                receivedKeys
            });

            return NextResponse.json(
                {
                    message: 'Unsupported Sanity document type.',
                    documentId: body?._id ?? null,
                    documentType: body?._type ?? null,
                    receivedKeys,
                    supportedDocumentTypes: Object.keys(SANITY_WEBHOOK_CACHE_TAGS)
                },
                { status: 400 }
            )
        }

        const productHandle = body._type === 'product'
            ? body.handle?.trim() : undefined;

        if (body._type === 'product' && !productHandle) {
            console.warn('[WEBHOOK][REVALIDATE-TAG][MISSING_HANDLE]', {
                documentId: body._id,
                documentType: body._type
            });

            return NextResponse.json(
                {
                    message: 'Missing product handle.',
                    documentId: body._id ?? null,
                    documentType: body._type
                },
                { status: 400 }
            )
        }

        const invalidatedTags: string[] = [];
        const genericTag = SANITY_WEBHOOK_CACHE_TAGS[body._type];

        revalidateTag(genericTag, 'max');
        invalidatedTags.push(genericTag);

        if (body._type === 'product' && productHandle) {
            const productTag = getSanityProductCacheTag(productHandle);

            revalidateTag(productTag, 'max');
            invalidatedTags.push(productTag);
        }

        console.log('[WEBHOOK][REVALIDATE-TAG]', {
            documentId: body._id,
            documentType: body._type,
            invalidatedTags
        });

        return NextResponse.json({
            revalidated: true,
            documentId: body._id,
            documentType: body._type,
            invalidatedTags
        });
    } catch (error: unknown) {
        console.error('[WEBHOOK][ERROR]', { error });
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'unknown' },
            { status: 500 }
        )
    }
}