import { notFound } from "next/navigation";

import { client } from "@/sanity/lib/client";
import { productBySlugQuery } from "@/sanity/lib/queries";
import Link from "next/link";
import { PortableText } from "next-sanity";

type ProductPageProps = {
    params: Promise<{
        slug: string
    }>
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;

    console.log(slug);

    const product = await client.fetch(productBySlugQuery, {
        slug,
    });

    console.log(product);

    if (!product) {
        notFound();
    }

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
                                        <Link href={`/products/${relatedProduct.slug}`}>
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