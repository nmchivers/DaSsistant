import { ChatMessage } from '../../models/ChatMessage';
import Message from '../message/message';
import Typeography from '../typeography/typography';
import './conversation.scss';

interface Props {
    convo: ChatMessage[];
    isLoading: Boolean;
}

export default function Conversation({convo, isLoading}:Props) {
    return(
        <div className="conversation">
            {convo.map ( message => (
                <Message key={message.id} message={message} />
            ))}
            {isLoading ? <Typeography copy={"Let me mull this over"} /> : <></> }
        </div>
    )
    
}