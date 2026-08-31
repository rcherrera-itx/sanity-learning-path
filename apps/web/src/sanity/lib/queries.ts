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
            "image": images[0]
        }
    }
`);

export const productSlugsQuery = defineQuery(`
    *[
        _type == "product"
        &&
        defined(slug.current)
    ]{
        "slug": slug.current    
    }
`);

export const pageSlugsQuery = defineQuery(`
    *[
        _type == "page"
        &&
        defined(slug.current)
    ]{
        "slug": slug.current    
    }
`);

export const productEditorialByHandleQuery = defineQuery(`
    *[
        _type == "product"
        &&
        slug.current == $handle
    ]
    | order(_updated_at desc)
    [0]
    {
        _id,
        "handle": slug.current,
        "editorialTitle": title,
        excerpt,
        content,
        "editorialImage": images[0]
    }
`);