
import React, { useRef, useEffect } from 'react';

interface SuggestionPopoverProps {
    suggestions: string[];
    onSelect: (suggestion: string) => void;
    onClose: () => void;
}

const SuggestionPopover: React.FC<SuggestionPopoverProps> = ({ suggestions, onSelect, onClose }) => {
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    return (
        <div
            ref={popoverRef}
            className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-slate-200 max-h-48 overflow-y-auto"
            role="listbox"
        >
            <ul className="divide-y divide-slate-100">
                {suggestions.map((suggestion, index) => (
                    <li
                        key={index}
                        onClick={() => onSelect(suggestion)}
                        className="px-3 py-2 text-sm text-slate-700 cursor-pointer hover:bg-slate-50"
                        role="option"
                        aria-selected="false"
                    >
                        {suggestion}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SuggestionPopover;
