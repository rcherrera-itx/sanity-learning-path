import {
    defineDocuments,
    defineLocations,
    type PresentationPluginOptions
} from 'sanity/presentation';

const mainDocuments = defineDocuments([
    {
        route: '/products/:slug',
        filter: '_type == "product" && slug.current == $slug',
    },
    {
        route: '/:slug',
        filter: '_type == "page" && slug.current == $slug',
    }
])

const locations = {
    product: defineLocations({
        select: {
            title: 'title',
            slug: 'slug.current'
        },
        resolve: (document) => ({
            locations: document?.slug
                ? [
                    {
                        title: document.title || 'Product with no title',
                        href: `/products/${document.slug}`
                    }
                ]
                : [],
        }),
    }),
    page: defineLocations({
        select: {
            title: 'title',
            slug: 'slug.current'
        },
        resolve: (document) => ({
            locations: document?.slug
            ? [{
                title: document.title || 'Page without title',
                href: `/${document.slug}`
            }] : [],
        }),
    }),
}

export const resolve: PresentationPluginOptions['resolve'] = {
    mainDocuments,
    locations
}