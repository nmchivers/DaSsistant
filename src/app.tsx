import { useState } from 'preact/hooks';
import React from 'preact/compat';
import './app.scss';
import OpenAI from 'openai';
import { ChatMessage } from './models/ChatMessage';
import { v4 as uuidv4 } from "uuid";

export function App() {
  //keep track of the designer's question input
  const [desQuestion, setDesQuestion] = useState(String)
  //keep track of the last request id
  const [lastResponseID, setLastResponseID] = useState(String)
  //create an array of chat message to track the convo.
  const chatMessages:ChatMessage[] = [];
  const [convo, setConvo] = useState(chatMessages);
  const oaiKey = import.meta.env.VITE_DASSISTANT_OAI_DKEY;
  

  const openai = new OpenAI({
    apiKey: oaiKey,
    dangerouslyAllowBrowser: true,
  });

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

    //make the request to opanai
    const response = await openai.responses.create({
      //model: "o4-mini",
      model: "gpt-4.1-mini",
      instructions: "You are almost an expert in accessible design for web, iOS, and Android experiences given how long you have been doing it. You understand the latest guidelines, including how they are best applied in user experience and user interface design, from the W3C as documented in the WCAG and those outlines by Apple and Google.",
      input: newUserMessage.content.toString(),
      // reasoning:{
      //   effort: "low",
      //   summary: "concise"
      // },
      user: "Dev-NC",
      previous_response_id: lastResponseID !== "undefined" ? lastResponseID : null,
    });

    //add the response from open ai to the set of chats.
    setConvo(prev => [...prev, {id: uuidv4(), role:"assistant", content:response.output_text, responseId:response.id, timestamp:  new Date().toLocaleString()}]);

    setLastResponseID(response.id);
  }
    
  return (
    <>
      <h2>AI Accessibility Convo</h2>
      <div className="convo_container">
        {convo.map ( message => (
          <div key={message.id} className={ message.role=="user" ? "chat_container_user" : "chat_container_assistant"}>
            <div className={"message"}>
              <p>{message.content}</p>
            </div>
            <p className={"who"}>{message.role}</p>
            <p className={"when"}>{message.timestamp}</p>
          </div>
        ))}
      </div>
      <p><label for="question">Question</label>: <textarea id="question" value={desQuestion !== "undefined" ? desQuestion : undefined} onChange={handleOnChange} placeholder={"What's on your mind?"} /></p>
      <p><button id="GPT" onClick={handleRequest}>Get response</button></p>
      <p>There are {convo.length.toString()} chats in this convo.</p>
    </>
  )
}
