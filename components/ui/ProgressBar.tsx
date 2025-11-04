
import React from 'react';

interface ProgressBarProps {
    progress: number;
    brandColor: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, brandColor }) => {
    const cappedProgress = Math.min(Math.max(progress, 0), 100);
    
    return (
        <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div 
                className="h-2.5 rounded-full transition-all duration-300 ease-linear" 
                style={{ width: `${cappedProgress}%`, backgroundColor: brandColor }}
                aria-valuenow={cappedProgress}
                aria-valuemin={0}
                aria-valuemax={100}
                role="progressbar"
            ></div>
        </div>
    );
};

export default ProgressBar;
