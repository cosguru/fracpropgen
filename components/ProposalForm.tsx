
import React from 'react';
import { ProposalFormInput } from '../types';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Button from './ui/Button';
import { templates } from '../data/templates';

interface ProposalFormProps {
    input: ProposalFormInput;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onTemplateChange: (templateId: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
}

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 3a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0V7H8a1 1 0 010-2h1V4a1 1 0 011-1zM5 9a1 1 0 00-1 1v1H3a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2H6v-1a1 1 0 00-1-1zm11-4a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0V7h1a1 1 0 100-2h-1V5z" />
    </svg>
)

const ProposalForm: React.FC<ProposalFormProps> = ({ input, onChange, onTemplateChange, onSubmit, isLoading }) => {
    const selectedTemplate = templates.find(t => t.id === input.templateId) || templates[0];

    const handleTemplateSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onTemplateChange(e.target.value);
    };
    
    return (
        <form onSubmit={onSubmit} className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-100 space-y-6">
            <div>
                <h2 className="text-xl font-bold font-display text-slate-800">1. Select a Template</h2>
                <p className="text-sm text-slate-500 mt-1">Choose a persona for the AI to adopt.</p>
            </div>

            <div>
                <label htmlFor="templateId" className="block text-sm font-medium text-slate-700 mb-1">Template</label>
                <select
                    id="templateId"
                    name="templateId"
                    value={input.templateId}
                    onChange={handleTemplateSelectionChange}
                    className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                >
                    {templates.map(template => (
                        <option key={template.id} value={template.id}>
                            {template.name}
                        </option>
                    ))}
                </select>

                {selectedTemplate && (
                    <div className="mt-3 p-3 bg-indigo-50 rounded-md text-sm text-indigo-800 border border-indigo-200 space-y-2">
                        <p>{selectedTemplate.description}</p>
                        <p className="text-xs opacity-80"><strong className="font-semibold">Persona:</strong> {selectedTemplate.systemInstruction}</p>
                    </div>
                )}
            </div>

            <div className="space-y-1 pt-4 border-t border-slate-200">
                <h2 className="text-xl font-bold font-display text-slate-800">2. Proposal Details</h2>
                <p className="text-sm text-slate-500">Provide the key information below.</p>
            </div>
            
            <Input 
                label="Your Name / Company" 
                name="executiveName"
                value={input.executiveName}
                onChange={onChange}
                placeholder="e.g., John Smith Consulting"
            />
            <Input 
                label="Your Role" 
                name="executiveRole"
                value={input.executiveRole}
                onChange={onChange}
                placeholder="e.g., Fractional CFO"
            />
            <Input 
                label="Client Name / Company" 
                name="clientName"
                value={input.clientName}
                onChange={onChange}
                placeholder="e.g., Innovate Corp"
            />
            <Textarea 
                label="Project Goal"
                name="projectGoal"
                value={input.projectGoal}
                onChange={onChange}
                placeholder="What is the primary objective for the client?"
                rows={3}
            />
             <Textarea 
                label="Key Deliverables"
                name="deliverables"
                value={input.deliverables}
                onChange={onChange}
                placeholder="List main deliverables, separated by commas"
                rows={3}
            />
            <Input 
                label="Timeline" 
                name="timeline"
                value={input.timeline}
                onChange={onChange}
                placeholder="e.g., 6-Month Engagement"
            />
             <Input 
                label="Pricing / Fee Structure" 
                name="price"
                value={input.price}
                onChange={onChange}
                placeholder="e.g., $8,000/month retainer"
            />
             <Textarea 
                label="About You / Company (Optional)"
                name="executiveAbout"
                value={input.executiveAbout}
                onChange={onChange}
                placeholder="Provide a brief bio, or let the AI generate one for you."
                rows={4}
            />

            <Button type="submit" isLoading={isLoading} icon={<SparklesIcon />} className="w-full">
                Generate Proposal
            </Button>
        </form>
    );
};

export default ProposalForm;