
import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    onSuggestionClick?: () => void;
    isSuggestionLoading?: boolean;
}

const MagicWandIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v1.046l1.646-.353a1 1 0 011.11 1.645l-.46 2.094a1 1 0 01-1.852.504l-.26-1.182-.353 1.646a1 1 0 01-1.853-.504l.46-2.094a1 1 0 01.38-.815l-.26 1.183a1 1 0 01-1.853-.504l.46-2.094a1 1 0 011.11-1.645L12 3.046V2a1 1 0 01-.7-.954zM5 4a1 1 0 011-1 3 3 0 013 3 1 1 0 01-2 0 1 1 0 00-1-1 1 1 0 01-1-1zM3 9a1 1 0 011-1 1 1 0 001-1 1 1 0 112 0 1 1 0 001 1 1 1 0 110 2 1 1 0 00-1 1 1 1 0 11-2 0 1 1 0 00-1-1 1 1 0 01-1-1zM.46 12.353a1 1 0 011.11-1.645l1.646.353-.26-1.182a1 1 0 011.852-.504l.46 2.094a1 1 0 01-1.853.504l-.26-1.183.353 1.646a1 1 0 01-1.853.504l-.46-2.094a1 1 0 01.38-.815l-.26 1.183a1 1 0 01-1.853-.504l.46-2.094a1 1 0 011.11-1.645L4 12.954V12a1 1 0 112 0v.954l.353-1.646a1 1 0 011.853.504l-.46 2.094a1 1 0 01-1.11 1.645l-1.646-.353.26 1.182a1 1 0 01-1.852.504l-.46-2.094a1 1 0 01-.38-.815l.26-1.183a1 1 0 01-1.853-.504l-.46 2.094a1 1 0 01-1.11 1.645L2 12.954V14a1 1 0 11-2 0v-.954l-.353 1.646a1 1 0 01-1.853-.504l.46-2.094z" clipRule="evenodd" />
    </svg>
)

const Textarea: React.FC<TextareaProps> = ({ label, onSuggestionClick, isSuggestionLoading, ...props }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <label htmlFor={props.name} className="block text-sm font-medium text-slate-700">
                    {label}
                </label>
                {onSuggestionClick && (
                    <button
                        type="button"
                        onClick={onSuggestionClick}
                        disabled={isSuggestionLoading}
                        className="flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 disabled:text-slate-400 disabled:cursor-wait transition-colors"
                    >
                        {isSuggestionLoading ? (
                           <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                           </svg>
                        ) : (
                           <MagicWandIcon />
                        )}
                        <span className="ml-1">{isSuggestionLoading ? 'Improving...' : 'Improve with AI'}</span>
                    </button>
                )}
            </div>
            <textarea
                {...props}
                id={props.name}
                className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
            />
        </div>
    );
};

export default Textarea;
