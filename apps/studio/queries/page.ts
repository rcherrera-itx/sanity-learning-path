import { defineQuery } from "groq";


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