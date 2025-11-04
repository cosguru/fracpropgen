import React, { useRef } from 'react';
import Spinner from './Spinner';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    onSuggestionClick?: (element: HTMLTextAreaElement) => void;
    isSuggesting?: boolean;
}

const SuggestionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        <path d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" transform="rotate(45 10 10)" />
    </svg>
);


const Textarea: React.FC<TextareaProps> = ({ label, onSuggestionClick, isSuggesting, ...props }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSuggestionClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (onSuggestionClick && textareaRef.current) {
            onSuggestionClick(textareaRef.current);
        }
    };

    return (
        <div className="relative">
            <div className="flex justify-between items-center mb-1">
                <label htmlFor={props.name} className="block text-sm font-medium text-slate-700">
                    {label}
                </label>
                {onSuggestionClick && (
                     <button
                        type="button"
                        onClick={handleSuggestionClick}
                        disabled={isSuggesting}
                        className="flex items-center px-2 py-1 text-xs font-semibold text-indigo-700 bg-indigo-100 rounded-full hover:bg-indigo-200 disabled:bg-slate-200 disabled:text-slate-500 disabled:cursor-wait transition-colors"
                        title="Improve with AI"
                    >
                       {isSuggesting ? (
                           <Spinner />
                       ) : (
                           <SuggestionIcon />
                       )}
                        <span className="ml-1">Improve</span>
                    </button>
                )}
            </div>
            <textarea
                ref={textareaRef}
                {...props}
                id={props.name}
                className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
            />
        </div>
    );
};

export default Textarea;
