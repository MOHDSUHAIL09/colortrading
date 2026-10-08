import { Link } from 'react-router-dom';

// Bootstrap CSS (npm package se)
import 'bootstrap/dist/css/bootstrap.min.css';

// Bootstrap Icons CSS (agar icons bhi chahiye)
import 'bootstrap-icons/font/bootstrap-icons.css';

// Logo
import logoLisht from '../../assets/img/logo/logolisht.png';
import favicon from '../../assets/img/logo/favicon.png';
// Banner
import bannerThumb2 from '../../assets/img/bn/banner-thumb2.png';
import lineDash3 from '../../assets/img/bn/line-dash3.png';
import profileImg from '../../assets/img/bn/profile.jpg';
// Freelancer
import f1 from '../../assets/img/frelancer/f1.png';
import f2 from '../../assets/img/frelancer/f2.png';
import f3 from '../../assets/img/frelancer/f3.png';
import f7 from '../../assets/img/frelancer/f7.png';
import f8 from '../../assets/img/frelancer/f8.png';
import f9 from '../../assets/img/frelancer/f9.png';
import f10 from '../../assets/img/frelancer/f10.png';
// Custom Icons
import job60 from '../../assets/img/custom-icon/job60.png';
import frelancer60 from '../../assets/img/custom-icon/frelancer60.png';
import working60 from '../../assets/img/custom-icon/working60.png';
import payment60 from '../../assets/img/custom-icon/payment60.png';
// Choose Images
import chooseai1 from '../../assets/img/choose/chooseai1.jpg';
import chooseai2 from '../../assets/img/choose/chooseai2.jpg';
import chooseai3 from '../../assets/img/choose/chooseai3.jpg';
import chooseai4 from '../../assets/img/choose/chooseai4.jpg';
// Element Images
import chooseElement from '../../assets/img/choose/choose-element.png';
import chooseElement4 from '../../assets/img/choose/choose-element4.png';
// Category Icons
import ainlp from '../../assets/img/categories/ainlp.png';
import dataScient from '../../assets/img/categories/data-scient.png';
import aibraind from '../../assets/img/categories/aibraind.png';
import deepLearning from '../../assets/img/categories/deep-learning.png';
import bigrobotic from '../../assets/img/categories/bigrobotic.png';
import airound from '../../assets/img/categories/airound.png';
import chatbot from '../../assets/img/categories/chatbot.png';
import dataAnalysis from '../../assets/img/categories/data-analysis.png';
// Feature Icons
import searchBase2 from '../../assets/img/categories/searchbase2.png';
import aibrainBase2 from '../../assets/img/categories/aibrainbase2.png';
import airoundBase2 from '../../assets/img/categories/airoundbase2.png';
import qualityBase2 from '../../assets/img/categories/qualitybase2.png';
// About Images
import aboutImg from '../../assets/img/about/about.png';
import lineBase from '../../assets/img/about/linebase.png';
import lineBase2 from '../../assets/img/about/linebase2.png';
// App Store Images
import appStore from '../../assets/img/app/appstore.png';
import googlePlay from '../../assets/img/app/googlepaly.png';
import app1 from '../../assets/img/app/app1.png';

// FAQ Images
import ha1 from '../../assets/img/faq/ha1.png';
import ha2 from '../../assets/img/faq/ha2.png';
import ha3 from '../../assets/img/faq/ha3.png';
import ha4 from '../../assets/img/faq/ha4.png';
import ha5 from '../../assets/img/faq/ha5.png';
import faqImg from '../../assets/img/faq/faq.jpg';
import faqCircle from '../../assets/img/faq/faq-circle.png';
import faqLine from '../../assets/img/faq/faqline.png';

// Task Images
import task1 from '../../assets/img/task/tast1.jpg';
import task2 from '../../assets/img/task/tast2.jpg';

import robotVideo from '../../assets/video/robort.mp4';

import '../../assets/css/landingcss.css';
import { useEffect } from 'react';

