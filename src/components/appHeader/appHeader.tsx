import { Dispatch, StateUpdater } from 'preact/hooks';
import Button from '../button/button';
import Tag from '../tag/tag';
import './appHeader.scss';

interface Props {
    botName: string;
    version: string;
    convoStarted: boolean;
    openSettingsModalFunction: Dispatch<StateUpdater<boolean>>;
}

export default function AppHeader({botName, version, convoStarted, openSettingsModalFunction}:Props) {
    
    return (
        <div className={"app-header" + (convoStarted ? " convo-started" : "")}>
            <div className='headline-badge-container'>
                {convoStarted ? <></> : <Tag copy={"Powered by Open.AI"} />}
                <h1>{botName + " " + version}</h1>
            </div>
            <Button text='Open Settings Modal' variant='hollow' iconOnly icon='gear' addClasses='header-button' onClick={()=>{openSettingsModalFunction(true)}}/>
        </div>
    )
}