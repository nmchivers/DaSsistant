import { ReactNode, useEffect, useRef, useState } from 'preact/compat';
import './dropDown.scss';
import Icon from '../icon/icon';

//idea, what if you create a special interface for the options list and export it to be used in forming the array of objects.

interface Props {
    id:string;
    placeholder?:string;
    value?: string;
    label:string;
    description?: string | ReactNode;
    isRequired?:boolean;
    errorMessage?:string;
    isInvalid?:boolean;
    disabled?: boolean;
    addClasses?:string;
    options: {id: string, text:string, value:string}[];
    onChange: (newModel:string) => void;
}

export default function DropDown({id, placeholder, value, label, description = "", isRequired, errorMessage, isInvalid, disabled = false, addClasses = "", options, onChange}:Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOpt, setSelectedOpt] = useState<string | undefined>(value !== "" || undefined ? value : undefined);
    const [classNames, setClassNames] = useState("input-dropdown-container" + (addClasses == "" ? "" : " " + addClasses));
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      function onClickOutside(e: MouseEvent) {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
        }
      }
      document.addEventListener("mousedown", onClickOutside);
      return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    function handleInputClick(){
      if (!disabled) {
        setIsOpen((open) => !open);
      }
    }

    function handleOptionSelect(opt: string) {
      setSelectedOpt(opt);
      onChange(opt);
    }

    useEffect(() => {
      if (disabled) {
        setClassNames(prev => prev + " disabled");
      } else {
        setClassNames(prev => prev.replace(" disabled",""))
      }
      if (isInvalid) {
        setClassNames(prev => prev + " error");
      } else {
        setClassNames(prev => prev.replace(" error",""))
      }
    }, [disabled, isInvalid])

    const optionalTag = <span>(optional)</span>;

    return (
      <div
        className={classNames}
      >
        <div className="input-dropdown-label-container">
          <label
            className={"input-dropdown-label"}
            htmlFor={id}
          >
            {label} {!isRequired && optionalTag}
          </label>
          {description == "" ? (
            <></>
          ) : (
            <span className="input-dropdown-description">{description}</span>
          )}
        </div>
        <div
          ref={containerRef}
          className={"input-dropdown" + (isOpen ? " open" : "")}
          tabIndex={3}
          onClick={() => handleInputClick()}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          {selectedOpt !== "" || undefined ? (
            <span className="input-dropdown-selected"> {selectedOpt}</span>
          ) : (
            <span className="input-dropdown-placeholder">{placeholder}</span>
          )}
          <Icon iconName="chevron-down" addClasses="input-dropdown-chevron" />
          <div className="input-dropdown-optionlist">
            <ul className="input-dropdown-options" role="listbox">
              {options.map((option) => (
                <li
                  key={option.id}
                  id={option.id}
                  role="option"
                  aria-selected={selectedOpt === option.value}
                  className={option.value == selectedOpt ? "selected" : ""}
                  onClick={() => handleOptionSelect(option.value)}
                >
                  {option.text}
                </li>
              ))}
            </ul>
          </div>

          <input
            type="hidden"
            value={selectedOpt !== undefined ? selectedOpt : ""}
            readOnly
          />
        </div>
        <p className={"input-dropdown-errormessage"}>
          {errorMessage}
        </p>
      </div>
    );
}