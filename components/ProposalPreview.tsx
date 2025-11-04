
import React, { useLayoutEffect, useRef } from 'react';
import { GeneratedProposal } from '../types';

interface ProposalPreviewProps {
    proposal: GeneratedProposal;
    onAboutChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    brandColor: string;
}

const Section: React.FC<{ title: string; children: React.ReactNode; brandColor: string; }> = ({ title, children, brandColor }) => (
    <div className="mb-6 last:mb-0">
        <h3 
            className="text-lg font-bold font-display mb-3 pb-2 border-b"
            style={{ color: brandColor, borderColor: brandColor }}
        >
            {title}
        </h3>
        <div className="prose prose-slate max-w-none text-slate-700">
            {children}
        </div>
    </div>
);

const ProposalPreview: React.FC<ProposalPreviewProps> = ({ proposal, onAboutChange, brandColor }) => {
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
            <h2 className="text-3xl font-bold font-display text-center text-slate-900 mb-8">{proposal.title}</h2>
            
            <Section title="Executive Summary" brandColor={brandColor}>
                <p>{proposal.executiveSummary}</p>
            </Section>
            
            <Section title="Understanding the Challenge" brandColor={brandColor}>
                <p>{proposal.problemStatement}</p>
            </Section>

            <Section title="Proposed Solution & Scope of Work" brandColor={brandColor}>
                <ul>
                    {proposal.proposedSolution.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </Section>

            <Section title="Measuring Success" brandColor={brandColor}>
                <ul>
                    {proposal.measuringSuccess.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </Section>

            <Section title="Exclusions (Out of Scope)" brandColor={brandColor}>
                <ul>
                    {proposal.exclusions.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </Section>

            <Section title="90-Day Plan" brandColor={brandColor}>
                 <ul>
                    {proposal.ninetyDayPlan.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </Section>

            <Section title="Timeline" brandColor={brandColor}>
                <p>{proposal.timeline}</p>
            </Section>

            <Section title="Investment" brandColor={brandColor}>
                <p>{proposal.investment}</p>
            </Section>
            
            <Section title="Client Responsibilities" brandColor={brandColor}>
                <ul>
                    {proposal.clientResponsibilities.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </Section>

            <Section title="About" brandColor={brandColor}>
                <textarea
                    ref={aboutTextareaRef}
                    value={proposal.about}
                    onChange={handleTextareaChange}
                    className="w-full p-0 border-none focus:ring-0 resize-none prose prose-slate max-w-none text-slate-700 focus:outline-none bg-transparent"
                    aria-label="About section text"
                />
            </Section>

            <Section title="Next Steps" brandColor={brandColor}>
                <p>{proposal.nextSteps}</p>
            </Section>
        </div>
    );
};

export default ProposalPreview;
