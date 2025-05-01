import './modal.scss';
import Button from "../button/button";
import Typeography from "../typeography/typography";
import React, { ChangeEvent, ReactNode } from 'preact/compat';
import { StateUpdater, useState } from 'preact/hooks';
import TextInput from '../textInput/textInput';


interface Props {
    title: string;
    description?: string;
    children: ReactNode;
    modalState: string | 'open' | 'close';
    setModalState: React.Dispatch<StateUpdater<string>>;
}

export default function Modal({title, description = "", children, modalState, setModalState}:Props) {
    const [isClosing, setIsClosing] = useState(false);

    //for testing the input
    const [apiKey, setApiKey] = useState("");
    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const target = event.target as HTMLInputElement;
        setApiKey(target.value);
    }

    function handleClose() {
        setIsClosing(true);

        setTimeout(() => {
            setIsClosing(false); // Reset so next time it opens it's clean
            setModalState("close");
        }, 1000);
    }

    if (modalState === "open") {
        return (
          <>
            <div className="modal-scrim-container">
              {/* <div className="scrim"></div> */}
              <div className={"modal" + (isClosing ? " closing" : "")}>
                <Button
                  text="Close modal"
                  iconOnly
                  icon="x"
                  variant="hollow"
                  addClasses="modal-close"
                  onClick={handleClose}
                />
                <div className="modal-header">
                  <Typeography
                    copy={title}
                    style="headline.large"
                    color="default"
                    tagType="h2"
                  />
                  {description !== "" ? (
                    <Typeography
                      copy={description}
                      style="body.medium"
                      color="default"
                      tagType="p"
                    />
                  ) : (
                    <></>
                  )}
                </div>
                <TextInput
                  id="api-key"
                  value={apiKey}
                  onChange={handleInputChange}
                  placeholder="sk-###..."
                  label="OpenAI API Key"
                  description={
                    <>
                      You will need your own{" "}
                      <Typeography
                        copy="API key from OpenAI"
                        tagType="a"
                        href="https://openai.com/api/"
                        style='body.small'
                        color='unset'
                        target="_blank"
                      />{" "}
                      to run MechaNick.
                    </>
                  }
                  isRequired
                  errorMessage="Please provide an Open AI API Key."
                />
                {children}
              </div>
              <div className="scrim"></div>
            </div>
          </>
        );
    } else {

        return(<></>)
    }
}