import { useState } from 'preact/hooks';
import React from 'preact/compat';
import './app.scss';
//import OpenAI from 'openai';
import { ChatMessage } from './models/ChatMessage';
import { v4 as uuidv4 } from "uuid";
import Button from './components/button/button';
import Typeography from './components/typeography/typography';
import Conversation from './components/conversation/conversastion';
import Tag from './components/tag/tag';
import { getAccessibilityResponses } from './openai';

export function App() {
  //keep track of the designer's question input
  const [desQuestion, setDesQuestion] = useState("");
  //Create the loading variable for tracking loading state
  const [isLoading, setIsLoading] = useState(false);
  //keep track of the last request id
  const [lastResponseID, setLastResponseID] = useState(String);
  //create an array of chat message to track the convo.
  const chatMessages:ChatMessage[] = [];
  const [convo, setConvo] = useState(chatMessages);

  function handleOnChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const questionInput = e.target as HTMLTextAreaElement;
    setDesQuestion(questionInput.value);
  }

  async function handleRequest() {
    //create the object for the user's message.
    const newUserMessage:ChatMessage = {
      id: uuidv4(),
      role:"user",
      content:desQuestion,
      responseId: null,
      timestamp:  new Date().toLocaleString(),
    }
    //add the user's message from the form to the set of chats.
    setConvo(prev => [...prev, newUserMessage]);

    //clear the input
    setDesQuestion("");
    
    //set the loading state to true
    setIsLoading(true);

    //make the request to opanai in a try/catch/finally block
    try {
      const response = await getAccessibilityResponses(desQuestion,lastResponseID);

      setLastResponseID(response.id);

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
    }
  }
    
  return (
    <>
      <div className="starting-header">
        <Tag copy={"Powered by Open.AI"} />
        <Typeography
          copy="MechaNick v0.1"
          style="headline.large"
          tagType="h1"
        />
      </div>
      <Conversation convo={convo} isLoading={isLoading} />
      <div className={"footer"}>
        <div className={"footer-content"}>
          <p>
            <label for="question">Question</label>:{" "}
            <textarea
              id="question"
              value={desQuestion}
              onChange={handleOnChange}
              placeholder={"What's on your mind?"}
            />
          </p>
          <Button
            id={"NewGPTButton"}
            text="Get response"
            variant="filled"
            onClick={handleRequest}
            disabled={isLoading}
          />
          <Typeography
            copy={
              "MechaNick can make mistakes. Always double check information."
            }
            style="body.small"
            color="supplementary"
          />
        </div>
      </div>
    </>
  );
}
