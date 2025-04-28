import React, { ButtonHTMLAttributes } from "preact/compat";
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

    var classes = (addClasses === undefined ? "button-" + variant : addClasses + "button-" + variant);
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

    // if (variant === "filled") {
    //     return (
    //         <button className={"button-filled" + addClasses} type={type} name={name} title={text} {...props}>
    //             {!iconOnly && text}
    //             {icon && <Icon iconName={icon} addClasses="button-icon"/>}
    //             {/* {icon && <i className={icon}></i>} */}
    //             {/* {isLoading && <Loader size="small" color="neutral-100" />} */}
    //         </button>
    //     )
    // } else if (variant === "outline") {
    //     return (
    //         <button className={"button-outline" + addClasses} type={type} name={name} title={text} {...props}>
    //             {!iconOnly && text}
    //             {icon && <i className={icon}></i>}
    //             {/* {isLoading && <Loader size="small" color="interactive-500" />} */}
    //         </button>
    //     )
    // } else if (variant === "hollow") {
    //     return (
    //         <button className={"button-hollow" + addClasses} type={type} name={name} title={text} {...props}>
    //             {!iconOnly && text}
    //             {icon && <i className={icon}></i>}
    //         </button>
    //     )
    // } else {
    //     return (
    //         <button className={"button-hollow-square" + addClasses} type={type} name={name} title={text} {...props}>
    //             {!iconOnly && text}
    //             {icon && <i className={icon}></i>}
    //         </button>
    //     )
    // } 
}

export default Button;