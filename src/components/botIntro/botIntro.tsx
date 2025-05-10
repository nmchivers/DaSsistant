import { Dispatch, StateUpdater } from 'preact/hooks';
import Button from '../button/button';
import Typeography from '../typeography/typography';
import './botIntro.scss';

interface Props{
    variant: "has-key" | "no-key";
    isDSEnabled: boolean;
    openSettingsModalFunction: Dispatch<StateUpdater<boolean>>;
}

export default function BotIntro({isDSEnabled, variant, openSettingsModalFunction}: Props){

    if (variant == "has-key") {
        return (
            <div className="bot-intro">
                <div className="image"></div>
                <div className="text-group">
                    <Typeography copy={"Hey folks, I’m MechaNick!"} style='body.medium.highImp' color='unset' />
                    <Typeography copy={"I can help answer questions you have about accessible design! Just ask away and I’ll do my best!"} style='body.medium' color='unset' />
                </div>
            </div>
        );
    } else {
        return (
            <div className="bot-intro no-key">
                <div className="image"></div>
                <div className="text-group">
                    <Typeography copy={"Help! My settings need updated!"} style='body.medium.highImp' color='unset' />
                    <Typeography copy={"Before we can begin chatting, I'm going to need updates to some of my settings."} style='body.medium' color='unset' />
                    <div className="requirements">
                        <Typeography copy={"I'll need:"} style='body.medium' color='unset' />
                        <ul>
                            <li>
                                <Typeography copy={"An "} style='body.medium' color='unset' />
                                <Typeography copy={"API key from OpenAI"} style='body.medium' color='unset' tagType='a' href={"https://openai.com/api/"} target={"_blank"} />
                                <Typeography copy={" to power my thoughts."} style='body.medium' color='unset' />
                            </li>
                            <li>
                                <Typeography copy={"Which OpenAI Model I should use when I think."} style='body.medium' color='unset' />
                            </li>
                            {isDSEnabled ? 
                                <li>
                                    <Typeography copy={"Optionally, a publicly available link to your design system docs to provide context to my design system responses."} style='body.medium' color='unset' />
                                </li>
                            : <></>}
                        </ul>
                    </div>
                    <div className="button-group" >
                        <Button text='Update Settings' variant='filled' onClick={() => openSettingsModalFunction(true)} />
                    </div>
                </div>
            </div>
        );
    }
}