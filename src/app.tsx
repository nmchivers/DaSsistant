import { useEffect, useState } from 'preact/hooks';
import './app.scss';
import { ChatMessage } from './models/ChatMessage';
import Typeography from './components/typeography/typography';
import BotIntro from './components/botIntro/botIntro';
import Conversation from './components/conversation/conversastion';
import QuestionInput from './components/questionInput/questionInput';
import SettingsFormModal from './components/modals/settingsFormModal';
import AppHeader from './components/appHeader/appHeader';
import Loader from './components/loader/loader';
// import Modal from './components/modal/modal';
// import SettingsForm from './components/settingsForm/settingsForm';

export function App() {
  const [apiKey, setApiKey] = useState('');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  //Create the loading variable for tracking loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //Create the disabled variable for tracking if the question should be disabled
  const [isQIDisabled, setIsQIDisabled] = useState<boolean>(false);
  const [isDSEnabled, setIsDSEnabled] = useState<boolean>(false);
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
          setIsQIDisabled(true);
        }
      }
    };
  }, []);

  //disable the question input if the api key is missing
  useEffect(() => {
    if (apiKey == '') {
      setIsQIDisabled(true);
    } else {
      setIsQIDisabled(false);
    }
  }, [apiKey]);

    
  return (
    <>
      <AppHeader botName='MechaNick' version='v0.1' convoStarted={convo.length > 0} openSettingsModalFunction={setShowSettingsModal}/>
      <Conversation convo={convo} isLoading={isLoading} />
      <div className="test-900"></div>
      <div className="test-800"></div>
      <div className="test-700"></div>
      <div className="test-600"></div>
      <div className="test-500"></div>
      <div className="test-400"></div>
      <div className="test-300"></div>
      <div className="test-200"></div>
      <div className="test-100"></div>
      <div className={"footer"}>
        {convo.length < 1 ? (
          <div className="bot-intro-container">
            <BotIntro isDSEnabled={isDSEnabled} openSettingsModalFunction={setShowSettingsModal} variant={apiKey == '' ? "no-key" : "has-key"} />
          </div>
        ) : (
          <></>
        )}

        <div className="footer-content">
          <QuestionInput
            setConvo={setConvo}
            isDisabled={isQIDisabled}
            setIsLoading={setIsLoading}
            setIsDisabled={setIsQIDisabled}
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
