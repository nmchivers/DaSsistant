import Typeography from '../typeography/typography';
import './footer.scss';

export default function Footer(){
    return (
      <div className="footer-text-container">
        <div className="footer-text-one">
          <Typeography
            copy="MechaNick can make mistakes. Always double check information."
            style="body.small"
            color="supplementary"
            classes="footnote-centered"
          />
        </div>
        <div className="footer-text-two">
            <Typeography
                copy="Designed and built by Nick @ "
                style="body.small"
                color="supplementary"
                classes="footnote-centered"
            />
            <Typeography
                copy="NMChivers.Design"
                style="body.small"
                tagType='a'
                href="https://nmchivers.design"
                target="_blank"
                color='unset'
            />
        </div>
      </div>
    );
}