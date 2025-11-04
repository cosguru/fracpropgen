
import React, { useState } from 'react';
import { ProposalFormInput } from '../types';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Button from './ui/Button';
import RadioCard from './ui/RadioCard';
import SuggestionPopover from './ui/SuggestionPopover';
import { generateSuggestions } from '../services/geminiService';
import { templates } from '../data/templates';

interface ProposalFormProps {
    input: ProposalFormInput;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onTemplateChange: (templateId: string) => void;
    onBrandColorChange: (color: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
}

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 2a1 1 0 00-1 1v1H3a1 1 0 000 2h1v1a1 1 0 002 0V6h1a1 1 0 100-2H6V3a1 1 0 00-1-1zm11 1a1 1 0 00-1 1v1h-1a1 1 0 100 2h1v1a1 1 0 102 0V6h1a1 1 0 100-2h-1V3a1 1 0 00-1-1zM5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414L11.414 12l3.293 3.293a1 1 0 01-1.414 1.414L10 13.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586 12 5.293 8.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
)

const brandColors = [
    { name: 'indigo', hex: '#6366F1' },
    { name: 'slate', hex: '#64748B' },
    { name: 'green', hex: '#22C55E' },
    { name: 'rose', hex: '#F43F5E' },
    { name: 'amber', hex: '#F59E0B' },
];

const ProposalForm: React.FC<ProposalFormProps> = ({ input, onChange, onTemplateChange, onBrandColorChange, onSubmit, isLoading }) => {
    const selectedTemplate = templates.find(t => t.id === input.templateId) || templates[0];
    const [suggestions, setSuggestions] = useState<{ for: string; values: string[] } | null>(null);
    const [isSuggestionLoading, setIsSuggestionLoading] = useState<string | null>(null);

    const handleTemplateSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onTemplateChange(e.target.value);
    };

    const handleSuggestionRequest = async (fieldName: 'projectGoal' | 'deliverables', currentText: string) => {
        if (!currentText.trim()) return;
        setIsSuggestionLoading(fieldName);
        setSuggestions(null);
        try {
            const result = await generateSuggestions(currentText);
            setSuggestions({ for: fieldName, values: result });
        } catch (error) {
            console.error(`Failed to get suggestions for ${fieldName}`, error);
        } finally {
            setIsSuggestionLoading(null);
        }
    };
    
    const handleSuggestionSelect = (fieldName: string, value: string) => {
        onChange({
            target: { name: fieldName, value }
        } as React.ChangeEvent<HTMLTextAreaElement>);
        setSuggestions(null);
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
                <h2 className="text-xl font-bold font-display text-slate-800">2. Brand Customization</h2>
                <p className="text-sm text-slate-500">Select an accent color for headings in the proposal.</p>
            </div>

            <div className="grid grid-cols-5 gap-3">
                {brandColors.map(color => (
                     <RadioCard key={color.name} name="brandColor" id={`color-${color.name}`} value={color.name} checked={input.brandColor === color.name} onChange={() => onBrandColorChange(color.name)}>
                        <div className="flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full" style={{ backgroundColor: color.hex }}></div>
                        </div>
                    </RadioCard>
                ))}
            </div>

            <div className="space-y-1 pt-4 border-t border-slate-200">
                <h2 className="text-xl font-bold font-display text-slate-800">3. Proposal Details</h2>
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
            <div className="relative">
                <Textarea 
                    label="Project Goal"
                    name="projectGoal"
                    value={input.projectGoal}
                    onChange={onChange}
                    placeholder="What is the primary objective for the client?"
                    rows={3}
                    onSuggestionClick={() => handleSuggestionRequest('projectGoal', input.projectGoal)}
                    isSuggestionLoading={isSuggestionLoading === 'projectGoal'}
                />
                {suggestions?.for === 'projectGoal' && (
                    <SuggestionPopover
                        suggestions={suggestions.values}
                        onSelect={(value) => handleSuggestionSelect('projectGoal', value)}
                        onClose={() => setSuggestions(null)}
                    />
                )}
            </div>
             <div className="relative">
                <Textarea 
                    label="Key Deliverables"
                    name="deliverables"
                    value={input.deliverables}
                    onChange={onChange}
                    placeholder="List main deliverables, separated by commas"
                    rows={3}
                    onSuggestionClick={() => handleSuggestionRequest('deliverables', input.deliverables)}
                    isSuggestionLoading={isSuggestionLoading === 'deliverables'}
                />
                 {suggestions?.for === 'deliverables' && (
                    <SuggestionPopover
                        suggestions={suggestions.values}
                        onSelect={(value) => handleSuggestionSelect('deliverables', value)}
                        onClose={() => setSuggestions(null)}
                    />
                )}
            </div>
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
