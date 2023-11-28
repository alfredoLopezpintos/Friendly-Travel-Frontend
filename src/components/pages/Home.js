import React from "react";
import "../../App.css";
import Cards from "../Cards";
import HeroSectionFriendly from "../HeroSectionFriendly";
import Footer from "../Footer";
import Text from "../Text";

function Home() {
  return (
    <>
      <HeroSectionFriendly />
      <Text />
      <Cards />
      <Footer />
    </>
  );
}

export default Home;
