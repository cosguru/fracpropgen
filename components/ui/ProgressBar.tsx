
import React from 'react';

interface ProgressBarProps {
    progress: number;
    brandColor: string;
}

const colorClasses: Record<string, string> = {
    indigo: 'bg-indigo-600',
    slate: 'bg-slate-600',
    green: 'bg-green-600',
    rose: 'bg-rose-600',
    amber: 'bg-amber-600',
};


const ProgressBar: React.FC<ProgressBarProps> = ({ progress, brandColor }) => {
    const cappedProgress = Math.min(Math.max(progress, 0), 100);
    const color = colorClasses[brandColor] || colorClasses.indigo;
    
    return (
        <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div 
                className={`${color} h-2.5 rounded-full transition-all duration-300 ease-linear`}
                style={{ width: `${cappedProgress}%` }}
                aria-valuenow={cappedProgress}
                aria-valuemin={0}
                aria-valuemax={100}
                role="progressbar"
            ></div>
        </div>
    );
};

export default ProgressBar;
