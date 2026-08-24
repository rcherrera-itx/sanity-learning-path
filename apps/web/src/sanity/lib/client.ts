// Client configuration that uses api.ts values
import { createClient } from "next-sanity";
import { 
    apiVersion, 
    dataset, 
    projectId,
    studioUrl
} from './api';

export const client = createClient({
    apiVersion,
    dataset,
    projectId,
    useCdn: true,
    stega: {
        studioUrl
    }
})