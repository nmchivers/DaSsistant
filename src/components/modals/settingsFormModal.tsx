import { Dispatch, StateUpdater, useState } from "preact/hooks";
import Modal from "../modal/modal";
import SettingsForm from "../settingsForm/settingsForm";

interface Props {
    apiKey: string;
    setApiKey: Dispatch<StateUpdater<string>>;
}

export default function SettingsFormModal({apiKey, setApiKey}:Props) {
    const [settingsModalState, setSettingsModalState] = useState<string>("open");
    const [isClosing, setIsClosing] = useState(false);

    function handleClose() {
        setIsClosing(true);

        setTimeout(() => {
            setIsClosing(false);
            setSettingsModalState("close");
        }, 1000);
    }

    return (
        <Modal
            title="Settings"
            description="Calibrate MechaNick to get up and running!"
            children={<SettingsForm closeFunction={handleClose} apiKey={apiKey} setApiKey={setApiKey}/>}
            modalState={settingsModalState}
            isClosingState={isClosing}
            setModalState={setSettingsModalState}
        />
    );
}