const LandingPage = () => {
  // Smooth scroll handler
  const handleScroll = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 80; // sticky header height
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  // Add scrolled class to header on scroll
  useEffect(() => {
    const header = document.getElementById('sticky-header');
    const onScroll = () => {
      if (window.scrollY > 50) {
        header?.classList.add('header--scrolled');
      } else {
        header?.classList.remove('header--scrolled');
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Sticky Header */}
      <style>{`
        #sticky-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 9999;
          transition: all 0.35s ease;
          background: transparent;
        }
      `}</style>

      <div id="sticky-header">
        <div className="header__section__attachment header__section__two">
          <div className="aihire__headertop">
            <div className="container">
              <div className="haderbar__top header__toptwo d-flex align-items-center justify-content-between">
                <div className="logo__left d-flex align-items-center">
                  <Link to="/" className="top__logo" onClick={(e) => handleScroll(e, 'hero')}>
                    <img src={logoLisht} alt="logo" />
                  </Link>
                  </div>
<div
  className='d-none d-sm-flex'
  style={{ fontSize: "15px", fontWeight: "800", gap: "24px" }}
>


  <a href="#hero" className="text-white mdnone inter fw-400 nav-link-item"
     onClick={(e) => handleScroll(e, 'hero')}>
    Home
  </a>
  <a href="#work" className="text-white mdnone inter fw-400 nav-link-item"
     onClick={(e) => handleScroll(e, 'work')}>
    Work
  </a>
  <a href="#why-choose" className="text-white mdnone inter fw-400 nav-link-item"
     onClick={(e) => handleScroll(e, 'why-choose')}>
    Why Choose Us
  </a>
  <a href="#about" className="text-white mdnone inter fw-400 nav-link-item"
     onClick={(e) => handleScroll(e, 'about')}>
    About us
  </a>
  <a href="#faq" className="text-white mdnone inter fw-400 nav-link-item"
     onClick={(e) => handleScroll(e, 'faq')}>
    Faq
  </a>
</div>
                
                <div className="header__topsearch d-flex align-items-center">
                  <button type="button" id="searchBtn" className="d-lg-none">
                    <i className="bi bi-search"></i>
                  </button>

                  <Link to="/login">
                    <div className="cmn--btn">
                      <span>Login</span>
                    </div>
                  </Link>
                  <Link to="/signup">
                    <div className="cmn--btn">
                      <span>Signup</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section Here */}
      <div
        id="hero"
        className="header__section__two banner__section bg__img1 ralt overhid"
        style={{ background: '#000000', paddingTop: '100px' }}
      >
        <div className="container">
          <div className="banner__content__wrapper">
            <div className="row justify-content-between align-items-center">
              <div className="col-xl-6 col-lg-7">
                <div className="banner__content banner__twospace banner__contenttwospace ralt">
                  <h4 className="base2 mb-16 wow fadeInDown">Invest Smart, Trade Smarter</h4>

                  <span className="d2 text-white mb-24 fw-600 wow fadeInUp">
                    The Power of Intelligent
                    <a href="#" className="hover">
                       AI
                    </a>{' '}
                    Trading
                  </span>
                  <p className="fz-20 fw-400 text-white inter mb-40 wow fadeInDown">
                    Whether you're just starting or you're a seasoned trader, our platform offers
                    comprehensive secure.
                  </p>
                  <div className="banner__btn2 d-flex align-items-center">
 <Link to="/login">
                    <div className="cmn--btn2">
                      <span>Start Tradding</span>
                    </div>
                    </Link>

                  </div>
                </div>
              </div>
              <div className="col-xl-5 col-lg-5">
                <div className="banner__thumb2 banner__thumbcustom">
                  <video
                    src={robotVideo}
                    className="rounded banner__thumb2 banner__thumbcustom"
                    style={{ background: 'transparent', display: 'block' }}
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*Element*/}
        <img src={lineDash3} className="line__hotemtwo" alt="img" />
        {/*Element*/}
      </div>
      {/* Hero Section End */}

      {/* timely worktwo Here */}
      <section id="work" className="timely__wortwo bg__all pb-120 pt-120">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="section__title text-center mb-60">
                <h4 className="sub ralt base mb-16 wow fadeInUp" data-wow-duration="0.5s">
                 Explore Apex
                </h4>
                <h2 className="ptext2 fz-20 fw-400 inter wow fadeInUp" data-wow-duration="0.7s">
                   Coin Apexmindai is the easiest, safest, and fastest way to buy & sell crypto asset exchange.
                </h2>
              </div>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 wow fadeInUp">
              <div className="timelytwo__work text-center">
                <div className="iconbox d-flex align-items-center justify-content-center">
                  <div className="iinner d-flex align-items-center justify-content-center">
                    <img src={job60} alt="icon" />
                  </div>
                </div>
                <div className="content">
                  <h4 className="mb-10 title">
                    <a href="fearuedjob.html" className="title">
                    Price Prediction
                    </a>
                  </h4>
                  <p className="fz-14 fw-400 title inter">
                   Predict the movement of crypto prices and earn rewards for accurate forecasts.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 wow fadeInDown">
              <div className="timelytwo__work text-center">
                <div className="iconbox d-flex align-items-center justify-content-center">
                  <div className="iinner d-flex align-items-center justify-content-center">
                    <img src={frelancer60} alt="icon" />
                  </div>
                </div>
                <div className="content">
                  <h4 className="mb-10 title">
                    <a href="fearuedjob.html" className="title">
                     Real-Time Insights
                    </a>
                  </h4>
                  <p className="fz-14 fw-400 title inter">
                    Get live market data and analytics to make informed trading decisions.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 wow fadeInUp">
              <div className="timelytwo__work text-center">
                <div className="iconbox d-flex align-items-center justify-content-center">
                  <div className="iinner d-flex align-items-center justify-content-center">
                    <img src={working60} alt="icon" />
                  </div>
                </div>
                <div className="content">
                  <h4 className="mb-10 title">
                    <a href="fearuedjob.html" className="title">
                     Risk-Free Trading
                    </a>
                  </h4>
                  <p className="fz-14 fw-400 title inter">
                   Trade without buying or selling crypto—just predict price movements and win.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 wow fadeInDown">
              <div className="timelytwo__work text-center">
                <div className="iconbox d-flex align-items-center justify-content-center">
                  <div className="iinner d-flex align-items-center justify-content-center">
                    <img src={payment60} alt="icon" />
                  </div>
                </div>
                <div className="content">
                  <h4 className="mb-10 title">
                    <a href="fearuedjob.html" className="title">
                      Make Secure Payments
                    </a>
                  </h4>
                  <p className="fz-14 fw-400 title inter">
                    Create your free job posting and start receiving Quotes within hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* timely worktwo End */}

      {/* Choose Here */}
      <section
        id="why-choose"
        className="choose__section bgchoose__all ralt pb-120 pt-120 header__section__two"
      >
        <div className="container">
          <div className="row g-4 justify-content-between align-items-center">
            <div className="col-xl-6 col-lg-6">
              <div className="choose__content">
                <div className="section__title mb-30">
                  <h4 className="sub ralt base2 mb-16 wow fadeInUp" data-wow-duration="1.1s">
                    Why Choose Us
                  </h4>
                  <h2 className="text-white mb-24 wow fadeInUp" data-wow-duration="1.2s">
                    Harnessing the Potential of Artificial Intelligence
                  </h2>
                  <p className="text-white fz-16 fw-400 inter wow fadeInUp" data-wow-duration="1.4s">
                    Our platform connects you with talented AI freelancers from around the world who
                    can help you with your projects and tasks, no matter how big or small.
                  </p>
                </div>
                <ul className="choose__checklist mb-16 d-flex flex-wrap">
                  <li
                    className="d-flex align-items-center gap-2 mb-16 wow fadeInUp"
                    data-wow-duration="1.7s"
                  >
                    <i className="bi bi-check2-circle base2 fz-24"></i>
                    <span className="fz-20 fw-500 inter">Get High Quality Work</span>
                  </li>
                  <li
                    className="d-flex align-items-center gap-2 mb-16 wow fadeInUp"
                    data-wow-duration="1.7s"
                  >
                    <i className="bi bi-check2-circle base2 fz-24"></i>
                    <span className="fz-20 fw-500 inter">Stick to your budget service</span>
                  </li>
                  <li
                    className="d-flex align-items-center gap-2 mb-16 wow fadeInUp"
                    data-wow-duration="1.7s"
                  >
                    <i className="bi bi-check2-circle base2 fz-24"></i>
                    <span className="fz-20 fw-500 inter">Pay when you're happy</span>
                  </li>
                  <li
                    className="d-flex align-items-center gap-2 mb-16 wow fadeInUp"
                    data-wow-duration="1.7s"
                  >
                    <i className="bi bi-check2-circle base2 fz-24"></i>
                    <span className="fz-20 fw-500 inter">Pay when you're happy</span>
                  </li>
                </ul>
                <Link to="/login">
                <div className="cmn--btn2">
                  <span>Read More</span>
                  <span className="ps-1">
                    <i className="bi bi-arrow-up-right"></i>
                  </span>
                </div>
                </Link>
              </div>
            </div>
            <div className="col-xl-5 col-lg-5">
              <div className="choose__thumbwrapper d-flex ralt">
                <div className="thumb__item pe-4 wow fadeInDown">
                  <img src={chooseai1} className="round16 mb-24 item__img" alt="img" />
                  <img src={chooseai2} className="round16 item__img" alt="img" />
                </div>
                <div className="thumb__item thumb__space60 wow fadeInDown">
                  <img src={chooseai3} className="round16 mb-24 item__img" alt="img" />
                  <img src={chooseai4} className="round16 item__img" alt="img" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Element */}
        <img src={chooseElement} className="choose__doubble" alt="element" />
        <img src={chooseElement4} className="choose__bottom" alt="element" />
        {/* Element */}
      </section>
      {/* Choose End */}

      {/* categrory worktwo Here */}
      <section className="categoris__section sectionbg pb-120 pt-120">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="section__title text-center mb-60">
                <h4 className="sub ralt base mb-16 wow fadeInUp" data-wow-duration="0.5s">
                App Highlights
                </h4>
                {/* <h2 className="title mb-24 wow fadeInUp" data-wow-duration="0.7s">
                  Trending Top Categories Uncovered
                </h2> */}
                <h2 className="ptext2 fz-20 fw-400 inter wow fadeInUp" data-wow-duration="0.9s">
                  Our AI freelancer marketplace is more than just a platform. It's a community of
                  professionals who are passionate about AI
                </h2>
              </div>
            </div>
          </div>
          <div className="row g-4 mb-40 justify-content-center">
            <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 wow fadeInUp">
              <div className="categoris__item round16 bgwhite border">
                <div className="boxes">
                  <div className="icon mb-24 ralt">
                    <img src={ainlp} alt="icon" />
                  </div>
                  <div className="content">
                    <h4 className="mb-10 title">
                      <a href="fearuedjob.html" className="title">
                       Accurate
                      </a>
                    </h4>
                    <p className="fz-16 fw-400 title inter">
                      Predict crypto price movements with precision and stay ahead in the market.
                    </p>
                  </div>
                </div>
              <Link to="/login">
               <div className="d-flex readmore align-items-center gap-2">
                  <span className="fz-16 transition fw-600 base inter">Read More</span>
                  <span>
                    <i className="bi bi-arrow-right transition fz-18 base"></i>
                  </span>
                </div>
                </Link>
              </div>
            </div>
            <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 wow fadeInUp">
              <div className="categoris__item round16 bgwhite border">
                <div className="boxes">
                  <div className="icon mb-24 ralt">
                    <img src={dataScient} alt="icon" />
                  </div>
                  <div className="content">
                    <h4 className="mb-10 title">
                      <a href="fearuedjob.html" className="title">
                        Secure & Reliable
                      </a>
                    </h4>
                    <p className="fz-16 fw-400 title inter">
                     Trade with confidence using our rock-solid security and encrypted transactions.
                    </p>
                  </div>
                </div>
                   <Link to="/login">
                <div className="d-flex readmore align-items-center gap-2">
                  <span className="fz-16 transition fw-600 base inter">Read More</span>
                  <span>
                    <i className="bi bi-arrow-right transition fz-18 base"></i>
                  </span>
                </div>
                </Link>
              </div>
            </div>
            <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 wow fadeInUp">
              <div className="categoris__item round16 bgwhite border">
                <div className="boxes">
                  <div className="icon mb-24 ralt">
                    <img src={aibraind} alt="icon" />
                  </div>
                  <div className="content">
                    <h4 className="mb-10 title">
                      <a href="fearuedjob.html" className="title">
                       Instant Results
                      </a>
                    </h4>
                    <p className="fz-16 fw-400 title inter">
                     Get real-time prediction outcomes in seconds and react to market changes fast!
                    </p>
                  </div>
                </div>
                   <Link to="/login">
                <div className="d-flex readmore align-items-center gap-2">
                  <span className="fz-16 transition fw-600 base inter">Read More</span>
                  <span>
                    <i className="bi bi-arrow-right transition fz-18 base"></i>
                  </span>
                </div>
                </Link>
              </div>
            </div>
            <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 wow fadeInUp">
              <div className="categoris__item round16 bgwhite border">
                <div className="boxes">
                  <div className="icon mb-24 ralt">
                    <img src={deepLearning} alt="icon" />
                  </div>
                  <div className="content">
                    <h4 className="mb-10 title">
                      <a href="fearuedjob.html" className="title">
                       Smart Trading Bot
                      </a>
                    </h4>
                    <p className="fz-16 fw-400 title inter">
                      Let our AI-powered bot analyze the market and trade for you automatically.
                    </p>
                  </div>
                </div>
                   <Link to="/login">
                <div className="d-flex readmore align-items-center gap-2">
                  <span className="fz-16 transition fw-600 base inter">Read More</span>
                  <span>
                    <i className="bi bi-arrow-right transition fz-18 base"></i>
                  </span>
                </div>
                </Link>
              </div>
            </div>

            {/* <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 wow fadeInDown">
              <div className="categoris__item round16 bgwhite border">
                <div className="boxes">
                  <div className="icon mb-24 ralt">
                    <img src={bigrobotic} alt="icon" />
                  </div>
                  <div className="content">
                    <h4 className="mb-10 title">
                      <a href="fearuedjob.html" className="title">
                        Robotics Engineer
                      </a>
                    </h4>
                    <p className="fz-16 fw-400 title inter">
                      Our AI freelancer marketplace is more than just a platform
                    </p>
                  </div>
                </div>
                   <Link to="/login">
                <div className="d-flex readmore align-items-center gap-2">
                  <span className="fz-16 transition fw-600 base inter">Read More</span>
                  <span>
                    <i className="bi bi-arrow-right transition fz-18 base"></i>
                  </span>
                </div>
                </Link>
              </div>
            </div>
            <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 wow fadeInDown">
              <div className="categoris__item round16 bgwhite border">
                <div className="boxes">
                  <div className="icon mb-24 ralt">
                    <img src={airound} alt="icon" />
                  </div>
                  <div className="content">
                    <h4 className="mb-10 title">
                      <a href="fearuedjob.html" className="title">
                        AI Consultants
                      </a>
                    </h4>
                    <p className="fz-16 fw-400 title inter">
                      Our AI freelancer marketplace is more than just a platform
                    </p>
                  </div>
                </div>
                   <Link to="/login">
                <div className="d-flex readmore align-items-center gap-2">
                  <span className="fz-16 transition fw-600 base inter">Read More</span>
                  <span>
                    <i className="bi bi-arrow-right transition fz-18 base"></i>
                  </span>
                </div>
                </Link>
              </div>
            </div>
            <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 wow fadeInDown">
              <div className="categoris__item round16 bgwhite border">
                <div className="boxes">
                  <div className="icon mb-24 ralt">
                    <img src={chatbot} alt="icon" />
                  </div>
                  <div className="content">
                    <h4 className="mb-10 title">
                      <a href="fearuedjob.html" className="title">
                        Chatbot Developers
                      </a>
                    </h4>
                    <p className="fz-16 fw-400 title inter">
                      Our AI freelancer marketplace is more than just a platform
                    </p>
                  </div>
                </div>
                   <Link to="/login">
                <div className="d-flex readmore align-items-center gap-2">
                  <span className="fz-16 transition fw-600 base inter">Read More</span>
                  <span>
                    <i className="bi bi-arrow-right transition fz-18 base"></i>
                  </span>
                </div>
                </Link>
              </div>
            </div>
            <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 wow fadeInDown">
              <div className="categoris__item round16 bgwhite border">
                <div className="boxes">
                  <div className="icon mb-24 ralt">
                    <img src={dataAnalysis} alt="icon" />
                  </div>
                  <div className="content">
                    <h4 className="mb-10 title">
                      <a href="fearuedjob.html" className="title">
                        Data Analysts
                      </a>
                    </h4>
                    <p className="fz-16 fw-400 title inter">
                      Our AI freelancer marketplace is more than just a platform
                    </p>
                  </div>
                </div>
                   <Link to="/login">
                <div className="d-flex readmore align-items-center gap-2">
                  <span className="fz-16 transition fw-600 base inter">Read More</span>
                  <span>
                    <i className="bi bi-arrow-right transition fz-18 base"></i>
                  </span>
                </div>
                </Link>
              </div>
            </div> */}
          </div>
          {/* <div className="text-center">
            <a href="#" className="cmn--btn outline__btn">
              <span>See All Categories</span>
              <span className="ps-1">
                <i className="bi bi-arrow-up-right"></i>
              </span>
            </a>
          </div> */}
        </div>
      </section>
      {/* categrory worktwo End */}

      {/* about section Here */}
      <section
        id="about"
        className="about__section bg__about overhid pt-120 pb-120 header__section__two"
      >
        <div className="container">
          <div className="row justify-content-between align-items-center g-4">
            <div className="col-xxl-6 col-xl-6 col-lg-7">
              <div className="abotus__content">
                <div className="section__title mb-40">
                  <h4 className="sub ralt base2 mb-16 wow fadeInUp" data-wow-duration="1.1s">
                    About us
                  </h4>
                  <h2 className="text-white mb-24 wow fadeInUp" data-wow-duration="1.2s">
                    Connecting AI Talent with Opportunities
                  </h2>
                  <p className="whitep fz-16 fw-400 inter wow fadeInUp" data-wow-duration="1.4s">
                    At our AI Freelancer Marketplace, we understand that success stems from building
                    amazing teams. We provide the platform and resources to connect you
                  </p>
                </div>
                <div className="row g-4 mb-40">
                  <div className="col-xxl-6 col-xl-9 col-lg-8 col-md-6 wow fadeInDown">
                    <div className="perfoming__item d-flex">
                      <div className="cmn__ibox transition d-flex align-items-center justify-content-center boxes1 round50">
                        <img src={searchBase2} alt="machine" />
                      </div>
                      <div className="content">
                        <h5 className="text-white mb-10">Access Opportunities</h5>
                        <p className="fz-14 fw-400 inter whitep">
                          Our marketplace provides a platform for talented AI
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxl-6 col-xl-9 col-lg-8 col-md-6 wow fadeInDown">
                    <div className="perfoming__item d-flex">
                      <div className="cmn__ibox transition d-flex align-items-center justify-content-center boxes1 round50">
                        <img src={aibrainBase2} alt="machine" />
                      </div>
                      <div className="content">
                        <h5 className="text-white mb-10">Increased Visibility</h5>
                        <p className="fz-14 fw-400 inter whitep">
                          By joining our marketplace, talented individuals can increase
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxl-6 col-xl-9 col-lg-8 col-md-6 wow fadeInDown">
                    <div className="perfoming__item d-flex">
                      <div className="cmn__ibox transition d-flex align-items-center justify-content-center boxes1 round50">
                        <img src={airoundBase2} alt="machine" />
                      </div>
                      <div className="content">
                        <h5 className="text-white mb-10">Access to AI Talent</h5>
                        <p className="fz-14 fw-400 inter whitep">
                          Our marketplace provides a curated pool of talented AI
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxl-6 col-xl-9 col-lg-8 col-md-6 wow fadeInDown">
                    <div className="perfoming__item d-flex">
                      <div className="cmn__ibox transition d-flex align-items-center justify-content-center boxes1 round50">
                        <img src={qualityBase2} alt="machine" />
                      </div>
                      <div className="content">
                        <h5 className="text-white mb-10">Quality Assurance</h5>
                        <p className="fz-14 fw-400 inter whitep">
                          We ensure a rigorous vetting process for talent on our
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <a href="employer-details.html" className="cmn--btn2">
                  <span>Explore More</span>
                  <span className="ps-1">
                    <i className="bi bi-arrow-up-right"></i>
                  </span>
                </a>
              </div>
            </div>
            <div className="col-xxl-5 col-xl-5 col-lg-5 wow fadeInDown">
              <div className="about__shapethumb">
                <img src={aboutImg} alt="perfoming" />
                <div className="experience__box round16 d-flex align-items-center gap-3">
                  <span className="d2 text-white">30+</span>
                  <span className="fz-18 fw-500 inter text-white">Years of experience</span>
                </div>
                <img src={lineBase} className="linebase__bottom" alt="img" />
                <img src={lineBase2} className="linebase__top" alt="img" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* about section End */}

      {/* App Here */}
      <section className="app__section ralt bg__all pb-120 pt-120">
        <div className="container">
          <div className="row g-4 align-items-center justify-content-between">
            <div className="col-xl-6 col-lg-7">
              <div className="app__content">
                <div className="section__title mb-30">
                  <h4 className="sub ralt base mb-16 wow fadeInDown">Download Our Apps</h4>
                  <h2 className="title mb-24 wow fadeInUp">
                    Get Our Mobile App for Free and Unlock a World
                  </h2>
                  <p className="ptext2 fz-16 fw-400 inter wow fadeInDown">
                    Download our free mobile app today from the App Store or Google Play Store and
                    discover a whole new level of convenience and accessibility.
                  </p>
                </div>
                <div className="app__store d-flex align-items-center gap-3 flex-wrap wow fadeInDown">
                  <a href="javascript:void(0)">
                    <img src={appStore} alt="app" />
                  </a>
                  <a href="javascript:void(0)">
                    <img src={googlePlay} alt="app" />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-xl-5 col-lg-5">
              <div className="app__thumb ralt">
                <img src={app1} alt="card" className="w-100" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* App End */}

      {/* Faq Here */}
      <section id="faq" className="faq__section bg__faq pb-120 pt-120 header__section__two">
        <div className="container">
          <div className="row flex-row-reverse g-4 align-items-center justify-content-between">
            <div className="col-xl-6 col-lg-7">
              <div className="faq__content">
                <div className="section__title mb-40">
                  <h4 className="sub ralt base2 mb-16 wow fadeInUp">
                    Frequently Asked Questions
                  </h4>
                  <h2 className="text-white mb-24 wow fadeInDown">
                    Find solutions to common questions For AIHire
                  </h2>
                  <p className="whitep fz-16 fw-400 inter wow fadeInUp">
                    Welcome to our Frequently Asked Questions (FAQs) section, designed to provide you
                    with answers to common inquiries and help you navigate our platform
                  </p>
                </div>
                <div className="accordion__wrap">
                  <div className="accordion" id="accordionExample">
                    {/* Accordion items */}
                    <div className="accordion-item wow fadeInDown" data-wow-duration="0.7s">
                      <div className="accordion-header" id="headingTwo">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseTwo"
                          aria-expanded="false"
                          aria-controls="collapseTwo"
                        >
                          1. What is the Apex app?
                        </button>
                        <div
                          id="collapseTwo"
                          className="accordion-collapse collapse"
                          aria-labelledby="headingTwo"
                          data-bs-parent="#accordionExample"
                        >
                          <div className="accordion-body">
                            <p>
                             Apex is a trading prediction platform where users can bet on crypto price movements and win rewards.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Accordion items */}
                    <div className="accordion-item wow fadeInDown" data-wow-duration="0.9s">
                      <h2 className="accordion-header" id="headingOne">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseOne"
                          aria-expanded="true"
                          aria-controls="collapseOne"
                        >
                          2. Does Apex involve real trading?
                        </button>
                      </h2>
                      <div
                        id="collapseOne"
                        className="accordion-collapse collapse"
                        aria-labelledby="headingOne"
                        data-bs-parent="#accordionExample"
                      >
                        <div className="accordion-body">
                          <p>
                         No, users do not buy or sell crypto assets. Instead, they predict whether the price will go up or down and earn rewards based on their predictions.
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Accordion items */}
                    <div className="accordion-item wow fadeInDown" data-wow-duration="1s">
                      <h2 className="accordion-header" id="headingThree">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseThree"
                          aria-expanded="false"
                          aria-controls="collapseThree"
                        >
                          3. How does the trading bot work?How can I improve my credit score?
                        </button>
                      </h2>
                      <div
                        id="collapseThree"
                        className="accordion-collapse collapse"
                        aria-labelledby="headingThree"
                        data-bs-parent="#accordionExample"
                      >
                        <div className="accordion-body">
                          <p>
                         Apexmindai's AI-powered trading bot analyzes market trends and makes automated trading decisions to increase your chances of winning.
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Accordion items */}
                    <div className="accordion-item wow fadeInDown" data-wow-duration="1.4s">
                      <h2 className="accordion-header" id="headingThree4">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseThree4"
                          aria-expanded="false"
                          aria-controls="collapseThree"
                        >
                          4. Do I need to trade manually to use the bot?
                        </button>
                      </h2>
                      <div
                        id="collapseThree4"
                        className="accordion-collapse collapse"
                        aria-labelledby="headingThree4"
                        data-bs-parent="#accordionExample"
                      >
                        <div className="accordion-body">
                          <p>
                         No, the bot is fully automated. You just need to set your preferences, and the bot will trade for you without any manual effort.
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Accordion items */}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-5 col-lg-5">
              <div className="faq__thumbs ralt">
                <img src={faqImg} className="round16 w-100" alt="card" />
                <div className="video__thumb d-flex align-items-center justify-content-center">
                  <img src={faqCircle} alt="circle" />
                  <a
                    href="https://www.youtube.com/watch?v=wXNv-x5zVgE&ab_channel=KnotebookNetwork%27s"
                    className="video-btn d-flex align-items-center justify-content-center"
                  >
                    <i className="bi bi-play"></i>
                  </a>
                </div>
                <img src={faqLine} alt="img" className="faqline" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Faq End */}

      {/* task categorish Section Here */}
      <section className="task__hiresection ralt pt-120 pb-120">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xxl-6 col-xl-8 col-lg-8">
              <div className="section__title text-center ralt mb-60">
                <h4 className="sub ralt base mb-16 wow fadeInUp" data-wow-duration="1.1s">
                 Start Your Trading Journey 
                </h4>
                <p className="pra fz-16 inter fw-400">
                 Explore global markets, discover trading opportunities, and make informed decisions with smart tools designed to support your trading journey.

                </p>
              </div>
            </div>
          </div>
          <div className="row ralt g-4">
            <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 wow fadeInDown">
              <div className="task__item round16 bgwhite d-flex align-items-center">
                <div className="thumb">
                  <img src={task1} alt="img" />
                </div>
                <div className="content">
                  <h3 className="inter title mb-24">I need a task done</h3>
                  <p className="fz-16 fw-400 inter pra mb-40">
                    Have a specific AI task that needs to be completed? Look no further!
                  </p>
                  <a href="freelancer-details.html" className="cmn--btn outline__btn">
                    <span>View services</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 wow fadeInUp">
              <div className="task__item round16 bgwhite d-flex align-items-center">
                <div className="thumb">
                  <img src={task2} alt="img" />
                </div>
                <div className="content">
                  <h3 className="inter title mb-24">I am a freelancer</h3>
                  <p className="fz-16 fw-400 inter pra mb-40">
                    Are you an AI professional looking for exciting freelance opportunities?
                  </p>
                  <a href="freelancer.html" className="cmn--btn outline__btn">
                    <span>List a Service</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* task categorish Section End */}

      {/* Footer Section */}
      <footer className="footer__section bgadd" style={{ background: '#13203B' }}>
        <div className="container">
          <div className="footer__top pt-120 pb-120">
            <div className="row g-4">
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 wow fadeInDown">
                <div className="footer__item">
                  <a href="index.html" className="footer__logo mb-24 d-block">
                    <img src={logoLisht} alt="logo" />
                  </a>
                  <p className="pfz-16 inter fw-400 cef__pra mb-30">
                    Join our community of businesses, entrepreneurs, and freelancers who are
                    passionate about AI and its potential
                  </p>
                  <ul className="social d-flex align-items-center">
                    <li>
                      <a href="javascript:void(0)">
                        <i className="bi bi-facebook"></i>
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0)">
                        <i className="bi bi-twitter"></i>
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0)">
                        <i className="bi bi-pinterest"></i>
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0)">
                        <i className="bi bi-instagram"></i>
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0)">
                        <i className="bi bi-skype"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xxl-2 col-xl-2 col-lg-2 col-md-6 col-sm-6 wow fadeInUp">
                <div className="footer__item">
                  <a
                    href="javascript:void(0)"
                    className="footer__title fz-24 fw-600 inter text-white mb-24 d-block"
                  >
                    Quick Link
                  </a>
                  <ul className="quick__link">
                    <li>
                      <a href="about.html" className="fz-16 fw-400 inter cef__pra d-block">
                        About us
                      </a>
                    </li>
                    <li>
                      <a href="#0" className="fz-16 fw-400 inter cef__pra d-block">
                        Browse Job
                      </a>
                    </li>
                    <li>
                      <a href="#0" className="fz-16 fw-400 inter cef__pra d-block">
                        Find Talent
                      </a>
                    </li>
                    <li>
                      <a href="faqs.html" className="fz-16 fw-400 inter cef__pra d-block">
                        FAQs
                      </a>
                    </li>
                    <li>
                      <a href="blog.html" className="fz-16 fw-400 inter cef__pra d-block">
                        Blog
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 wow fadeInDown">
                <div className="footer__item">
                  <a
                    href="javascript:void(0)"
                    className="footer__title fz-24 fw-600 inter text-white mb-24 d-block"
                  >
                    Contact
                  </a>
                  <ul className="footer__contact">
                    <li>
                      <a
                        href="javascript:void(0)"
                        className="fz-16 d-flex align-items-center gap-3 fw-400 inter cef__pra d-block"
                      >
                        <i className="bi bi-telephone-plus cmn__icon cmn__icon"></i>
                        <span>(316) 555-0116</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="javascript:void(0)"
                        className="fz-16 d-flex align-items-center gap-3 fw-400 inter cef__pra d-block"
                      >
                        <i className="bi bi-envelope-open cmn__icon"></i>
                        <span>
                          <span className="__cf_email__" data-cfemail="94fdfaf2fbd4f1ecf5f9e4f8f1baf7fbf9">
                            [email&#160;protected]
                          </span>
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="javascript:void(0)"
                        className="fz-16 d-flex align-items-center gap-3 fw-400 inter cef__pra d-block"
                      >
                        <i className="bi bi-geo-alt cmn__icon"></i>
                        <span>31 Brandy Way, Sutton, SM2 6SE</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 wow fadeInUp">
                <div className="footer__item">
                  <a
                    href="javascript:void(0)"
                    className="footer__title fz-24 fw-600 inter text-white mb-24 d-block"
                  >
                    Newsletter
                  </a>
                  <p className="pfz-16 fw-400 inter cef__pra mb-24">
                    Subscribe our newsletter to get our latest update & news
                  </p>
                  <form action="#0" className="d-flex align-items-center">
                    <input type="text" placeholder="Email address" />
                    <button type="submit" className="cmn--btn">
                      <span>
                        <i className="bi bi-cursor"></i>
                      </span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="footer__bottom d-flex align-items-center">
            <p className="fz-16 fw-400 inter text-white">
              Copyright &copy; 2023{' '}
              <a href="javascript:void(0)" className="hover">
                AIHire.
              </a>{' '}
              Designed By{' '}
              <a href="https://themeforest.net/user/pixelaxis" className="base3">
                Pixelaxis
              </a>
            </p>
            <ul className="help__support d-flex align-items-center">
              <li>
                <a href="javascript:void(0)" className="text-white fz-16 fw-400 inter">
                  Help & Support
                </a>
              </li>
              <li>
                <a href="javascript:void(0)" className="text-white fz-16 fw-400 inter">
                  Privacy policy
                </a>
              </li>
              <li>
                <a href="javascript:void(0)" className="text-white fz-16 fw-400 inter">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
      {/* Footer Section */}
    </>
  );
};

export default LandingPage;