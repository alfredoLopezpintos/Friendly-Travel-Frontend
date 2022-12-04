import React from "react";
import "../../App.css";
import Cards from "../Cards";
import HeroSection from "../HeroSection";
import Footer from "../Footer";
import Text from "../Text";

function Home() {
  return (
    <>
      <HeroSection />
      <Text />
      <Cards />
      <Footer />
    </>
  );
}

export default Home;
