import React from "react";
import "./AboutPage.css";

const AboutPage: React.FC = () => {
  return (
    <div className="about-container">
      <h2 className="about-title">Our Story</h2>

      <p>
        At <strong>Howard's Farm</strong>, cooking isn’t just a passion—it’s a part of our heritage.
      </p>

      <img
        src="https://howardfarmblob.blob.core.windows.net/websiteimages/MostlyMexican.JPG"
        alt="Mostly Mexican Restaurant Ad"
        className="about-image"
      />

      <p>
        My wife and I both grew up surrounded by the warmth of home-cooked meals and the joy of sharing them with others.
        With her Spanish roots, she was raised on the tradition of making Mexican dishes from scratch—every meal filled with love, flavor, and family.
        Early in our relationship, we found ourselves working side-by-side in my mom’s restaurant, <strong>Mostly Mexican</strong>, in Lafayette, Colorado—a cozy spot known for authentic dishes and a welcoming atmosphere.
      </p>

      <img
        src="https://howardfarmblob.blob.core.windows.net/websiteimages/bbqcontest1.jpg"
        alt="Family at BBQ Competition"
        className="about-image"
      />

      <p>
        Food runs deep in our family. My mom owned and ran the restaurant, and my dad was a true barbecue enthusiast.
        We spent years traveling the country together, competing in BBQ contests big and small—including the incredible opportunity to compete at the
        <strong> Jack Daniel’s World Championship Invitational</strong> in 2012.
      </p>

      <img
        src="https://howardfarmblob.blob.core.windows.net/websiteimages/TheJack.jpg"
        alt="Jack Daniel's Competition - The Smoke Ring Team"
        className="about-image"
      />

      <p>
        Beyond competitions, my dad also created and ran <strong>TheSmokeRing.com</strong>, one of the internet’s largest BBQ communities and knowledge hubs.
        From smoker builds to rub recipes, it was a gathering place for pitmasters everywhere.
      </p>

      <img
        src="https://howardfarmblob.blob.core.windows.net/websiteimages/SmokeRingLogo.jpg"
        alt="The Smoke Ring Logo"
        className="about-image"
      />

      <p>
        Though he’s now retired, his passion and influence continue to inspire us.
        Over the years, we’ve poured ourselves into perfecting our recipes, experimenting with sauces, spices, baking, and slow-smoked barbecue.
        <strong> Howard’s Farm</strong> is our way of sharing that journey with you—every jar, bottle, or batch is a reflection of the traditions we grew up with and the flavors we love.
      </p>

      <p className="about-footer">
        Thank you for being part of our journey!
      </p>
    </div>
  );
};

export default AboutPage;

