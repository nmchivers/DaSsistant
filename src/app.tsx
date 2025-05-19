import { useEffect, useState } from 'preact/hooks';
import './app.scss';
import { ChatMessage } from './models/ChatMessage';
import BotIntro from './components/botIntro/botIntro';
import Conversation from './components/conversation/conversastion';
import QuestionInput from './components/questionInput/questionInput';
import SettingsFormModal from './components/modals/settingsFormModal';
import AppHeader from './components/appHeader/appHeader';
import Footer from './components/footer/footer';
import { generateFullPalette } from './programmaticColor';

export function App() {
  const [apiKey, setApiKey] = useState('');
  const [apiModel, setApiModel] = useState('gpt-4o-mini');
  const [userName, setUserName] = useState('anonymous');
  const [appBaseColor, setAppBaseColor] = useState('#499590');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  //Create the loading variable for tracking loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //Create the disabled variable for tracking if the question should be disabled
  const [isQIDisabled, setIsQIDisabled] = useState<boolean>(false);
  const [dsLink, setDSLink] = useState('');
  const [isDSEnabled, setIsDSEnabled] = useState<boolean>(false);
  //create an array of chat message to track the convo.
  const chatMessages:ChatMessage[] = [];
  const [convo, setConvo] = useState(chatMessages);
  
  //this runs as soon as the plugin launches.
  useEffect(() => {
    //generates the initial palette for the app prior to any user adjustments.
    generateFullPalette(appBaseColor);

    //gets the api key, model, user name, and ds link from figma storage on start up.
    window.onmessage = (event) => {
      const msg = event.data.pluginMessage;
      if (msg.type === 'load-saved-data') {
        if (msg.apiKey !== '') {
          setApiKey(msg.apiKey);
          setShowSettingsModal(false);
        } else {
          setShowSettingsModal(true);
          setIsQIDisabled(true);
        }
        if (msg.apiModel !== ''){
          setApiModel(msg.apiModel);
        }
        if (msg.userName !== ''){
          setUserName(msg.userName);
        }
        if (msg.dsLink !== ''){
          setDSLink(msg.dsLink);
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

  //Keep track of whether a DS Link has been provided and toggle on or off DS availability accordingly
  useEffect(() => {
    if (dsLink == '') {
      setIsDSEnabled(false);
    } else {
      setIsDSEnabled(true);
    }
  }, [dsLink]);

  // Lock scroll when modal is open
  useEffect(() => {
    // When modal opens, prevent body scrolling
    if (showSettingsModal) {
      document.body.style.overflow = 'hidden';
    } else {
      // When it closes, restore scroll
      document.body.style.overflow = '';
    }

    // Cleanup in case component unmounts while modal is open
    return () => {
      document.body.style.overflow = '';
    };
  }, [showSettingsModal]);

    
  return (
    <>
      <AppHeader botName='MechaNick' version='v0.1' convoStarted={convo.length > 0} openSettingsModalFunction={setShowSettingsModal}/>
      <Conversation convo={convo} isLoading={isLoading} />
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
            convo={convo}
            isDisabled={isQIDisabled}
            setIsLoading={setIsLoading}
            setIsDisabled={setIsQIDisabled}
            apiKey={apiKey}
            apiModel={apiModel}
            user={userName}
          />
          <Footer />
        </div>
      </div>
      {showSettingsModal ? <SettingsFormModal apiKey={apiKey} setApiKey={setApiKey} setShowSettingsModal={setShowSettingsModal} setDSLink={setDSLink} apiModel={apiModel} setApiModel={setApiModel} /> : <></>}
    </>
  );
}
