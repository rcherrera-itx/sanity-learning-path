import { defineField, defineType } from "sanity";

export const store = defineType({
    name: 'store',
    title: 'Store',
    type: 'object',
    fields: [
        defineField({
            name: 'gid',
            title: 'GID',
            type: 'string'
        }),
        defineField({
            name: 'handle',
            title: 'Handle',
            type: 'string'
        }),
        defineField({
            name: 'status',
            title: 'Status',
            type: 'string'
        }),
        defineField({
            name: 'updatedAt',
            title: 'Updated At',
            type: 'datetime'
        })
    ]
})