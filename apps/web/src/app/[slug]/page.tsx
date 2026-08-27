import Link from "next/link";
import Image from 'next/image';
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { Suspense } from "react";

import { urlFor } from '@/sanity/lib/image';
import { pageBySlugQuery, pageSlugsQuery } from "@/sanity/lib/queries";
import { getDynamicFetchOptions, sanityFetch, sanityFetchStaticParams, type DynamicFetchOptions } from "@/sanity/lib/live";

type ContentPageProps = {
    params: Promise<{
        slug: string
    }>
}

type CachedContentPageProps =
    Awaited<ContentPageProps["params"]> &
    DynamicFetchOptions;

export async function generateStaticParams() {
    const { data } = await sanityFetchStaticParams({
        query: pageSlugsQuery,
    });

    // console.log('[BUILD-RUNTIME]', { data });

    return data;
}

async function CachedContentPage({
    slug, perspective, stega
}: CachedContentPageProps) {
    "use cache";

    console.log('[THREE-LAYER][3 CACHED]', { slug, perspective, stega });

    const { data: page } = await sanityFetch({
        query: pageBySlugQuery,
        params: { slug },
        perspective,
        stega
    });

    if (!page) {
        notFound();
    }

    return (
        <main>
            <article>
                <h1>{page.title}</h1>

                {page.featuredProducts?.length ? (
                    <section>
                        <h2>Featured Products</h2>

                        <ul>
                            {page.featuredProducts.map((product) => {
                                if (!product?.slug) {
                                    return null;
                                }

                                return (
                                    <li key={product._id}>
                                        {product.image?.asset ? (
                                            <Image
                                                src={urlFor(product.image).width(600).height(400).fit('crop').auto('format').url()}
                                                alt={product.title}
                                                width={600}
                                                height={400}
                                                sizes="(max-width: 768px) 100vw 600px"
                                                loading="eager"
                                            />
                                        ) : null}

                                        <h3>
                                            <Link href={`/products/${product.slug}`}>
                                                {product.title}
                                            </Link>
                                        </h3>

                                        {product.excerpt && (<p>{product.excerpt}</p>)}
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

async function DynamicContentPage({
    params
}: ContentPageProps) {
    const [
        { slug },
        dynamicFetchOptions
    ] = await Promise.all([
        params,
        getDynamicFetchOptions()
    ]);

    console.log('[THREE-LAYER][2 DYNAMIC]', { slug });

    return (
        <CachedContentPage slug={slug} {...dynamicFetchOptions} />
    );
}

export default async function ContentPage({ params }: ContentPageProps) {
    const { isEnabled: isDraftMode } = await draftMode();

    console.log('[THREE-LAYER][1 ORCHESTRATOR]', { isDraftMode });

    if (isDraftMode) {
        return (
            <Suspense fallback={<main>Loading page...</main>}>
                <DynamicContentPage params={params} />
            </Suspense>
        );
    }

    const { slug } = await params;

    return (
        <CachedContentPage slug={slug} perspective="published" stega={false} />
    );
}