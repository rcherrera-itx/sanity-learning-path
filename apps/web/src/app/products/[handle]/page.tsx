import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PortableText } from "next-sanity";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";

import { getProductByHandle, type StorefrontProduct } from "@/shopify/queries/product";
import { getProductEditorialByHandle } from "@/sanity/lib/product-editorial";
import type { ProductEditorialByHandleQueryResult } from "@/sanity/types";
import { AddToCartForm } from "@/app/components/add-to-cart-form";
import { getCachedProductCatalogByHandle, type StorefrontProductCatalog } from "@/shopify/queries/product-catalog";


type ContentPageProps = {
    params: Promise<{
        handle: string
    }>
}

async function getEditorialProduct(handle: string): Promise<ProductEditorialByHandleQueryResult> {
    try {
        return await getProductEditorialByHandle(handle);
    } catch (error) {
        console.error("[SANITY][PRODUCT_BY_HANDLE][DEGRADED]", {
            handle,
            message: error instanceof Error ? error.message : "Unknown error"
        });

        return null;
    }
}

async function ProductComposition({
    params
}: ContentPageProps) {
    const { handle } = await params;

    let product: StorefrontProduct | null;
    let catalog: StorefrontProductCatalog | null;

    try {
        [product, catalog] = await Promise.all([
            getProductByHandle(handle),
            getCachedProductCatalogByHandle(handle)
        ]);
    } catch (error) {
        console.error("[SHOPIFY][PRODUCT_BY_HANDLE][FAILED]", {
            handle,
            message: error instanceof Error ? error.message : "Unknown error"
        });

        throw new Error('Product Source Unavailable');
    }

    if (!product || !catalog) {
        notFound();
    }

    const editorial = await getEditorialProduct(handle);

    return (
        <main>
            <article>
                <header>
                    <h1>{catalog.title}</h1>

                    {catalog.description ? (
                        <p>{catalog.description}</p>
                    ) : null}
                </header>
                <dl>
                    <div>
                        <dt>Handle: </dt>
                        <dd>{catalog.handle}</dd>
                    </div>
                    <div>
                        <dt>Availability:</dt>
                        <dd>
                            {product.availableForSale ? "Available" : "Not available"}
                        </dd>
                    </div>
                </dl>

                {catalog.featuredImage ? (
                    <Image
                        src={catalog.featuredImage.url}
                        alt={catalog.featuredImage.altText ?? catalog.title}
                        width={catalog.featuredImage.width ?? 1200}
                        height={catalog.featuredImage.height ?? 1200}
                        sizes="(max-width: 768px) 100vw, 1200px"
                        loading="eager"
                    />
                ) : null}

                <AddToCartForm variants={product.variants.nodes} />
                <Link href="/cart">View cart</Link>

                {editorial ? (
                    <section>
                        <h2>{editorial.editorialTitle}</h2>
                        {editorial.excerpt ? (
                            <p>{editorial.excerpt}</p>
                        ) : null}

                        {editorial.content?.length ? (
                            <section>
                                <PortableText value={editorial.content} />
                            </section>
                        ) : null}

                        {editorial?.editorialImage?.asset ? (
                            <Image
                                src={urlFor(editorial.editorialImage).width(1200).height(800).fit('crop').auto('format').url()}
                                alt={editorial.editorialTitle}
                                width={1200}
                                height={800}
                                sizes="(max-width: 768px) 100vw, 1200px"
                                loading="eager"
                            />
                        ) : null}
                    </section>
                ) : (
                    <section>
                        <p>Editorial Content is not available for this product.</p>
                    </section>
                )}
            </article>
        </main>
    );
}


export default function ProductPage({ params }: ContentPageProps) {
    return (
        <Suspense fallback={<main>Loading page...</main>}>
            <ProductComposition params={params} />
        </Suspense>
    );
}