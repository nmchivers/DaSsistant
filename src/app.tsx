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
import Loader from './components/loader/loader';

export function App() {
  const [apiKey, setApiKey] = useState('');
  const [apiModel, setApiModel] = useState('gpt-4o-mini');
  const [userName, setUserName] = useState('anonymous');
  const [primaryColor, setPrimaryColor] = useState('#499590');
  const [showSettingsModal, setShowSettingsModal] = useState(true);
  //Create the loading variable for tracking loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAppLoading, setIsAppLoading] = useState<boolean>(true);
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
    generateFullPalette(primaryColor);

    //tell the controller to give the UI the saved data.
    parent.postMessage({pluginMessage:{type: 'request-saved-data'}}, '*');

    //gets the api key, model, user name, and ds link from figma storage on start up.
    window.onmessage = (event) => {
      const msg = event.data.pluginMessage;
      switch (msg.type) {
        case 'load-saved-data':
          if (msg.hasApiKey  && msg.apiKey !== '') {
            setApiKey(msg.apiKey);
            setShowSettingsModal(false);
          }
          if (msg.hasApiModel && msg.apiModel !== '') {
            setApiModel(msg.apiModel);
          }
          if (msg.hasDsLink && msg.dsLink !== '') {
            setDSLink(msg.dsLink);
          }
          if (msg.hasPrimaryColor && msg.primaryColor !== '') {
            setPrimaryColor(msg.primaryColor);
          }
          setUserName(msg.user);
          setIsAppLoading(false);
          break;
      
        case 'load-error':
          setIsAppLoading(false);
          console.log("There was an issue with loading data from Figma Client Storage.")
          break;
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
    (isAppLoading ?
      <p>Loading...</p>
    :
      <>
        <AppHeader
          botName="MechaNick"
          version="v0.1"
          convoStarted={convo.length > 0}
          openSettingsModalFunction={setShowSettingsModal}
        />
        <Conversation convo={convo} isLoading={isLoading} />
        <div className={"footer"}>
          {convo.length < 1 ? (
            <div className="bot-intro-container">
              <BotIntro
                isDSEnabled={isDSEnabled}
                openSettingsModalFunction={setShowSettingsModal}
                variant={apiKey == "" ? "no-key" : "has-key"}
              />
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
        {showSettingsModal ? (
          <SettingsFormModal
            apiKey={apiKey}
            setApiKey={setApiKey}
            setShowSettingsModal={setShowSettingsModal}
            dsLink={dsLink}
            setDSLink={setDSLink}
            apiModel={apiModel}
            setApiModel={setApiModel}
            primaryColor={primaryColor}
            setPrimaryColor={setPrimaryColor}
          />
        ) : (
          <></>
        )}
      </>)
  );
}
