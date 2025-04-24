import Typeography from "../typeography/typography";
import './tag.scss';


interface Props {
    copy: String;
    variant?: 'default' | 'secondary';
}

export default function Tag({copy, variant = "default"}:Props) {
    return (
        <div class={"tag-"+variant}>
            <Typeography copy={copy} style="body.xsmall" color="unset" />
        </div>
    )
}