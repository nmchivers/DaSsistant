import { InputHTMLAttributes, ReactNode } from 'preact/compat';
import './textInput.scss';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    id:string;
    placeholder:string;
    label:string;
    description?: string | ReactNode;
    isRequired?:boolean;
    errorMessage?:string;
    isInvalid?:boolean;
    addClasses?:string;
}

export default function TextInput({id, placeholder, label, description = "", isRequired, errorMessage, isInvalid, addClasses = "", ...props}:Props) {
    let validationClass = "";
    if (isInvalid) {
        validationClass = " error"
    }

    const optionalTag = <span>(optional)</span>;

    return (
        <div className={addClasses == "" ? 'input-text-container' : 'input-text-container ' + addClasses}>
            <div className="input-text-label-container">
                <label className={'input-text-label' + validationClass} htmlFor={id}>{label} {!isRequired && optionalTag}</label>
                {description == "" ? <></> : <span className="input-text-description">{description}</span>}
            </div>
            <input className={validationClass} id={id} type='text' placeholder={placeholder} {...props} />
            <p className={'input-text-errormessage'+ validationClass}>{errorMessage}</p>
        </div>
    )
}