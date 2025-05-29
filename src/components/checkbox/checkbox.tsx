import { ChangeEvent, InputHTMLAttributes } from "preact/compat";
import { v4 as uuidv4 } from "uuid";
import './checkbox.scss';
import Icon from "../icon/icon";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id?: string;
  description?: string;
  onChange: (selectedState: any) => void;
  disabled?: boolean;
}

export default function Checkbox({
  label,
  id,
  description,
  onChange,
  disabled,
  className,
  ...props
}: Props) {

    const inputID = (!!id ? id : "checkbox-" + uuidv4());
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const target = event.target as HTMLInputElement;
    onChange(target.checked);
  }

  return (
    <div className={"input-checkbox-container" + (!!className ? " " + className : "")}>
      <div className="input-checkbox-input-label-container">
        <input
        id={inputID}
          type="checkbox"
          checked={props.checked}
          onChange={handleChange}
          disabled={disabled}
          className="input-checkbox-input"
          {...props}
        />
        <div className={"input-checkbox-box" + (props.checked ? " selected" : "")}>
          <Icon iconName="check" addClasses="input-checkbox-check" />
        </div>
        <label for={inputID} className="input-checkbox-label">{label}</label>
      </div>
      {!!description ? (
        <div className="input-checkbox-description-container">
          <span className="input-checkbox-description">{description}</span>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}