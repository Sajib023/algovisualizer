export interface Complexity {
    time: string;
    space: string;
    explanation: string;
}

export interface Example {
    input: string;
    output: string;
    explanation: string;
}

export interface VisualizationData {
    summary: string;
    mermaidChart: string; // Flowchart or Sequence diagram
    dataStructureChart: string; // A second mermaid chart specifically for state/data
    complexity: Complexity;
    examples: Example[];
    edgeCases: string[];
    tags: string[];
}

export enum ViewMode {
    INPUT = 'INPUT',
    VISUALIZATION = 'VISUALIZATION'
}