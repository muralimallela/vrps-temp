import { useEffect, useRef, useState } from "react";

export function useHideOnScroll(opts?: { delta?: number; revealTop?: number }) {
    const delta = opts?.delta ?? 8;
    const revealTop = opts?.revealTop ?? 80;
    const lastY = useRef(0);
    const [hidden, setHidden] = useState(false);
    const [atTop, setAtTop] = useState(true);

    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY || 0;
            setAtTop(y < 10);

            const diff = y - lastY.current;
            if (Math.abs(diff) < delta) return;

            if (y < revealTop || diff < 0) {
                setHidden(false);
            } else if (diff > 0) {
                setHidden(true);
            }
            lastY.current = y;
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [delta, revealTop]);

    return { hidden, atTop };
}
