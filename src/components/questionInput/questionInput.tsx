import React from 'preact/compat';
import { ChatMessage } from '../../models/ChatMessage';
import Button from '../button/button';
import './questionInput.scss';
import { useState } from 'preact/hooks';
import { v4 as uuidv4 } from "uuid";
import { getAccessibilityResponses } from '../../openai';
// import ContextSwitch from '../contextSwitch/contextSwitch';

interface Props {
    isDisabled: boolean,
    convo: ChatMessage[],
    setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setConvo: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
    apiKey: string,
}

export default function questionInput({ isDisabled, convo, setIsDisabled, setIsLoading, setConvo, apiKey}:Props) {
    const [question, setQuestion] = useState("");
    const [context, setContext] = useState<string>("accessibility")

    function handleOnChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        const questionInput = e.target as HTMLTextAreaElement;
        setQuestion(questionInput.value);
    }

    async function handleRequest() {
        //create the object for the user's message.
        const newUserMessage:ChatMessage = {
          id: uuidv4(),
          role:"user",
          content:question,
          responseId: null,
          timestamp:  new Date().toLocaleString(),
        }
        //add the user's message from the form to the set of chats.
        setConvo(prev => [...prev, newUserMessage]);
    
        //clear the input
        setQuestion("");
        
        //set the loading state and disabled state to true
        setIsLoading(true);
        setIsDisabled(true);
    
        //make the request to opanai in a try/catch/finally block
        try {
            //make the request to open ai
          const response = await getAccessibilityResponses([...convo, newUserMessage],context,apiKey,"NC-Dev");
    
          //add the response from open ai to the set of chats.
          setConvo(prev => [...prev, {id: uuidv4(), role:"assistant", content:response.output_text, responseId:response.id, timestamp:  new Date().toLocaleString()}]);
          
          //test the response from openai
          console.log(response);
        } catch (error) {
          //log the error to the console
          console.log(error);
        } finally {
          //set the loading state back to false while the 
          setIsLoading(false);
          setIsDisabled(false);
        }
      }
    
    return (
      <div className="question-container">
        <div className="question-input-container">
          <label for="question" className="question-input-label">Question:</label>
          <textarea
            id="question"
            name="question"
            className="question-input"
            value={question}
            onChange={handleOnChange}
            placeholder={"What's on your mind?"}
            disabled={isDisabled}
          />
        </div>
        <div className="question-controls-container">
            {/* <ContextSwitch context={context} setContext={setContext} isToggle={false}/> */}<div></div>
            <Button text='Ask MechaNick' variant='filled' onClick={handleRequest} disabled={isDisabled || question === ""} iconOnly icon='sendQuestion'/>
        </div>
      </div>
    );
}
