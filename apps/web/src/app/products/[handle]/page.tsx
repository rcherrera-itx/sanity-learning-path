import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PortableText } from "next-sanity";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

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

                {product.featuredImage ? (
                    <Image
                        src={product.featuredImage.url}
                        alt={product.featuredImage.altText ?? product.title}
                        width={product.featuredImage.width ?? 1200}
                        height={product.featuredImage.height ?? 1200}
                        sizes="(max-width: 768px) 100vw 1200px"
                        loading="eager"
                    />
                ) : null}

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
                                sizes="(max-width: 768px) 100vw 1200px"
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