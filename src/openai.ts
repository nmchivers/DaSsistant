import OpenAI from 'openai';
import { ChatMessage } from './models/ChatMessage';



export async function getAccessibilityResponses(convo: ChatMessage[], context: string, apiKey: string, user: string, dsLink?: string) {
    //create an opening with open ai
    const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true,
    });

    //check the context and set the instructions
    var instructions = "";
    if (context === "accessibility") {
        instructions = "You are an expert in digital accessibility and inclusive design with up-to-date knowledge of accessibility standards and laws for web, Android, and iOS platforms. You provide UX/UI design guidance that complies with international laws and standards, including WCAG 2.2, ADA (US), Section 508 (US), EN 301 549 (EU), Equality Act 2010 (UK), and the Disability Discrimination Act 1992 (Australia). When answering questions, always consider platform-specific guidance from Apple’s Human Interface Guidelines, Android’s Material Design accessibility principles, and W3C best practices."
    } else {
        instructions = "You are an expert in our design system (documentation site: " + dsLink + "). You provide deep insight about our design system."
    }

    //build the convo and include the system instructions.
    const newConvo = JSON.stringify(convo.map(({role, content}) => ({role, content})));

    //make the call with the info from the user and the last response id
    const response = await openai.responses.create({
        model: "gpt-4.1-mini",
        instructions: instructions,
        input: newConvo,
        user: user,
    }); 

    //pass back the response from open ai
    return response;
}

export async function getModels(apiKey:string) {
    //get the key from referring function
    const oaiKey = apiKey;
    //create an opening with open ai
    const openai = new OpenAI({
        apiKey: oaiKey,
        dangerouslyAllowBrowser: true,
    });

    try {
        const modelList = await openai.models.list();

        return modelList.data;
    } catch (error) {
        return [];
    }
}