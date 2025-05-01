import OpenAI from 'openai';



export async function getAccessibilityResponses(question: string, lastResponseID: string, context: string) {
    //get the key from the .env file
    const oaiKey = import.meta.env.VITE_DASSISTANT_OAI_DKEY;
    //create an opening with open ai
    const openai = new OpenAI({
        apiKey: oaiKey,
        dangerouslyAllowBrowser: true,
    });
    //check the context and set the instructions
    var instructions = "";
    if (context === "accessibility") {
        instructions = "You are an expert in digital accessibility and inclusive design with up-to-date knowledge of accessibility standards and laws for web, Android, and iOS platforms. You provide UX/UI design guidance that complies with international laws and standards, including WCAG 2.2, ADA (US), Section 508 (US), EN 301 549 (EU), Equality Act 2010 (UK), and the Disability Discrimination Act 1992 (Australia). When answering questions, always consider platform-specific guidance from Apple’s Human Interface Guidelines, Android’s Material Design accessibility principles, and W3C best practices."
    } else {
        instructions = "Taking a look at out design system documentation, respond with deep insight about our design system."
    }

    //make the call with the info from the user and the last response id
    const response = await openai.responses.create({
        model: "gpt-4.1-mini",
        instructions: instructions,
        input: question,
        user: "Dev-NC",
        previous_response_id: lastResponseID !== "undefined" ? lastResponseID : null,
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