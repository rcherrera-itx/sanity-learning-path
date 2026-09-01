"use client";

export default function ProductError({
    reset
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return(
        <main>
            <h1>We couldn&apos;t load this product right now.</h1>
            <p>The commercial data source is temporarily unavailabe.</p>
            <button onClick={() => reset()}>Try again.</button>
        </main>
    );
}