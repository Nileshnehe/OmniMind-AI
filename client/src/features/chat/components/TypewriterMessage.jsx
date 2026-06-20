import React, { useState, useEffect, useRef } from 'react';

/**
 * TypewriterMessage
 *
 * Props:
 *   text      – full string to animate
 *   speed     – ms per character (default 18)
 *   animate   – if false, shows full text instantly (for old messages)
 */
const TypewriterMessage = ({ text = '', speed = 18, animate = true }) => {
    const [displayedText, setDisplayedText] = useState(animate ? '' : text);
    const [isDone, setIsDone] = useState(!animate);
    const indexRef = useRef(animate ? 0 : text.length);

    useEffect(() => {
        // Skip animation for old messages
        if (!animate) {
            setDisplayedText(text);
            setIsDone(true);
            return;
        }

        // Reset on new text
        setDisplayedText('');
        setIsDone(false);
        indexRef.current = 0;

        if (!text) return;

        const interval = setInterval(() => {
            const i = indexRef.current;
            if (i < text.length) {
                setDisplayedText(text.slice(0, i + 1));
                indexRef.current += 1;
            } else {
                setIsDone(true);
                clearInterval(interval);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed, animate]);

    return (
        <span className="whitespace-pre-wrap break-words">
            {displayedText}
            {/* Blinking cursor while typing */}
            {!isDone && (
                <span
                    className="inline-block w-[2px] h-[1em] bg-current ml-[2px] align-middle"
                    style={{ animation: 'blink 0.7s step-end infinite' }}
                />
            )}
        </span>
    );
};

export default TypewriterMessage;
