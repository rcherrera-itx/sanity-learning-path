import { defineField, defineType } from "sanity";

export const product = defineType({
    name: 'product',
    title: 'Product',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'slug',
            title: 'slug',
            type: 'slug',
            options: {
                source: 'title'
            },
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'excerpt',
            title: 'Excerpt',
            type: 'text',
            validation: (rule) => rule.max(200)
        }),
        defineField({
            name: 'content',
            title: 'Content',
            type: 'array',
            of: [{
                type: 'block'
            }]
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
        }),
        defineField({
            name: 'relatedProducts',
            title: 'Related Products',
            type: 'array',
            of: [{
                type: 'reference',
                to: [{
                    type: 'product'
                }]
            }]
        }),
        defineField({
            name: 'store',
            title: 'Store',
            type: 'store'
        }),
        // defineField({
        //     name: 'active',
        //     title: 'Active',
        //     type: 'boolean'
        // }),
        // defineField({
        //     name: 'tags',
        //     title: 'Tags',
        //     type: 'array',
        //     of: [
        //         {
        //             type: 'string'
        //         }
        //     ]
        // }),
    ],
})