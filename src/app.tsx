import { useState } from 'preact/hooks';
import './app.scss';
import { ChatMessage } from './models/ChatMessage';
import Typeography from './components/typeography/typography';
import BotIntro from './components/botIntro/botIntro';
import Conversation from './components/conversation/conversastion';
import Tag from './components/tag/tag';
import QuestionInput from './components/questionInput/questionInput';
import Modal from './components/modal/modal';

export function App() {
  //Create the loading variable for tracking loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //create an array of chat message to track the convo.
  const chatMessages:ChatMessage[] = [];
  const [convo, setConvo] = useState(chatMessages);
  const [settingsModalState, setSettingsModalState] = useState<string>("open");
    
  return (
    <>
      <div className="starting-header">
        <Tag copy={"Powered by Open.AI"} />
        <Typeography
          copy="MechaNick v0.1"
          style="headline.xlarge"
          tagType="h1"
        />
      </div>
      <Conversation convo={convo} isLoading={isLoading} />
      <div className={"footer"}>
        
        {convo.length < 1 ? <div className="bot-intro-container"><BotIntro /></div> : <></>}
        
        <div className="footer-content">
          <QuestionInput setConvo={setConvo} isLoading={isLoading} setIsLoading={setIsLoading} />
          <Typeography
            copy={
              "MechaNick can make mistakes. Always double check information."
            }
            style="body.small"
            color="supplementary"
            classes={'footnote-centered'}
          />
        </div>
      </div>
      <Modal title='Settings' description='Calibrate MechaNick to get up and running!' children={<><p>This is a test</p></>} modalState={settingsModalState} setModalState={setSettingsModalState} />
    </>
  );
}
