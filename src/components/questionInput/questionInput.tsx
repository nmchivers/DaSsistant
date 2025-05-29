import React from 'preact/compat';
import { ChatMessage } from '../../models/ChatMessage';
import Button from '../button/button';
import './questionInput.scss';
import { useEffect, useState } from 'preact/hooks';
import { v4 as uuidv4 } from "uuid";
import { getAccessibilityResponses } from '../../openai';
import Checkbox from '../checkbox/checkbox';
// import ContextSwitch from '../contextSwitch/contextSwitch';

interface Props {
    isDisabled: boolean,
    convo: ChatMessage[],
    setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setConvo: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
    apiKey: string,
    apiModel: string,
    user: string,
}

export default function QuestionInput({ isDisabled, convo, setIsDisabled, setIsLoading, setConvo, apiKey, apiModel, user}:Props) {
    const [question, setQuestion] = useState("");
    const [includeFrame, setIncludeFrame] = useState(false);
    const [context, setContext] = useState("accessibility");
    const [apiConvo, setApiConvo] = useState<{role: string, content: string}[]>([]);
    //const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

    function handleOnChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        const questionInput = e.target as HTMLTextAreaElement;
        setQuestion(questionInput.value);
    }

    function requestFrameData(): Promise<string> {
      return new Promise((resolve, reject) => {
        function handler(event: MessageEvent) {
          const msg = (event.data as any).pluginMessage;
          if (msg.type === "frame-data-response") {
            window.removeEventListener("message", handler);
            resolve(msg.data);
          }
          if (msg.type === "frame-data-error") {
            window.removeEventListener("message", handler);
            reject(new Error(msg.message));
          }
        }
        window.addEventListener("message", handler);
        parent.postMessage({ pluginMessage: { type: "get-frame-data" } }, "*");
      });
    }

    async function handleRequest() {
      let tempApiQuestion = question;
      let tempUIQuestion = question;

      //get the frame data from figma
      if (includeFrame ) {
        const frameData = await requestFrameData();
        tempApiQuestion = tempApiQuestion + " And here is the data from my frame: " + frameData;
        tempUIQuestion = tempUIQuestion + " (Your selected frame was included.)";
        //console.log(frameData);
      }

      //create the object for the user's message.
      const newUserMessage: ChatMessage = {
        id: uuidv4(),
        role: "user",
        content: tempUIQuestion,
        responseId: null,
        timestamp: new Date().toLocaleString(),
      };
      const newApiMessage: {role: string, content: string} = {role:"user", content: tempApiQuestion};

      //add the user's message from the form to the set of chats.
      setConvo((prev) => [...prev, newUserMessage]);
      setApiConvo((prev) => [...prev, newApiMessage]);

      //clear the input
      setQuestion("");

      //set the loading state and disabled state to true
      setIsLoading(true);
      setIsDisabled(true);

      //make the request to opanai in a try/catch/finally block
      try {
        //console.log('Here is the question to be asked: ' + tempQuestion);
        //make the request to open ai
        const response = await getAccessibilityResponses(
          [...apiConvo, newApiMessage],
          context,
          apiKey,
          apiModel,
          user,
          includeFrame,
        );

        //add the response from open ai to the set of chats.
        setConvo((prev) => [
          ...prev,
          {
            id: uuidv4(),
            role: "assistant",
            content: response.output_text,
            responseId: response.id,
            timestamp: new Date().toLocaleString(),
          },
        ]);
        setApiConvo((prev) => [...prev, {role: "assistant", content: response.output_text}]);
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
            {/* <ContextSwitch context={context} setContext={setContext} isToggle={false}/> */}
            <Checkbox label='Include selected frame' onChange={setIncludeFrame} checked={includeFrame} className={"add-frame-checkbox"} />
            <Button text='Ask MechaNick' variant='filled' onClick={handleRequest} disabled={isDisabled || question === ""} iconOnly icon='sendQuestion'/>
        </div>
      </div>
    );
}
