import './modal.scss';
import Button from "../button/button";
import Typeography from "../typeography/typography";
import React, { ReactNode } from 'preact/compat';
import { StateUpdater, useState } from 'preact/hooks';


interface Props {
    title: string;
    description?: string;
    children: ReactNode;
    modalState: string | 'open' | 'close';
    isClosingState: boolean;
    setModalState: React.Dispatch<StateUpdater<string>>;
}

export default function Modal({title, description = "", children, modalState, isClosingState, setModalState}:Props) {
    const [isClosing, setIsClosing] = useState(isClosingState);

    function handleClose() {
        setIsClosing(true);

        setTimeout(() => {
            setIsClosing(false);
            setModalState("close");
        }, 1000);
    }

    if (modalState === "open") {
        return (
          <>
            <div className="modal-scrim-container">
              {/* <div className="scrim"></div> */}
              <div className={"modal" + (isClosing || isClosingState ? " closing" : "")}>
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