import { ChatMessage } from '../../models/ChatMessage';
//import Loader from '../loader/loader';
import Message from '../message/message';
import Typeography from '../typeography/typography';
import './conversation.scss';

interface Props {
    convo: ChatMessage[];
    isLoading: Boolean;
}

export default function Conversation({convo, isLoading}:Props) {
    isLoading = true;
    return (
      <div className="conversation">
        {convo.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        {isLoading ? (
          // <Typeography copy={"Let me mull this over"} />
          <>
            <div className="bot-thinking-message">
                <Typeography copy={"Let me think about that."} style='body.medium' color='default'/>
              {/* <Loader size="large" /> */}
            </div>
            {/* <div className="bot-image"></div> */}
          </>
        ) : (
          <></>
        )}
        {convo.find((message) => message.role == "assistant") !== null ? <div className="bot-image"></div> : (isLoading ? <div className="bot-image"></div> : <></>)}
      </div>
    );
    
}