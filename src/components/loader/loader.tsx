import './loader.scss';

interface Props {
    size: "small" | "large";
}

export default function Loader({size = "small"}: Props){
    let loader = <></>;

    if (size === "small") {
        let classes = "loader-small";
        loader = <span className={classes}></span>
    } else if (size === "large") {
        let classes = "loader-large";
        loader = <div className="loader-large-container"><span className={classes}></span></div>
    }

    return (loader)
}