import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import VideoPreview from '../components/VideoPreview'
import TrustedBy from '../components/TrustedBy'
import FeatureSection from '../components/FeatureSection'
import HowItWorks from '../components/HowItWorks'
import BrowseClasses from '../components/BrowseClasses'
import WhyLectureHub from '../components/WhyLectureHub'
import Testimonials from '../components/Testimonials'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
        <Navbar/>
        <Hero/>
        <VideoPreview/>
        <TrustedBy/>
        <FeatureSection/>
        <HowItWorks/>
        <BrowseClasses/>
        <WhyLectureHub/>
        <Testimonials/>
        <Footer/>
    </div>
  )
}

export default Home