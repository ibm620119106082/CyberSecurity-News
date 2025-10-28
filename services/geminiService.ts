
import { GoogleGenAI } from "@google/genai";
import { Vulnerability } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });


export const fetchCyberSecurityNews = async (topic: string): Promise<Vulnerability[]> => {
  try {
    const prompt = `
      You are an expert cybersecurity analyst. Your task is to find the latest and most critical cybersecurity news about "${topic}".
      Use your search tool to find information on recent Zero-day vulnerabilities, new CVEs, ransomware attacks, or other major threats.
      Summarize at least 3-5 distinct threats you find.

      Your entire response MUST be a single, valid JSON array of objects. Do not include any text, markdown formatting, or code fences before or after the JSON array.
      Each object in the array must have the following string properties: "vulnerability", "cvssScore", "generalDescription", "vulnerabilityDescription", "affectedSystems", "impact", "recommendations", "category", "date".

      - vulnerability: The name or title of the vulnerability (e.g., CVE-2023-XXXX, Log4Shell).
      - cvssScore: The CVSS score (e.g., '9.8 Critical'). If not available, state 'N/A'.
      - generalDescription: A brief, one-sentence summary of the threat.
      - vulnerabilityDescription: A more detailed explanation of what the vulnerability is.
      - affectedSystems: A list of affected systems, hosts, or packages.
      - impact: The potential impact if the vulnerability is exploited.
      - recommendations: Recommended actions to mitigate the threat (e.g., patch, update, configure).
      - category: Categorize the threat as one of the following exact strings: 'Zero-Day Vulnerability', 'CVE', or 'News'.
      - date: The publication date of the information in 'YYYY-MM-DD' format. If not available, use the current date.

      If a specific piece of information (like a CVSS score) is not available, explicitly state 'Not Available' or 'N/A' for that field's value.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    let jsonText = response.text.trim();

    // Clean up potential markdown code fences that might wrap the JSON response.
    const match = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match) {
      jsonText = match[1];
    }
    
    if (!jsonText) {
        throw new Error("API returned an empty response.");
    }
    
    const parsedData = JSON.parse(jsonText);
    return parsedData as Vulnerability[];
  } catch (error) {
    console.error("Error fetching cybersecurity news:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to fetch or parse cybersecurity data: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching cybersecurity data.");
  }
};