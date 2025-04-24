import './typeography.scss';

interface Props {
    copy: String;
    classes?: String;
    tagType?: "span" | "p" | "h1"| "h2" | "h3" | "h4" | "h5" | "h6" | "a";
    href?: String;
    style?: "headline.large" | "body.medium" | "body.small" | "body.xsmall" | "body.medium.highImp";
    color?: "default" | "supplementary" | "unset";
}

function Typeography({
    tagType = "span",
    style = "body.medium",
    color = "default",
    ...props
}:Props){
    if (style == "headline.large") {
        props.classes !== undefined ? props.classes = props.classes + " headline-large" : props.classes = "headline-large"
    } else if (style == "body.small") {
        props.classes !== undefined ? props.classes = props.classes + " body-small" : props.classes = "body-small"
    } else if (style == "body.xsmall") {
        props.classes !== undefined ? props.classes = props.classes + " body-xsmall" : props.classes = "body-xsmall"
    } else if (style == "body.medium.highImp") {
        props.classes !== undefined ? props.classes = props.classes + " body-medium-highImp" : props.classes = "body-medium-highImp"
    } else {
        props.classes !== undefined ? props.classes = props.classes + " body-medium" : props.classes = "body-medium"
    }

    if (color !== "unset") {
        props.classes !== undefined ? props.classes = props.classes + " color-" + color : props.classes = "color-" + color;
    }
    
    if (tagType == "p") {
        return(
            <p className={props.classes !== undefined ? props.classes.toString() : ""}>{props.copy}</p>
        )
    } else if (tagType == "h1") {
        return (
            <h1 className={props.classes !== undefined ? props.classes.toString() : ""}>{props.copy}</h1>
        )
    } else if (tagType == "h2") {
        return (
            <h2 className={props.classes !== undefined ? props.classes.toString() : ""}>{props.copy}</h2>
        )
    } else if (tagType == "h3") {
        return (
            <h3 className={props.classes !== undefined ? props.classes.toString() : ""}>{props.copy}</h3>
        )
    } else if (tagType == "h4") {
        return (
            <h4 className={props.classes !== undefined ? props.classes.toString() : ""}>{props.copy}</h4>
        )
    } else if (tagType == "h5") {
        return (
            <h5 className={props.classes !== undefined ? props.classes.toString() : ""}>{props.copy}</h5>
        )
    } else if (tagType == "h6") {
        return (
            <h6 className={props.classes !== undefined ? props.classes.toString() : ""}>{props.copy}</h6>
        )
    } else if (tagType == "a") {
        if (props.href !== undefined) {
            return (
                <a href={props.href.toString()} className={props.classes !== undefined ? props.classes.toString() : ""}>{props.copy}</a>
            )
        } else {
            return (
                <span className={props.classes !== undefined ? props.classes.toString() : ""}>{props.copy}</span>
            )
        }
    } else {
        return (
            <span className={props.classes !== undefined ? props.classes.toString() : ""}>{props.copy}</span>
        )
    }
}

export default Typeography;