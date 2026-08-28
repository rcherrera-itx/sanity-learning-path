import { notFound } from "next/navigation";
import Link from "next/link";
import { PortableText, stegaClean } from "next-sanity";
import Image from 'next/image';
import { draftMode } from "next/headers";
import { Suspense } from "react";

import { productBySlugQuery, productSlugsQuery } from "@/sanity/lib/queries";
import { urlFor } from '@/sanity/lib/image';
import { SANITY_WEBHOOK_CACHE_TAGS } from "@/sanity/lib/cache-tags";
import {
    getDynamicFetchOptions,
    sanityFetch,
    sanityFetchStaticParams,
    type DynamicFetchOptions
} from "@/sanity/lib/live";

type ProductPageProps = {
    params: Promise<{
        slug: string
    }>
}

type CachedProductPageProps =
    Awaited<ProductPageProps["params"]> &
    DynamicFetchOptions;

export async function generateStaticParams() {
    const { data } = await sanityFetchStaticParams({
        query: productSlugsQuery
    })

    console.log('[BUILD-RUNTIME]', { data });

    return data;
}

async function CachedProductPage({
    slug,
    perspective,
    stega
}: CachedProductPageProps) {
    "use cache";

    console.log('[THREE-LAYER][3 CACHED]', { slug, perspective, stega });

    const { data: product } = await sanityFetch({
        query: productBySlugQuery,
        params: { slug },
        perspective,
        stega,
        tags: [
            SANITY_WEBHOOK_CACHE_TAGS.product
        ]
    });

    if (!product) {
        notFound();
    }

    const primaryImage = product.images?.[0];

    return (
        <main>
            <article>
                <h1>{product.title}</h1>
                {product.excerpt && <p>{product.excerpt}</p>}

                {product.content?.length ? (
                    <section>
                        <PortableText value={product.content} />
                    </section>
                ) : null}

                {primaryImage?.asset ? (
                    <Image
                        src={urlFor(primaryImage).width(1200).height(800).fit('crop').auto('format').url()}
                        alt={product.title}
                        width={1200}
                        height={800}
                        quality={75}
                        sizes="(max-width: 768px) 100vw 1200px"
                        loading="eager"
                    />
                ) : null}

                {product.relatedProducts?.length ? (
                    <section>
                        <h2>Related products</h2>

                        <ul>
                            {product.relatedProducts.map((relatedProduct) => {
                                if (!relatedProduct?.slug) {
                                    return;
                                }

                                return (
                                    <li key={relatedProduct._id}>
                                        <Link href={`/products/${stegaClean(relatedProduct.slug)}`}>
                                            {relatedProduct.title}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </section>
                ) : null}
            </article>
        </main>
    );
}

async function DynamicProductPage({
    params,
}: ProductPageProps) {
    const [
        { slug },
        { perspective, stega }
    ] = await Promise.all([
        params,
        getDynamicFetchOptions()
    ]);

    console.log('[THREE-LAYER][2 DYNAMIC]', { slug, perspective, stega });

    return (
        <CachedProductPage slug={slug} perspective={perspective} stega={stega} />
    );
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { isEnabled: isDraftMode } = await draftMode();

    console.log('[THREE-LAYER][1 ORCHESTRATOR]', { isDraftMode });

    if (isDraftMode) {
        return (
            <Suspense fallback={<main><p>Loading product...</p></main>}>
                <DynamicProductPage params={params} />
            </Suspense>
        );
    }

    const { slug } = await params;

    return (
        <CachedProductPage slug={slug} perspective="published" stega={false} />
    );
}