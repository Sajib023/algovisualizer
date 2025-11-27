import { GoogleGenAI, Type, Schema } from "@google/genai";
import { VisualizationData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A concise summary of the problem statement in plain English, focusing on the core objective.",
    },
    mermaidChart: {
      type: Type.STRING,
      description: "A Mermaid.js diagram definition (graph TD or sequenceDiagram) illustrating the algorithmic logic flow. IMPORTANT: ALL node labels MUST be enclosed in double quotes. Example: A[\"Init HashMap (seen)\"]",
    },
    dataStructureChart: {
      type: Type.STRING,
      description: "A Mermaid.js diagram definition (classDiagram, stateDiagram, or graph LR) visualizing the primary data structures. IMPORTANT: ALL node labels MUST be enclosed in double quotes. Example: A[\"State: (Visiting)\"]",
    },
    complexity: {
      type: Type.OBJECT,
      properties: {
        time: { type: Type.STRING, description: "Time complexity (Big O)" },
        space: { type: Type.STRING, description: "Space complexity (Big O)" },
        explanation: { type: Type.STRING, description: "Brief explanation of why." },
      },
      required: ["time", "space", "explanation"],
    },
    examples: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          input: { type: Type.STRING },
          output: { type: Type.STRING },
          explanation: { type: Type.STRING },
        },
        required: ["input", "output", "explanation"],
      },
    },
    edgeCases: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of critical edge cases to consider.",
    },
    tags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Algorithm tags (e.g., DP, DFS, Array).",
    },
  },
  required: ["summary", "mermaidChart", "dataStructureChart", "complexity", "examples", "edgeCases", "tags"],
};

export const analyzeProblem = async (problemText: string): Promise<VisualizationData> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        Analyze the following coding problem statement. 
        Your goal is to visualize the solution logic and the data structures involved.
        
        Problem Statement:
        ${problemText}

        Instructions:
        1. Create a "mermaidChart" that represents the LOGIC FLOW (flowchart) of the optimal solution.
        2. Create a "dataStructureChart" that represents the STATE or DATA STRUCTURES (e.g., a linked list visualization, a tree, or state transition diagram).
        3. Provide complexity analysis, examples, and edge cases.
        
        CRITICAL MERMAID SYNTAX RULES:
        - Use "graph TD" or "graph LR" for flowcharts.
        - STRICT RULE: ALL node labels MUST be enclosed in double quotes. 
          - CORRECT: id["Initialize Map (seen)"]
          - INCORRECT: id(Initialize Map (seen))
          - INCORRECT: id{Check: n < 0?}
          - CORRECT: id{"Check: n < 0?"}
        - If you need to use quotes inside the label, use single quotes.
          - Correct: id["Set key='value'"]
        - Do NOT include markdown code blocks (e.g., \`\`\`mermaid) in the JSON strings.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are an expert Computer Science instructor. You excel at visualizing algorithms using Mermaid.js. Your mermaid code MUST BE SYNTACTICALLY CORRECT. ALWAYS use double quotes for node labels to handle parentheses and special characters safely.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as VisualizationData;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};