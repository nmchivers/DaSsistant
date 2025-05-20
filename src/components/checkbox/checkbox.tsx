import { ChangeEvent, InputHTMLAttributes } from "preact/compat";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
//   selected: boolean;
  onChange: (selectedState:any) => void;
  disabled?: boolean;
}

export default function Checkbox({
  label,
  description,
//   selected = false,
  onChange,
  disabled,
  ...props
}: Props) {

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const target = event.target as HTMLInputElement;
        onChange(target.checked);
    }

  return (
    <div className="">
      <div className="">
        <input type="checkbox" checked={props.checked} onChange={handleChange} disabled={disabled} {...props}/>
        <label>{label}</label>
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