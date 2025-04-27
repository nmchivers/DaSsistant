import Typeography from '../typeography/typography';
import './contextSwitch.scss';

interface Props {
    isToggle: boolean,
    context: string,
    setContext: React.Dispatch<React.SetStateAction<string>>,
}

export default function ContextSwitch({context, setContext, isToggle = false}:Props) {

    function handleSelection(opt:string) {
        setContext(opt);
    }

    if (isToggle) {
        return (
            <div className="context-switch">
                <button onClick={() => handleSelection("accessibility")}>
                    <Typeography copy="Accessibility" classes={"context-switch-accessibility" + (context === "accessibility" ? " selected" : "")} style='body.medium' color='unset' />
                </button>
                <button onClick={() => handleSelection("design system")}>
                    <Typeography copy="Design System" classes={"context-switch-designSystem" + (context === "design system" ? " selected" : "")} style='body.medium' color='unset' />
                </button>
            </div>
        )
    } else {
        return (
            <div className="context-switch-single">
                <div className="text-container">
                    <Typeography copy="Accessibility" classes={"context-switch-accessibility" + (context === "accessibility" ? " selected" : "")} style='body.medium' color='unset' />
                </div>
            </div>
        )
    }    
}