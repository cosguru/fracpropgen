import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';

interface SuggestionPopoverProps {
    targetElement: HTMLElement;
    suggestions: string[];
    onSelect: (suggestion: string) => void;
    onClose: () => void;
}

const SuggestionPopover: React.FC<SuggestionPopoverProps> = ({ targetElement, suggestions, onSelect, onClose }) => {
    const popoverRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

    useLayoutEffect(() => {
        if (targetElement) {
            const rect = targetElement.getBoundingClientRect();
            setPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
            });
        }
    }, [targetElement]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node) && event.target !== targetElement) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose, targetElement]);

    return (
        <div
            ref={popoverRef}
            className="absolute z-20 mt-1 bg-white rounded-md shadow-lg border border-slate-200 animate-fade-in-up"
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
                width: `${position.width}px`,
            }}
        >
            <ul className="py-1 max-h-60 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                    <li key={index}>
                        <button
                            type="button"
                            onClick={() => onSelect(suggestion)}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-900"
                        >
                            {suggestion}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SuggestionPopover;
