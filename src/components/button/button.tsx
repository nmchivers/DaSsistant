import React, { ButtonHTMLAttributes } from "preact/compat";
import './button.scss';

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

    if (addClasses === undefined) {
        if (iconOnly) {
            addClasses = " icon-only";
        } else if (icon !== "") {
            addClasses = " has-icon";
        } else {
            addClasses = "";
        }
    } else {
        if (iconOnly) {
            addClasses = " " + addClasses + " icon-only";
        } else if (icon !== "") {
            addClasses = " " +  addClasses + " has-icon";
        } else {
            addClasses = " " +  addClasses;
        }
    }

    if (isLoading) {
        addClasses = addClasses + " is-loading";
    }

    if (variant === "filled") {
        return (
            <button className={"button-filled" + addClasses} type={type} name={name} title={text} {...props}>
                {!iconOnly && text}
                {icon && <i className={icon}></i>}
                {/* {isLoading && <Loader size="small" color="neutral-100" />} */}
            </button>
        )
    } else if (variant === "outline") {
        return (
            <button className={"button-outline" + addClasses} type={type} name={name} title={text} {...props}>
                {!iconOnly && text}
                {icon && <i className={icon}></i>}
                {/* {isLoading && <Loader size="small" color="interactive-500" />} */}
            </button>
        )
    } else if (variant === "hollow") {
        return (
            <button className={"button-hollow" + addClasses} type={type} name={name} title={text} {...props}>
                {!iconOnly && text}
                {icon && <i className={icon}></i>}
            </button>
        )
    } else {
        return (
            <button className={"button-hollow-square" + addClasses} type={type} name={name} title={text} {...props}>
                {!iconOnly && text}
                {icon && <i className={icon}></i>}
            </button>
        )
    } 
}

export default Button;