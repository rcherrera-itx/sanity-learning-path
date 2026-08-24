import { notFound } from "next/navigation";
import Link from "next/link";
import { PortableText } from "next-sanity";
import Image from 'next/image';

// import { client } from "@/sanity/lib/client";
import { productBySlugQuery } from "@/sanity/lib/queries";
import { urlFor } from '@/sanity/lib/image';
import { sanityFetch } from "@/sanity/lib/live";

type ProductPageProps = {
    params: Promise<{
        slug: string
    }>
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;
    // const product = await client.fetch(productBySlugQuery, {
    //     slug,
    // });

    const { data: product } = await sanityFetch({
        query: productBySlugQuery,
        params: { slug }
    })

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
                        alt="{product.title}"
                        width={1200}
                        height={800}
                        sizes="(max-width: 768px) 100vw 1200px"
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