import { defineQuery } from "next-sanity";

export const productBySlugQuery = defineQuery(`
    *[
        _type == 'product'
        &&
        slug.current == $slug
    ]
    | order(_updatedAt)
    [0] 
    {
        _id,
        title,
        "slug": slug.current,
        excerpt,
        content,
        images,
        store,

        relatedProducts[]->{
            _id,
            title,
            "slug": slug.current,
            excerpt,
            images
        }
    }
`);

export const pageBySlugQuery = defineQuery(`
    *[
        _type == 'page'
        &&
        slug.current == $slug
    ]
    | order(_updatedAt)
    [0] 
    {
        _id,
        title,
        "slug": slug.current,
        content,

        featuredProducts[]->{
            _id,
            title,
            "slug": slug.current,
            excerpt,
            images[]
        }
    }
`);