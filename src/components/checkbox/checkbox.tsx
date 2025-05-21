import { ChangeEvent, InputHTMLAttributes } from "preact/compat";
import { v4 as uuidv4 } from "uuid";

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
  ...props
}: Props) {

    const inputID = (!!id ? id : "checkbox-" + uuidv4());
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const target = event.target as HTMLInputElement;
    onChange(target.checked);
  }

  return (
    <div className="">
      <div className="">
        <input
        id={inputID}
          type="checkbox"
          checked={props.checked}
          onChange={handleChange}
          disabled={disabled}
          {...props}
        />
        <label for={inputID}>{label}</label>
      </div>
      {!!description ? (
        <div className="">
          <span className=""></span>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}