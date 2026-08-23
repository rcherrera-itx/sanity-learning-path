import { notFound } from "next/navigation";

import { client } from "@/sanity/lib/client";
import { productBySlugQuery } from "@/sanity/lib/queries";

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
                <p>Product</p>
                <h1>{product.title}</h1>
                <p>Slug: {product.slug}</p>
            </article>
        </main>
    );
}