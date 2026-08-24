import Link from "next/link";
import Image from 'next/image';
import { notFound } from "next/navigation";

// import { client } from "@/sanity/lib/client";
import { urlFor } from '@/sanity/lib/image';
import { pageBySlugQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";

type ContentPageProps = {
    params: Promise<{
        slug: string
    }>
}

export default async function ContentPage({ params }: ContentPageProps) {
    const { slug } = await params;

    // const page = await client.fetch(pageBySlugQuery, {
    //     slug,
    // });

    const { data: page } = await sanityFetch({
        query: pageBySlugQuery,
        params: { slug }
    })

    if (!page) {
        notFound();
    }

    return (
        <main>
            <article>
                <h1>{page.title}</h1>

                {page.content?.length ? (
                    <section>
                        <h2>Featured Products</h2>

                        <ul>
                            {page.featuredProducts?.map((product) => {
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
                                                sizes="(max-width: 768px) 100vw 600 px"
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