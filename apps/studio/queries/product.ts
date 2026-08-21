import { defineQuery } from "groq";


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