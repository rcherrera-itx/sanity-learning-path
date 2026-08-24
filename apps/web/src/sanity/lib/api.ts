// For Sanity Config Values
function required(
    value: string | undefined,
    variableName: string
): string {
    if(!value) {
        throw new Error(`Missing environment variable: ${variableName}`);
    }

    return value;
}

export const apiVersion= '2026-02-01';

export const dataset = required(
    process.env.NEXT_PUBLIC_SANITY_DATASET,
    'NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = required(
    process.env.NEXT_PUBLIC_SANITY_PROJECT,
    'NEXT_PUBLIC_SANITY_PROJECT'
)

export const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'http://localhost:3333';

