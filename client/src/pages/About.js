import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";

const About = () => {
  return (
    <div className="about">
      <h1 className="about-head">About Us</h1>
      <div className="about-content">
        <img
          className="about-content-img"
          alt="profile"
          src="Images/profile.jpg"
        ></img>
        <div className="about-content-txt">
          <h2 className="about-content-txt-1">Mr. Amritanshu</h2>
          <h4 className="about-content-txt-2">
            Competitive Coder | Full Stack Developer
          </h4>
          <h3 className="about-content-txt-3">Find me on</h3>
          <div className="about-content-social">
            <a
              href="https://www.linkedin.com/in/amritanshu-gupta-982529201/"
              target="_blank"
              rel="noreferrer"
              className="about-content-social-1"
            >
              <FontAwesomeIcon
                className="about-content-social-icon"
                icon={faLinkedin}
              />
            </a>
            <a
              href="https://github.com/Amritanshu02"
              target="_blank"
              rel="noreferrer"
              className="about-content-social-2"
            >
              <FontAwesomeIcon
                className="about-content-social-icon"
                icon={faGithub}
              />
            </a>
          </div>
        </div>
      </div>
      <div className="about-proj">
        <h1 className="about-proj-head">What is the IPL auction?</h1>
        <p className="about-proj-para">
          It began back during my childhood days, the urge to play the IPL
          Auction depicting real players. I used to team up with my friends and
          play the auction manually with a pen and paper, with a organizer to
          keep track. Over the last 1 year, I wondered, can I do anything to
          make my experience better? So I came up with the idea of building a
          IPL auction app, based on the MERN stack. You can team up with your
          friends and dive into the fun world of auctioning IPL players. The
          application calculates the score generated by each team based on the
          performance of each player in the respective IPL year. The team with
          the most points wins. It's a fun application to experience the the
          real IPL Auction with friends. Simply create an account, gather your
          friends and jump straight into the auction.
        </p>
      </div>
    </div>
  );
};

export default About;
