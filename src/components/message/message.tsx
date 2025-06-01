import ReactMarkdown from "react-markdown";
import { ChatMessage } from "../../models/ChatMessage";
import Typeography from "../typeography/typography";
import './message.scss';
import remarkGfm from "remark-gfm";

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
                            remarkPlugins={[remarkGfm]}
                            components={{
                                a: ({href, children, ...props}) => (
                                    <a href={href} {...props} target="_blank" rel="noopener noreferrer">{children}</a>
                                ),
                            }}
                        >{message.content.toString()}</ReactMarkdown>
                    </div>
                </div>
            </div>
        )
    }
    
}