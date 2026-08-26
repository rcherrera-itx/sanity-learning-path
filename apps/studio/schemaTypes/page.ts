import { defineField, defineType } from "sanity";

export const page = defineType({
    name: 'page',
    title: 'Page',
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
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title'
            },
            validation: (rule) => rule.required()
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
            name: 'featuredProducts',
            title: 'Featured products',
            type: 'array',
            of: [{
                type: 'reference',
                to: [{
                    type: 'product'
                }]
            }]
        })
    ]
})