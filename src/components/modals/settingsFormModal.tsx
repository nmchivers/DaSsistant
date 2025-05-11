import { Dispatch, StateUpdater, useState } from "preact/hooks";
import Modal from "../modal/modal";
import SettingsForm from "../settingsForm/settingsForm";

interface Props {
    apiKey: string;
    setApiKey: Dispatch<StateUpdater<string>>;
    setDSLink: Dispatch<StateUpdater<string>>;
    setShowSettingsModal: Dispatch<StateUpdater<boolean>>;
}

export default function SettingsFormModal({apiKey, setApiKey, setShowSettingsModal, setDSLink}:Props) {
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
            children={<SettingsForm closeFunction={handleClose} apiKey={apiKey} setApiKey={setApiKey} setDSLink={setDSLink}/>}
            isClosingState={isClosing}
            closeFunction={handleClose}
        />
    );
}