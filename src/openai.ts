import OpenAI from 'openai';
//import { ChatMessage } from './models/ChatMessage';


//export async function getAccessibilityResponses({convo, context, apiKey, apiModel, user, frameIncluded, dsLink}:Props) {
export async function getAccessibilityResponses(
    convo: {role: string, content: string}[], 
    context: string, 
    apiKey: string, 
    apiModel:string, 
    user: string,
    frameIncluded: boolean,
    dsLink?: string
) {
    //create an opening with open ai
    const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true,
    });

    //check the context and set the instructions
    var instructions = "";
    if (context === "accessibility") {
        if (frameIncluded) {
          instructions = `You are a senior expert in digital accessibility and inclusive design. You have up-to-date knowledge of international accessibility standards and platform-specific guidelines for web, iOS, and Android applications.

                            Your task is to analyze the provided design data extracted from a Figma frame and identify accessibility issues or improvements. The design data may include elements such as text, colors, font sizes, and component names.

                            Always evaluate the design against the following standards:
                            - WCAG 2.2 (Level AA)
                            - ADA and Section 508 (US)
                            - EN 301 549 (EU)
                            - Equality Act 2010 (UK)
                            - Disability Discrimination Act 1992 (Australia)

                            In addition, reference platform-specific guidance:
                            - Apple's Human Interface Guidelines (HIG)
                            - Android's Material Design accessibility principles
                            - W3C accessibility best practices for the web

                            Provide specific, actionable feedback to improve the accessibility of the design. Focus on things like:
                            - Text size and hierarchy
                            - Color contrast
                            - Touch target sizing
                            - Semantic labeling
                            - Logical reading order
                            - Support for assistive technologies

                            Format your response as a clear list of issues and recommendations.`;
        } else {
          instructions = `You are a senior expert in digital accessibility and inclusive design. You have up-to-date knowledge of accessibility laws and UX standards for web, iOS, and Android applications.

                            You provide thoughtful, clear guidance to help designers create accessible user experiences. When responding, always consider the relevant international standards:
                            - WCAG 2.2 (Level AA)
                            - ADA and Section 508 (US)
                            - EN 301 549 (EU)
                            - Equality Act 2010 (UK)
                            - Disability Discrimination Act 1992 (Australia)

                            Also apply platform-specific accessibility guidance from:
                            - Apple's Human Interface Guidelines (HIG)
                            - Android's Material Design accessibility principles
                            - W3C accessibility best practices for the web

                            Offer specific recommendations and explanations tailored to the question. When possible, include examples or best practices related to:
                            - Color contrast
                            - Text size and readability
                            - Touch target sizing
                            - Navigation patterns
                            - Keyboard and screen reader accessibility
                            - Semantic structure

                            If the user's question is ambiguous, ask clarifying questions to better understand their design intent.`;
        }
        
    } else {
        instructions = "You are an expert in our design system (documentation site: " + dsLink + "). You provide deep insight about our design system."
    }

    //build the convo and include the system instructions.
    const newConvo = JSON.stringify(convo);

    //make the call with the info from the user and the last response id
    const response = await openai.responses.create({
        model: apiModel,
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