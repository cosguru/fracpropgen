
import React, { useLayoutEffect, useRef } from 'react';
import { GeneratedProposal } from '../types';

interface ProposalPreviewProps {
    proposal: GeneratedProposal;
    onAboutChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6 last:mb-0">
        <h3 className="text-lg font-semibold text-slate-900 mb-3 pb-2 border-b border-slate-200">{title}</h3>
        <div className="prose prose-slate max-w-none text-slate-700">
            {children}
        </div>
    </div>
);

const ProposalPreview: React.FC<ProposalPreviewProps> = ({ proposal, onAboutChange }) => {
    const aboutTextareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustTextareaHeight = (element: HTMLTextAreaElement | null) => {
        if (element) {
            element.style.height = 'auto';
            element.style.height = `${element.scrollHeight}px`;
        }
    };

    useLayoutEffect(() => {
        adjustTextareaHeight(aboutTextareaRef.current);
    }, [proposal.about]);

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        adjustTextareaHeight(e.target);
        onAboutChange(e);
    };

    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-8">{proposal.title}</h2>
            
            <Section title="Executive Summary">
                <p>{proposal.executiveSummary}</p>
            </Section>
            
            <Section title="Understanding the Challenge">
                <p>{proposal.problemStatement}</p>
            </Section>

            <Section title="Proposed Solution & Scope of Work">
                <ul>
                    {proposal.proposedSolution.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </Section>

            <Section title="Timeline">
                <p>{proposal.timeline}</p>
            </Section>

            <Section title="Investment">
                <p>{proposal.investment}</p>
            </Section>

            <Section title="About">
                <textarea
                    ref={aboutTextareaRef}
                    value={proposal.about}
                    onChange={handleTextareaChange}
                    className="w-full p-0 border-none focus:ring-0 resize-none prose prose-slate max-w-none text-slate-700 focus:outline-none bg-transparent"
                    aria-label="About section text"
                />
            </Section>

            <Section title="Next Steps">
                <p>{proposal.nextSteps}</p>
            </Section>
        </div>
    );
};

export default ProposalPreview;
