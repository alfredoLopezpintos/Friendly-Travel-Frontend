import React from 'react';
import '../../App.css';
import Cards from '../Cards';
import HeroSection from '../HeroSection';
import Footer2 from '../Footer2';
import Text from '../Text';
import Faqs from '../Faqs';

function Home() {
  return (
    <>
      <HeroSection />
      <Text />
      <Cards />
      <Faqs />
      <Footer2 />
    </>
  );
}

export default Home;
