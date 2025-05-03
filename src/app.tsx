import { useEffect, useState } from 'preact/hooks';
import './app.scss';
import { ChatMessage } from './models/ChatMessage';
import Typeography from './components/typeography/typography';
import BotIntro from './components/botIntro/botIntro';
import Conversation from './components/conversation/conversastion';
import QuestionInput from './components/questionInput/questionInput';
import SettingsFormModal from './components/modals/settingsFormModal';
import AppHeader from './components/appHeader/appHeader';
// import Modal from './components/modal/modal';
// import SettingsForm from './components/settingsForm/settingsForm';

export function App() {
  const [apiKey, setApiKey] = useState('');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
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
          setShowSettingsModal(false);
        } else {
          setShowSettingsModal(true);
        }
      }
    };
  }, []);

    
  return (
    <>
      <AppHeader botName='MechaNick' version='v0.1' convoStarted={convo.length > 0} openSettingsModalFunction={setShowSettingsModal}/>
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
      {showSettingsModal ? <SettingsFormModal apiKey={apiKey} setApiKey={setApiKey} setShowSettingsModal={setShowSettingsModal} /> : <></>}
    </>
  );
}
