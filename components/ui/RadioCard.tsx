
import React from 'react';

interface RadioCardProps extends React.InputHTMLAttributes<HTMLInputElement> {
    children: React.ReactNode;
}

const RadioCard: React.FC<RadioCardProps> = ({ id, children, ...props }) => {
    return (
        <div>
            <input 
                type="radio" 
                id={id} 
                className="sr-only peer" 
                {...props} 
            />
            <label 
                htmlFor={id} 
                className="
                    flex flex-col p-4 border-2 border-slate-200 rounded-lg 
                    cursor-pointer transition-colors duration-200
                    peer-checked:border-brandGreen-500 peer-checked:bg-brandGreen-50
                    hover:border-slate-300 hover:bg-slate-50
                "
            >
                {children}
            </label>
        </div>
    );
};

export default RadioCard;