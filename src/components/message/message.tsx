import ReactMarkdown from "react-markdown";
import { ChatMessage } from "../../models/ChatMessage";
import Typeography from "../typeography/typography";
import './message.scss';

interface Props {
    message: ChatMessage;
}

export default function Message ({message}: Props){
    if (message.role === "user") {
        return (
            <div className="messageRow">
                <div className="message_container_user">
                    <div className={"message"}>
                        <Typeography copy={message.content} style="body.medium" color="unset"/>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="messageRow">
                <div className="message_container_assistant">
                    <div className={"message"}>
                        <ReactMarkdown
                            components={{
                                a: (node, ...props) => (
                                    <a {...props} target="_blank" rel="noopener noreferrer">{node.children}</a>
                                ),
                            }}
                        >{message.content.toString()}</ReactMarkdown>
                    </div>
                </div>
            </div>
        )
    }
    
}