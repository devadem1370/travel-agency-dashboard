import { Featured, Hero, Navbar } from 'components'
import Footer from 'components/Footer'
import Handpicked from 'components/Handpicked'
import React from 'react'

const Home = () => {
  return (
    <>
    <div
  className=" px-[130px] bg-cover bg-center bg-no-repeat min-h-screen"
  style={{
    backgroundImage: `radial-gradient(circle at top left, #CFF1FFCC 40%, #FFFFFF00 50%), url('/assets/images/hero-img.png')`
  }}
>
  <Navbar />
  <Hero />
</div>
<div className="mx-[130px]">
  <Featured/>
  <Handpicked/>
  <Footer/>

</div>
    </>


  )
}

export default Home