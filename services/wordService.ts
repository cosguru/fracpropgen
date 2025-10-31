
import { 
    Document, 
    Packer, 
    Paragraph, 
    HeadingLevel, 
    TextRun, 
    AlignmentType,
    BorderStyle,
    WidthType,
} from 'docx';
import saveAs from 'file-saver';
import { GeneratedProposal } from '../types';

const createSection = (title: string, children: (Paragraph | TextRun)[]): Paragraph[] => {
    const heading = new Paragraph({
        children: [
            new TextRun({
                text: title,
                bold: true,
                size: 28, // 14pt
            }),
        ],
        spacing: { after: 200 },
        border: {
            bottom: {
                color: "auto",
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6,
            },
        },
    });

    const content = children.map(child => {
        if (child instanceof Paragraph) {
            return child;
        }
        return new Paragraph({ children: [child], spacing: { after: 150 } });
    });

    return [heading, ...content];
};


export const exportToDocx = (proposal: GeneratedProposal, clientName: string) => {
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    children: [
                        new TextRun({
                            text: proposal.title,
                            bold: true,
                            size: 44, // 22pt
                        }),
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 },
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `Prepared for: ${clientName}`,
                            size: 24, // 12pt
                        }),
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 800 },
                }),

                ...createSection("Executive Summary", [new TextRun(proposal.executiveSummary)]),
                ...createSection("Understanding the Challenge", [new TextRun(proposal.problemStatement)]),
                ...createSection("Proposed Solution & Scope of Work", proposal.proposedSolution.map(item => new Paragraph({
                    text: item,
                    bullet: { level: 0 },
                    indent: { left: 720, hanging: 360 },
                    spacing: { after: 150 },
                }))),
                ...createSection("Timeline", [new TextRun(proposal.timeline)]),
                ...createSection("Investment", [new TextRun(proposal.investment)]),
                ...createSection("About", [new TextRun(proposal.about)]),
                ...createSection("Next Steps", [new TextRun(proposal.nextSteps)]),
            ],
        }],
        styles: {
            paragraphStyles: [
                {
                    id: "Normal",
                    name: "Normal",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,
                    run: {
                        size: 22, // 11pt
                        font: "Inter",
                    },
                },
            ],
        },
    });

    Packer.toBlob(doc).then(blob => {
        saveAs(blob, `Proposal for ${clientName}.docx`);
    });
};