'use client'

import { useIsPresentationTool } from 'next-sanity/hooks';

export function DisableDraftMode() {
    const isPresentationTool = useIsPresentationTool();

    if(!isPresentationTool) {
        return null;
    }

    return (
        <aside className='fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-full bg-black px-4 py-2 text-sm text-white shadow-lg'>
            <span>Active Draft Mode</span>

            <a href="/api/draft-mode/disable" className='underline'>Deactivate</a>
        </aside>
    )
}