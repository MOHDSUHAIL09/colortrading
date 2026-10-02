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


import '../../assets/css/landingcss.css'
const LandingPage = () => {
  return (
    <>





      {/* Hero Section Here  */}
      <div className="header__section__two banner__section bg__img1 ralt overhid " style={{ background: "#000000" }}>
        {/* Header Here */}
        <div className="header__section__attachment header__section__two">
          <div className="aihire__headertop">
            <div className="container">
              <div className="haderbar__top header__toptwo d-flex align-items-center justify-content-between">
                <div className="logo__left d-flex align-items-center">
                  <a href="index.html" className="top__logo">
                    <img src={logoLisht} alt="logo" />
                  </a>
                  <a href="how-work.html" className="text-white mdnone inter fw-400">
                    How It Works
                  </a>
                  <a href="about.html" className="text-white mdnone inter fw-400">
                    Why AIHire
                  </a>
                </div>
                <div className="header__topsearch d-flex align-items-center">
                  <button type="button" id="searchBtn" className="d-lg-none">
                    <i className="bi bi-search"></i>
                  </button>
                  <form action="#0" className="search__form search__formtwo d-flex align-items-center">
                    <i className="bi bi-search"></i>
                    <input type="text" placeholder="Search" />
                  </form>

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

          <div className="ralt">
            <header className="header-section menubordert header__section__two menuborderb">
              <div className="container">
                <div className="header-wrapper">
                  <div className="logo-menu d-xl-none">
                    <a href="index.html" className="small__logo">
                      <img src={favicon} alt="logo" />
                    </a>
                  </div>
                  <ul className="main-menu">
                    <li>
                      <a href="javascript:void(0)" className="fz-24">
                        Home <i className="bi bi-chevron-down"></i>
                      </a>
                      <ul className="sub-menu">
                        <li><a href="index.html">Home [1]</a></li>
                        <li><a href="index-2.html">Home [2]</a></li>
                        <li><a href="index-3.html">Home [3]</a></li>
                      </ul>
                    </li>
                    <li>
                      <a href="javascript:void(0)">
                        Browse Job <i className="bi bi-chevron-down"></i>
                      </a>
                      <ul className="sub-menu">
                        <li><a href="service-grid.html">Service Grid</a></li>
                        <li><a href="service-details.html">Service Details</a></li>
                        <li><a href="project.html">Project</a></li>
                        <li><a href="project-details.html">Project Details</a></li>
                        <li><a href="fearuedjob.html">Featured Job</a></li>
                        <li><a href="featurejob-details.html">Featured Details</a></li>
                      </ul>
                    </li>
                    <li>
                      <a href="javascript:void(0)">
                        Find Talent <i className="bi bi-chevron-down"></i>
                      </a>
                      <ul className="sub-menu">
                        <li className="subtwohober"><a href="freelancer.html">Freelancer</a></li>
                        <li><a href="freelancer-details.html">Freelancer Details</a></li>
                      </ul>
                    </li>
                    <li>
                      <a href="javascript:void(0)">
                        Pages <i className="bi bi-chevron-down"></i>
                      </a>
                      <ul className="sub-menu">
                        <li className="subtwohober"><a href="about.html">About</a></li>
                        <li><a href="employer.html">Employer</a></li>
                        <li><a href="employer-details.html">Employer Details</a></li>
                        <li><a href="faqs.html">FAQs</a></li>
                        <li><a href="help-support.html">Help & Support</a></li>
                        <li><a href="singin.html">Sign In</a></li>
                        <li><a href="signup.html">Sign Up</a></li>
                        <li><a href="blog.html">Blog</a></li>
                        <li><a href="blog-details.html">Blog Details</a></li>
                        <li><a href="contact.html">Contact</a></li>
                        <li><a href="error.html">Error</a></li>
                      </ul>
                    </li>
                    <li>
                      <a href="javascript:void(0)">
                        Blog <i className="bi bi-chevron-down"></i>
                      </a>
                      <ul className="sub-menu">
                        <li className="subtwohober"><a href="blog.html">Blog</a></li>
                        <li><a href="blog-details.html">Blog Details</a></li>
                      </ul>
                    </li>
                    <li>
                      <a href="contact.html">Contact</a>
                    </li>
                  </ul>

                  <div className="menu__right__components d-flex align-items-center">
                    <div className="menu__components d-flex align-items-center">
                      <div className="dropdown">
                        <a href="#" className="link glose__icon d-flex align-items-center" data-bs-toggle="dropdown" data-bs-offset="0,14" aria-expanded="true">
                          <i className="bi bi-globe"></i>
                        </a>
                        <div className="dropdown-menu dropdown-start" data-popper-placement="bottom-start">
                          <ul className="list">
                            <li>
                              <a href="#" className="link d-inline-block dropdown-item">
                                <span className="d-block bborder pb-1"> English </span>
                                <span className="d-block bborder pb-1"> United States </span>
                                <span className="d-block bborder pb-1"> Spanish </span>
                                <span className="d-block "> Spain </span>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="dropdown notification__dropdown">
                        <a href="#" className="link glose__icon globe__active" data-bs-toggle="dropdown" data-bs-offset="0,16" aria-expanded="true">
                          <i className="bi bi-chat-text"></i>
                        </a>
                        <div className="dropdown-menu dropdown-menu-end " data-popper-placement="bottom-end">
                          <ul className="list">
                            <li className="mb-16">
                              <a href="#" className="link d-flex dropdown-item">
                                <img src={f10} className="notification__thumb" alt="img" />
                                <span className="notify__content">
                                  <span className="fz-16 d-block fw-600 title inter">Alex Sandro</span>
                                  <span className="fz-14 message d-block fw-500 pra inter">Meetup Started</span>
                                  <span className="fz-10 fw-400 pra inter">6:25 am</span>
                                </span>
                              </a>
                            </li>
                            <li className="mb-16">
                              <a href="#" className="link d-flex dropdown-item">
                                <img src={f9} className="notification__thumb" alt="img" />
                                <span className="notify__content">
                                  <span className="fz-16 d-block fw-600 title inter">Haaland Jr</span>
                                  <span className="fz-14 message d-block fw-500 pra inter">Meetup Started</span>
                                  <span className="fz-10 fw-400 pra inter">11:25 am</span>
                                </span>
                              </a>
                            </li>
                            <li className="mb-16">
                              <a href="#" className="link d-flex dropdown-item">
                                <img src={f8} className="notification__thumb" alt="img" />
                                <span className="notify__content">
                                  <span className="fz-16 d-block fw-600 title inter">Courtney Jr</span>
                                  <span className="fz-14 message d-block fw-500 pra inter">Meetup Started</span>
                                  <span className="fz-10 fw-400 pra inter">4:45 pm</span>
                                </span>
                              </a>
                            </li>
                            <li>
                              <a href="#" className="link d-flex dropdown-item">
                                <img src={f7} className="notification__thumb" alt="img" />
                                <span className="notify__content">
                                  <span className="fz-16 d-block fw-600 title inter">Paquate Shaw</span>
                                  <span className="fz-14 message d-block fw-500 pra inter">Meetup Started</span>
                                  <span className="fz-10 fw-400 pra inter">8:35 pm</span>
                                </span>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="dropdown notification__dropdown">
                        <a href="#" className="link glose__icon globe__active" data-bs-toggle="dropdown" data-bs-offset="0,14" aria-expanded="true">
                          <i className="bi bi-bell"></i>
                        </a>
                        <div className="dropdown-menu dropdown-menu-end " data-popper-placement="bottom-end">
                          <ul className="list">
                            <li className="mb-16">
                              <a href="#" className="link d-flex dropdown-item">
                                <img src={f1} className="notification__thumb" alt="img" />
                                <span className="notify__content">
                                  <span className="fz-16 d-block fw-600 title inter">Jenny95</span>
                                  <span className="fz-14 message d-block fw-500 pra inter">Message alert!</span>
                                  <span className="fz-10 fw-400 pra inter">10 Min ago</span>
                                </span>
                              </a>
                            </li>
                            <li className="mb-16">
                              <a href="#" className="link d-flex dropdown-item">
                                <img src={f2} className="notification__thumb" alt="img" />
                                <span className="notify__content">
                                  <span className="fz-16 d-block fw-600 title inter">Arle MCcoy</span>
                                  <span className="fz-14 message d-block fw-500 pra inter">Message alert!</span>
                                  <span className="fz-10 fw-400 pra inter">1 days ago</span>
                                </span>
                              </a>
                            </li>
                            <li>
                              <a href="#" className="link d-flex dropdown-item">
                                <img src={f3} className="notification__thumb" alt="img" />
                                <span className="notify__content">
                                  <span className="fz-16 d-block fw-600 title inter">Courtney Jr</span>
                                  <span className="fz-14 message d-block fw-500 pra inter">Message alert!</span>
                                  <span className="fz-10 fw-400 pra inter">2 Month ago</span>
                                </span>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="dropdown profie__dropdown">
                        <a href="#" className="link user__active" data-bs-toggle="dropdown" data-bs-offset="0,16" aria-expanded="true">
                          <img src={profileImg} alt="image" className="img-fluid rounded-circle objec-fit-cover" />
                        </a>
                        <div className="dropdown-menu dropdown-menu-end" data-popper-placement="bottom-end">
                          <div className="p-6">
                            <div className="d-flex align-items-center gap-3 max-width">
                              <div className="jerny__uer ralt">
                                <img src={profileImg} alt="image" className="img-fluid jenny rounded-circle object-fit-cover flex-shrink-0" />
                                <i className="bi bi-check checks d-flex align-items-center justify-content-center"></i>
                              </div>
                              <div className="flex-grow-1">
                                <h5 className="fz-20 fw-600 title inter mb-0">Jenny95</h5>
                                <span className="d-block fw-400 inter pra fz-16">
                                  <a href="mailto:email@example.com" className="__cf_email__">email@example.com</a>
                                </span>
                              </div>
                            </div>
                            <div className="switch text-center mt-4 bborderdash pb-24 mb-24">
                              <a href="singin.html" className="cmn--btn outline__btn">
                                <span>Switch to Buying</span>
                              </a>
                            </div>
                            <span className="fz-12 pra d-block fw-400 inter mb-16">Account</span>
                            <ul className="list">
                              <li className="mb-16">
                                <a href="profile.html" className="link d-flex align-items-center gap-2 dropdown-item">
                                  <i className="bi bi-person-check fz-20"></i>
                                  <span className="d-block fz-16 pra fw-500 inter"> Profile </span>
                                </a>
                              </li>
                              <li className="mb-16">
                                <a href="post-request.html" className="link d-flex align-items-center gap-2 dropdown-item">
                                  <i className="bi bi-file-earmark-plus fz-20"></i>
                                  <span className="d-block fz-16 pra fw-500 inter"> Post a Request </span>
                                </a>
                              </li>
                              <li className="mb-16">
                                <a href="notification.html" className="link d-flex align-items-center gap-2 dropdown-item">
                                  <i className="bi bi-bell fz-20"></i>
                                  <span className="d-block fz-16 pra fw-500 inter"> Notification </span>
                                </a>
                              </li>
                              <li className="mb-16">
                                <a href="chat-us.html" className="link d-flex align-items-center gap-2 dropdown-item">
                                  <i className="bi bi-chat-text fz-20"></i>
                                  <span className="d-block fz-16 pra fw-500 inter"> Chat </span>
                                </a>
                              </li>
                              <li className="mb-24">
                                <a href="refer-friend.html" className="link d-flex align-items-center gap-2 dropdown-item">
                                  <i className="bi bi-sliders2 fz-20"></i>
                                  <span className="d-block fz-16 pra fw-500 inter"> Refer a Friend </span>
                                </a>
                              </li>
                            </ul>
                            <span className="fz-12 pra d-block fw-400 inter mb-16">Billing</span>
                            <ul className="list">
                              <li className="mb-16">
                                <a href="setting.html" className="link d-flex align-items-center gap-2 dropdown-item">
                                  <i className="bi bi-gear fz-20"></i>
                                  <span className="d-block fz-16 pra fw-500 inter"> Settings </span>
                                </a>
                              </li>
                              <li>
                                <a href="payment.html" className="link d-flex align-items-center gap-2 dropdown-item">
                                  <i className="bi bi-credit-card-2-back fz-20"></i>
                                  <span className="d-block fz-16 pra fw-500 inter"> Payments </span>
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="header-bar d-lg-none">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            </header>
          </div>
        </div>
        {/* Header End */}

        <div className="container ">
          <div className="banner__content__wrapper ">
            <div className="row justify-content-between align-items-center">
              <div className="col-xl-6 col-lg-7">
                <div className="banner__content banner__twospace banner__contenttwospace ralt">
                  <h4 className="base2 mb-16 wow fadeInDown">
                   Invest Smart, Trade Smarter
                  </h4>
                
                  <span className="d2 text-white mb-24 fw-600 wow fadeInUp">
                  The Power of Intelligent<a href="#0" className="hover">AI</a> Trading
                  </span>
                  <p className="fz-20 fw-400 text-white inter mb-40 wow fadeInDown">
                    Whether you're just starting or you're a seasoned trader, our platform offers comprehensive secure.
                  </p>
                  <div className="banner__btn2 d-flex align-items-center">
                    <a href="freelancer.html" className="cmn--btn2">
                      <span>Hire a Frelancer</span>
                    </a>
                    <a href="freelancer.html" className="cmn--btn outline__btn2">
                      <span>Apply as a Freelancer</span>
                    </a>
                  </div>
                </div>
              </div>
    <div className="col-xl-5 col-lg-5">
  <div className="banner__thumb2 banner__thumbcustom">
    <video
      src={robotVideo}
      className="  rounded banner__thumb2 banner__thumbcustom"    style={{ background: 'transparent', display: 'block'}}
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
      <section className="timely__wortwo bg__all pb-120 pt-120">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="section__title text-center mb-60">
                <h4 className="sub ralt base mb-16 wow fadeInUp" data-wow-duration="0.5s">
                  How It's Work
                </h4>
                <h2 className="title mb-24 wow fadeInUp" data-wow-duration="0.7s">
                  Get Expert in Less Time and Our Work Process
                </h2>
                <p className="ptext2 fz-16 fw-400 inter wow fadeInUp" data-wow-duration="0.9s">
                  Our working process is designed to simplify complex tasks, optimize operations, and maximize productivity. From initial planning and ideation to execution
                </p>
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
                      Post a Job
                    </a>
                  </h4>
                  <p className="fz-14 fw-400 title inter">
                    Create your free job posting and start receiving Quotes within hours
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
                      Hire Freelancers
                    </a>
                  </h4>
                  <p className="fz-14 fw-400 title inter">
                    Create your free job posting and start receiving Quotes within hours
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
                      Get Work Done
                    </a>
                  </h4>
                  <p className="fz-14 fw-400 title inter">
                    Create your free job posting and start receiving Quotes within hours
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
      <section className="choose__section bgchoose__all ralt pb-120 pt-120 header__section__two">
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
                    Our platform connects you with talented AI freelancers from around the world who can help you with your projects and tasks, no matter how big or small.
                  </p>
                </div>
                <ul className="choose__checklist mb-16 d-flex flex-wrap">
                  <li className="d-flex align-items-center gap-2 mb-16 wow fadeInUp" data-wow-duration="1.7s">
                    <i className="bi bi-check2-circle base2 fz-24"></i>
                    <span className="fz-20 fw-500 inter">
                      Get High Quality Work
                    </span>
                  </li>
                  <li className="d-flex align-items-center gap-2 mb-16 wow fadeInUp" data-wow-duration="1.7s">
                    <i className="bi bi-check2-circle base2 fz-24"></i>
                    <span className="fz-20 fw-500 inter">
                      Stick to your budget service
                    </span>
                  </li>
                  <li className="d-flex align-items-center gap-2 mb-16 wow fadeInUp" data-wow-duration="1.7s">
                    <i className="bi bi-check2-circle base2 fz-24"></i>
                    <span className="fz-20 fw-500 inter">
                      Pay when you're happy
                    </span>
                  </li>
                  <li className="d-flex align-items-center gap-2 mb-16 wow fadeInUp" data-wow-duration="1.7s">
                    <i className="bi bi-check2-circle base2 fz-24"></i>
                    <span className="fz-20 fw-500 inter">
                      Pay when you're happy
                    </span>
                  </li>
                </ul>
                <a href="fearuedjob.html" className="cmn--btn2">
                  <span>
                    Read More
                  </span>
                  <span className="ps-1">
                    <i className="bi bi-arrow-up-right"></i>
                  </span>
                </a>
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
                  Categorires
                </h4>
                <h2 className="title mb-24 wow fadeInUp" data-wow-duration="0.7s">
                  Trending Top Categories Uncovered
                </h2>
                <p className="ptext2 fz-16 fw-400 inter wow fadeInUp" data-wow-duration="0.9s">
                  Our AI freelancer marketplace is more than just a platform. It's a community of professionals who are passionate about AI
                </p>
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
                        NLP Specialists
                      </a>
                    </h4>
                    <p className="fz-16 fw-400 title inter">
                      Our AI freelancer marketplace is more than just a platform
                    </p>
                  </div>
                </div>
                <a href="fearuedjob.html" className="d-flex readmore align-items-center gap-2">
                  <span className="fz-16 transition fw-600 base inter">
                    Read More
                  </span>
                  <span>
                    <i className="bi bi-arrow-right transition fz-18 base"></i>
                  </span>
                </a>
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
                        Data Scientists
                      </a>
                    </h4>
                    <p className="fz-16 fw-400 title inter">
                      Our AI freelancer marketplace is more than just a platform
                    </p>
                  </div>
                </div>
                <a href="fearuedjob.html" className="d-flex readmore align-items-center gap-2">
                  <span className="fz-16 transition fw-600 base inter">
                    Read More
                  </span>
                  <span>
                    <i className="bi bi-arrow-right transition fz-18 base"></i>
                  </span>
                </a>
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
                        Machine Learning
                      </a>
                    </h4>
                    <p className="fz-16 fw-400 title inter">
                      Our AI freelancer marketplace is more than just a platform
                    </p>
                  </div>
                </div>
                <a href="fearuedjob.html" className="d-flex readmore align-items-center gap-2">
                  <span className="fz-16 transition fw-600 base inter">
                    Read More
                  </span>
                  <span>
                    <i className="bi bi-arrow-right transition fz-18 base"></i>
                  </span>
                </a>
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
                        Deep Learning
                      </a>
                    </h4>
                    <p className="fz-16 fw-400 title inter">
                      Our AI freelancer marketplace is more than just a platform
                    </p>
                  </div>
                </div>
                <a href="fearuedjob.html" className="d-flex readmore align-items-center gap-2">
                  <span className="fz-16 transition fw-600 base inter">
                    Read More
                  </span>
                  <span>
                    <i className="bi bi-arrow-right transition fz-18 base"></i>
                  </span>
                </a>
              </div>
            </div>
            <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 wow fadeInDown">
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
                <a href="fearuedjob.html" className="d-flex readmore align-items-center gap-2">
                  <span className="fz-16 transition fw-600 base inter">
                    Read More
                  </span>
                  <span>
                    <i className="bi bi-arrow-right transition fz-18 base"></i>
                  </span>
                </a>
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
                <a href="fearuedjob.html" className="d-flex readmore align-items-center gap-2">
                  <span className="fz-16 transition fw-600 base inter">
                    Read More
                  </span>
                  <span>
                    <i className="bi bi-arrow-right transition fz-18 base"></i>
                  </span>
                </a>
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
                <a href="fearuedjob.html" className="d-flex readmore align-items-center gap-2">
                  <span className="fz-16 transition fw-600 base inter">
                    Read More
                  </span>
                  <span>
                    <i className="bi bi-arrow-right transition fz-18 base"></i>
                  </span>
                </a>
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
                <a href="fearuedjob.html" className="d-flex readmore align-items-center gap-2">
                  <span className="fz-16 transition fw-600 base inter">
                    Read More
                  </span>
                  <span>
                    <i className="bi bi-arrow-right transition fz-18 base"></i>
                  </span>
                </a>
              </div>
            </div>
          </div>
          <div className="text-center">
            <a href="fearuedjob.html" className="cmn--btn outline__btn">
              <span>
                See All Categories
              </span>
              <span className="ps-1">
                <i className="bi bi-arrow-up-right"></i>
              </span>
            </a>
          </div>
        </div>
      </section>
      {/* categrory worktwo End */}

      {/* about section Here */}
      <section className="about__section bg__about overhid pt-120 pb-120 header__section__two">
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
                    At our AI Freelancer Marketplace, we understand that success stems from building amazing teams. We provide the platform and resources to connect you
                  </p>
                </div>
                <div className="row g-4 mb-40">
                  <div className="col-xxl-6 col-xl-9 col-lg-8 col-md-6 wow fadeInDown">
                    <div className="perfoming__item d-flex">
                      <div className="cmn__ibox transition d-flex align-items-center justify-content-center boxes1 round50">
                        <img src={searchBase2} alt="machine" />
                      </div>
                      <div className="content">
                        <h5 className="text-white mb-10">
                          Access Opportunities
                        </h5>
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
                        <h5 className="text-white mb-10">
                          Increased Visibility
                        </h5>
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
                        <h5 className="text-white mb-10">
                          Access to AI Talent
                        </h5>
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
                        <h5 className="text-white mb-10">
                          Quality Assurance
                        </h5>
                        <p className="fz-14 fw-400 inter whitep">
                          We ensure a rigorous vetting process for talent on our
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <a href="employer-details.html" className="cmn--btn2">
                  <span>
                    Explore More
                  </span>
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
                  <span className="d2 text-white">
                    30+
                  </span>
                  <span className="fz-18 fw-500 inter text-white">
                    Years of experience
                  </span>
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
                  <h4 className="sub ralt base mb-16 wow fadeInDown">
                    Download Our Apps
                  </h4>
                  <h2 className="title mb-24 wow fadeInUp">
                    Get Our Mobile App for Free and Unlock a World
                  </h2>
                  <p className="ptext2 fz-16 fw-400 inter wow fadeInDown">
                    Download our free mobile app today from the App Store or Google Play Store and discover a whole new level of convenience and accessibility.
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
      <section className="faq__section bg__faq pb-120 pt-120 header__section__two">
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
                    Welcome to our Frequently Asked Questions (FAQs) section, designed to provide you with answers to common inquiries and help you navigate our platform
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
                          How do I apply for a credit card on the marketplace?
                        </button>
                        <div
                          id="collapseTwo"
                          className="accordion-collapse collapse"
                          aria-labelledby="headingTwo"
                          data-bs-parent="#accordionExample"
                        >
                          <div className="accordion-body">
                            <p>
                              It refers to a list of common questions and answers related to a particular topic or product. In the case of a credit card marketplace website
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
                          How does the credit card marketplace work?
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
                            It refers to a list of common questions and answers related to a particular topic or product. In the case of a credit card marketplace website
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
                          How can I improve my credit score?
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
                            It refers to a list of common questions and answers related to a particular topic or product. In the case of a credit card marketplace website
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
                          What skills do I need to work in AI and ML?
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
                            It refers to a list of common questions and answers related to a particular topic or product. In the case of a credit card marketplace website
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
                <div className="happy__customerbox round16">
                  <div className="d-flex mb-10 align-items-center">
                    <a href="#0" className="customer">
                      <img src={ha1} alt="happy" />
                    </a>
                    <a href="#0" className="customer">
                      <img src={ha2} alt="happy" />
                    </a>
                    <a href="#0" className="customer">
                      <img src={ha3} alt="happy" />
                    </a>
                    <a href="#0" className="customer">
                      <img src={ha4} alt="happy" />
                    </a>
                    <a href="#0" className="customer">
                      <img src={ha5} alt="happy" />
                    </a>
                  </div>
                  <span className="fz-18 fw-500 inter text-white">
                    <span className="base2">500k+</span> Happy Customer
                  </span>
                </div>
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
                  Begin Your Journey
                </h4>
                <h2 className="title wow fadeInUp mb-24" data-wow-duration="1.2s">
                  Get Started with AI-Hire
                </h2>
                <p className="pra fz-16 inter fw-400">
                  Are you ready to embark on an exciting journey into the world of AI freelancing? Getting started with AIHire is simple and straightforward
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
                  <h3 className="inter title mb-24">
                    I need a task done
                  </h3>
                  <p className="fz-16 fw-400 inter pra mb-40">
                    Have a specific AI task that needs to be completed? Look no further!
                  </p>
                  <a href="freelancer-details.html" className="cmn--btn outline__btn">
                    <span>
                      View services
                    </span>

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
                  <h3 className="inter title mb-24">
                    I am a freelancer
                  </h3>
                  <p className="fz-16 fw-400 inter pra mb-40">
                    Are you an AI professional looking for exciting freelance opportunities?
                  </p>
                  <a href="freelancer.html" className="cmn--btn outline__btn">
                    <span>
                      List a Service
                    </span>

                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* task categorish Section End */}



      {/* Footer Section */}
      <footer className="footer__section bgadd " style={{ background: "#13203B" }}>
        <div className="container">
          <div className="footer__top pt-120 pb-120">
            <div className="row g-4">
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 wow fadeInDown">
                <div className="footer__item">
                  <a href="index.html" className="footer__logo mb-24 d-block">
                    <img src={logoLisht} alt="logo" />
                  </a>
                  <p className="pfz-16 inter fw-400 cef__pra mb-30">
                    Join our community of businesses, entrepreneurs, and freelancers who are passionate about AI and its potential
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
                  <a href="javascript:void(0)" className="footer__title fz-24 fw-600 inter text-white mb-24 d-block">
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
                  <a href="javascript:void(0)" className="footer__title fz-24 fw-600 inter text-white mb-24 d-block">
                    Contact
                  </a>
                  <ul className="footer__contact">
                    <li>
                      <a href="javascript:void(0)" className="fz-16 d-flex align-items-center gap-3 fw-400 inter cef__pra d-block">
                        <i className="bi bi-telephone-plus cmn__icon cmn__icon"></i>
                        <span>
                          (316) 555-0116
                        </span>
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0)" className="fz-16 d-flex align-items-center gap-3 fw-400 inter cef__pra d-block">
                        <i className="bi bi-envelope-open cmn__icon"></i>
                        <span>
                          <span className="__cf_email__" data-cfemail="94fdfaf2fbd4f1ecf5f9e4f8f1baf7fbf9">[email&#160;protected]</span>
                        </span>
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0)" className="fz-16 d-flex align-items-center gap-3 fw-400 inter cef__pra d-block">
                        <i className="bi bi-geo-alt cmn__icon"></i>
                        <span>
                          31 Brandy Way, Sutton, SM2 6SE
                        </span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 wow fadeInUp">
                <div className="footer__item">
                  <a href="javascript:void(0)" className="footer__title fz-24 fw-600 inter text-white mb-24 d-block">
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
              Copyright &copy; 2023 <a href="javascript:void(0)" className="hover">AIHire.</a> Designed By <a href="https://themeforest.net/user/pixelaxis" className="base3">Pixelaxis</a>
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