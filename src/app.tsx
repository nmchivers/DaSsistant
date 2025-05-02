import { useEffect, useState } from 'preact/hooks';
import './app.scss';
import { ChatMessage } from './models/ChatMessage';
import Typeography from './components/typeography/typography';
import BotIntro from './components/botIntro/botIntro';
import Conversation from './components/conversation/conversastion';
import Tag from './components/tag/tag';
import QuestionInput from './components/questionInput/questionInput';
import SettingsFormModal from './components/modals/settingsFormModal';
// import Modal from './components/modal/modal';
// import SettingsForm from './components/settingsForm/settingsForm';

export function App() {
  const [apiKey, setApiKey] = useState('');
  const [apiAvailableOnStartUp, setApiAvailableOnStartUp] = useState(false);
  //let apiAvailableOnStartUp = false;
  //Create the loading variable for tracking loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //create an array of chat message to track the convo.
  const chatMessages:ChatMessage[] = [];
  const [convo, setConvo] = useState(chatMessages);
  
  //this gets the API key from figma storage on initial load.
  useEffect(() => {
    window.onmessage = (event) => {
      const msg = event.data.pluginMessage;
      if (msg.type === 'load-api-key') {
        setApiKey(msg.apiKey);
        if (msg.apiKey !== '') {
          setApiAvailableOnStartUp(true);
        }
      }
    };
  }, []);

    
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
        {convo.length < 1 ? (
          <div className="bot-intro-container">
            <BotIntro />
          </div>
        ) : (
          <></>
        )}

        <div className="footer-content">
          <QuestionInput
            setConvo={setConvo}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            apiKey={apiKey}
          />
          <Typeography
            copy={
              "MechaNick can make mistakes. Always double check information."
            }
            style="body.small"
            color="supplementary"
            classes={"footnote-centered"}
          />
        </div>
      </div>
      {/* <SettingsFormModal apiKey={apiKey} setApiKey={setApiKey} /> */}
      {apiAvailableOnStartUp ? <></> : <SettingsFormModal apiKey={apiKey} setApiKey={setApiKey} />}
    </>
  );
}
