export interface ChatMessage{
    id: String;
    role: String;
    content: String;
    responseId?: String | null;
    timestamp: String;
}