import { defineField, defineType } from "sanity";

export const product = defineType({
    name: 'product',
    title: 'Product',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string'
        }),
        defineField({
            name: 'slug',
            title: 'slug',
            type: 'slug',
            options: {
                source: 'title'
            }
        }),
        defineField({
            name: 'excerpt',
            title: 'Excerpt',
            type: 'text'
        }),
        defineField({
            name: 'active',
            title: 'Active',
            type: 'boolean'
        }),
        defineField({
            name: 'store',
            title: 'Store',
            type: 'store'
        }),
        defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [
                {
                    type: 'string'
                }
            ]
        }),
        defineField({
            name: 'images',
            title: 'Images',
            type: 'array',
            of: [
                {
                    type: 'image'
                }
            ]
        })
    ],
})