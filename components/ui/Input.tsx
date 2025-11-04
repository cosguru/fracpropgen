
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => {
    return (
        <div>
            <label htmlFor={props.name} className="block text-sm font-medium text-slate-700 mb-1">
                {label}
            </label>
            <input
                {...props}
                id={props.name}
                className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brandGreen-500 focus:border-brandGreen-500 sm:text-sm transition duration-150 ease-in-out"
            />
        </div>
    );
};

export default Input;