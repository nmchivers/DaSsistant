import { ChatMessage } from "../../models/ChatMessage";
import Typeography from "../typeography/typography";
import './message.scss';

interface Props {
    message: ChatMessage;
}

export default function Message ({message}: Props){
    return (
        <div className="messageRow">
            <div className={  message.role=="user" ? "message_container_user" : "message_container_assistant"}>
                <div className={"message"}>
                    <Typeography copy={message.content} style="body.medium" color="default"/>
                </div>
            </div>
        </div>
    )
}