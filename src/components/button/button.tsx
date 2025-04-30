import { ButtonHTMLAttributes } from "preact/compat";
import './button.scss';
import Icon from "../icon/icon";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
    variant?: "filled" | "outline" | "hollow" | "hollow-square";
    icon?: string;
    iconOnly?: boolean;
    addClasses?: string | undefined;
    isLoading?: boolean;
}

function Button({
    text = "I'm a Button", 
    variant = "filled", 
    icon = "", 
    iconOnly = false, 
    addClasses = undefined, 
    type = "button", 
    name = text,
    isLoading = false,
    ...props}: Props) {

    var classes = (addClasses === undefined ? "button-" + variant : addClasses + " button-" + variant);
    if (iconOnly) {
        classes = classes + "-icon-only";
    }

    if (isLoading) {
        classes = classes + " is-loading";
    }

    return (
      <button
        className={classes}
        type={type}
        name={name}
        title={text}
        {...props}
      >
        {!iconOnly && text}
        {icon && <Icon iconName={icon} addClasses="button-icon" />}
        {/* {isLoading && <Loader size="small" color="neutral-100" />} */}
      </button>
    );
}

export default Button;