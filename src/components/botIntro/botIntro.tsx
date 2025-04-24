import Typeography from '../typeography/typography';
import './botIntro.scss';

export default function BotIntro(){
    return (
        <div className={"bot-intro"}>
            <div className={"image"}>
                <span>placeholder</span>
            </div>
            <div className={"text-group"}>
                <Typeography copy={"Hey folks, I’m MechaNick!"} style='body.medium.highImp' color='unset' />
                <Typeography copy={"I can help answer questions you have about accessible design! Just ask away and I’ll do my best!"} style='body.medium' color='unset' />
            </div>
        </div>
    );
}