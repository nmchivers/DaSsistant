import { Dispatch, StateUpdater, useState } from "preact/hooks";
import Modal from "../modal/modal";
import SettingsForm from "../settingsForm/settingsForm";

interface Props {
    apiKey: string;
    setApiKey: Dispatch<StateUpdater<string>>;
    apiModel: string;
    setApiModel: Dispatch<StateUpdater<string>>;
    dsLink: string;
    setDSLink: Dispatch<StateUpdater<string>>;
    primaryColor: string;
    setPrimaryColor: (newcolor:string) => void;
    setShowSettingsModal: Dispatch<StateUpdater<boolean>>;
}

export default function SettingsFormModal({
    apiKey, 
    setApiKey, 
    setShowSettingsModal, 
    dsLink, 
    setDSLink, 
    apiModel, 
    setApiModel, 
    primaryColor,
    setPrimaryColor
}:Props) {
    const [isClosing, setIsClosing] = useState(false);

    function handleClose() {
        setIsClosing(true);

        setTimeout(() => {
            setIsClosing(false);
            setShowSettingsModal(false);
        }, 1000);
    }

    return (
        <Modal
            title="Settings"
            description="Calibrate MechaNick to get up and running!"
            children={<SettingsForm 
                    closeFunction={handleClose} 
                    apiKey={apiKey} 
                    setApiKey={setApiKey} 
                    dsLink={dsLink}
                    setDSLink={setDSLink} 
                    apiModel={apiModel} 
                    setApiModel={setApiModel}
                    primaryColor={primaryColor}
                    setPrimaryColor={setPrimaryColor}
                />}
            isClosingState={isClosing}
            closeFunction={handleClose}
        />
    );
}