import { notFound } from "next/navigation";

import { client } from "@/sanity/lib/client";
import { pageBySlugQuery } from "@/sanity/lib/queries";

type ContentPageProps = {
    params: Promise<{
        slug: string
    }>
}

export default async function ContentPage({ params }: ContentPageProps) {
    const { slug } = await params;

    const page = await client.fetch(pageBySlugQuery, {
        slug,
    });

    if (!page) {
        notFound();
    }

    return (
        <main>
            <article>
                <p>Page</p>
                <h1>{page.title}</h1>
                <p>Slug: {page.slug}</p>
            </article>
        </main>
    );
}