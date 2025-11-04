
import { 
    Document, 
    Packer, 
    Paragraph, 
    HeadingLevel, 
    TextRun, 
    AlignmentType,
    BorderStyle,
    WidthType,
    Table,
    TableRow,
    TableCell,
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

const createSignatureBlock = (clientName: string, executiveName: string, executiveRole: string): Table => {
    const signatureLine = new Paragraph({
        children: [new TextRun({ text: "____________________________", size: 22 })],
        spacing: { before: 200 },
    });
    
    return new Table({
        columnWidths: [4535, 4535],
        borders: {
            top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        },
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        children: [
                            new Paragraph({ text: "For Client:", spacing: { after: 100 } }),
                            signatureLine,
                            new Paragraph({ text: `Name: ${clientName}` }),
                            new Paragraph({ text: "Title: " }),
                            new Paragraph({ text: "Date: " }),
                        ],
                        width: { size: 4535, type: WidthType.DXA },
                    }),
                    new TableCell({
                        children: [
                            new Paragraph({ text: "For Consultant:", spacing: { after: 100 } }),
                            signatureLine,
                            new Paragraph({ text: `Name: ${executiveName}` }),
                            new Paragraph({ text: `Title: ${executiveRole}` }),
                            new Paragraph({ text: "Date: " }),
                        ],
                        width: { size: 4535, type: WidthType.DXA },
                    }),
                ],
            }),
        ],
    });
};

const createBulletedList = (items: string[]) => items.map(item => new Paragraph({
    text: item,
    bullet: { level: 0 },
    indent: { left: 720, hanging: 360 },
    spacing: { after: 150 },
}));


export const exportToDocx = (proposal: GeneratedProposal, clientName: string, executiveName: string, executiveRole: string) => {
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
                ...createSection("Proposed Solution & Scope of Work", createBulletedList(proposal.proposedSolution)),
                ...createSection("Measuring Success", createBulletedList(proposal.measuringSuccess)),
                ...createSection("Exclusions (Out of Scope)", createBulletedList(proposal.exclusions)),
                ...createSection("90-Day Plan", createBulletedList(proposal.ninetyDayPlan)),
                ...createSection("Timeline", [new TextRun(proposal.timeline)]),
                ...createSection("Investment", [new TextRun(proposal.investment)]),
                ...createSection("Client Responsibilities", createBulletedList(proposal.clientResponsibilities)),
                ...createSection("About", [new TextRun(proposal.about)]),
                ...createSection("Next Steps", [new TextRun(proposal.nextSteps)]),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "Disclaimer: This proposal is a template and is not a substitute for legal advice. All information, including the Terms & Conditions, should be reviewed by a qualified legal representative before signing.",
                            italics: true,
                            color: "888888",
                            size: 20, // 10pt
                        }),
                    ],
                    spacing: { before: 400, after: 200 },
                }),
                ...createSection("Terms & Conditions", createBulletedList(proposal.termsAndConditions)),
                new Paragraph({
                    children: [new TextRun({ text: "Agreement & Signature", bold: true, size: 28 })],
                    spacing: { before: 400, after: 300 },
                     border: {
                        bottom: {
                            color: "auto",
                            space: 1,
                            style: BorderStyle.SINGLE,
                            size: 6,
                        },
                    },
                }),
                createSignatureBlock(clientName, executiveName, executiveRole),
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