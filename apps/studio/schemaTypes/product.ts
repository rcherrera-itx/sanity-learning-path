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
        })
    ],
})