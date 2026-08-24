import { client } from '@/sanity/lib/client'
import { defineEnableDraftMode } from 'next-sanity/draft-mode';

const token = process.env.SANITY_API_READ_TOKEN;

if(!token) {
    throw new Error(
        'Missing environment variable: SANITY_API_READ_TOKEN',
    );
}

export const { GET } = defineEnableDraftMode({
    client: client.withConfig({
        token,
    })
})