import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PortableText } from "next-sanity";

import { getProductByHandle } from "@/shopify/queries/product";
import { getProductEditorialByHandle } from "@/sanity/lib/product-editorial";

type ContentPageProps = {
    params: Promise<{
        handle: string
    }>
}

async function ProductComposition({
    params
}: ContentPageProps) {
    const { handle } = await params;

    const [product, editorial] = await Promise.all([
        getProductByHandle(handle),
        getProductEditorialByHandle(handle)
    ])

    if (!product) {
        notFound();
    }

    return (
        <main>
            <article>
                <header>
                    <h1>{product.title}</h1>

                    {product.description ? (
                        <p>{product.description}</p>
                    ) : null}
                </header>
                <dl>
                    <div>
                        <dt>Handle: </dt>
                        <dd>{product.handle}</dd>
                    </div>
                    <div>
                        <dt>Availability:</dt>
                        <dd>
                            {product.availableForSale ? "Available" : "Not available"}
                        </dd>
                    </div>
                </dl>

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