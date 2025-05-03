import './modal.scss';
import Button from "../button/button";
import Typeography from "../typeography/typography";
import { ReactNode } from 'preact/compat';


interface Props {
    title: string;
    description?: string;
    children: ReactNode;
    closeFunction: () => void;
    isClosingState: boolean;
}

export default function Modal({title, description = "", children, isClosingState, closeFunction}:Props) {

  return (
    <>
      <div className="modal-scrim-container">
        <div className={"modal" + ( isClosingState ? " closing" : "")}>
          <Button
            text="Close modal"
            iconOnly
            icon="x"
            variant="hollow"
            addClasses="modal-close"
            onClick={closeFunction}
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
}