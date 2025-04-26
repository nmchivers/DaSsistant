import Button from '../button/button';
import Typeography from '../typeography/typography';
import './questionInput.scss';
import { useState } from 'preact/hooks';

export default function questionInput() {
    const [question, setQuestion] = useState("");

    function handleOnChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        const questionInput = e.target as HTMLTextAreaElement;
        setQuestion(questionInput.value);
    }
    
    return (
      <div className="question-container">
        <div className="question-input-container">
          <label for="question" className="question-input-label">Question:</label>
          <textarea
            id="question"
            name="question"
            className="question-input"
            value={question}
            onChange={handleOnChange}
            placeholder={"What's on your mind?"}
          />
        </div>
        <div className="question-controls-container">
            <Typeography copy={"Accessibility"} style='body.medium' color='supplementary' />
            <Button text='Ask MechaNick' variant='filled' />
        </div>
      </div>
    );
}