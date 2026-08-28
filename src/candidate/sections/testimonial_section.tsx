"use client";

import { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import TestimonialItem from "../components/testimonial_item";

export default function BusinessTestimonialSection() {
  // react-multi-carousel measures item widths on mount and rewrites their
  // inline flex styles, which never matches the SSR markup and throws a
  // hydration warning. Render a static list on the server / first paint and
  // only mount the interactive carousel on the client. The testimonial text
  // still ships in the SSR HTML for SEO.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const responsive = {
    desktop: {
      breakpoint: { max: 5000, min: 1024 },
      items: 2,
      slidesToSlide: 1 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1023, min: 464 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    }
  };

  const testimonials = [
    {
      testimonialImage: "https://res.cloudinary.com/drlcisipo/image/upload/v1721126417/Website%20images/image_1_abc62e.png",
      testimonialName: "Sierra Givhaan",
      testimonial: "This is a very straightforward and easy site to navigate when creating a quick and accurate resume using AI. Each step of the process is explained well, and from start to finish I was able to update my resume to a more detailed and professional version within minutes. It saved so much time and money... I highly recommend!"
    },
    {
      testimonialImage: "https://res.cloudinary.com/drlcisipo/image/upload/v1721126418/Website%20images/Frame_427320687_wjdblt.png",
      testimonialName: "Carlos Zuluaga",
      testimonial: "The app is extremely easy to use and the amazing thing is that you will only write your job duties and the app will develop a well written paragraph about it. With only a few words the app will create a professional resume that will get you hired. I highly recommend using this app for your next job search, you won't be disappointed."
    },
    {
      testimonialImage: "https://res.cloudinary.com/drlcisipo/image/upload/v1721126418/Website%20images/Frame_427320687_1_lfowbv.png",
      testimonialName: "Contreras Ed",
      testimonial: "Easy to navigate app, simple format to search for all kinds of jobs currently hiring in your area. Recently quit my job and used Moil to update my resume. Impressed on how easy it was to create a new one. Definitely recommended Moil as I used other apps in the past and none compared to its effectiveness and user-friendly features 10/10."
    },
    {
      testimonialImage: "https://res.cloudinary.com/drlcisipo/image/upload/v1721126417/Website%20images/Frame_427320687_2_fnbgix.png",
      testimonialName: "Christian Jose Torres",
      testimonial: "Excellent tool to create your resume in a few steps, helped me get a job in Bixby, Oklahoma. Thanks. I recommend her 100%. What I liked most was that the app has AI assistance."
    }
  ];

  const ButtonGroup = ({ next, previous, ...rest }: any) => {
    const { carouselState: { currentSlide } } = rest;

    return (
      <div className="flex items-center  gap-x-2">
        <button
          className={`${currentSlide < 1 ? 'disabled' : ''}`}
          onClick={() => previous()}
          disabled={currentSlide <= 1}
        >
          <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.305664" width="40" height="40" rx="20" fill="white" />
            <g clipPath="url(#clip0_9244_7652)">
              <path d="M20.0925 28.1011L12.9334 20.942L20.0925 13.7829L21.7402 15.4165L17.415 19.7417H27.5499V22.1423H17.415L21.7402 26.4605L20.0925 28.1011Z" fill="black" fillOpacity="0.67" />
            </g>
            <defs>
              <clipPath id="clip0_9244_7652">
                <rect width="24" height="24" fill="white" transform="translate(8.5 8.30566)" />
              </clipPath>
            </defs>
          </svg>
        </button>

        <p className="text-sm md:text-base lg:text-lg leading-[1.4] text-white">{`${currentSlide} / ${testimonials.length}`}</p>


        <button
          className={`${currentSlide <= testimonials.length ? 'disabled' : ''}`}
          onClick={() => next()}
          disabled={currentSlide >= testimonials.length}
        >
          <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.305664" width="40" height="40" rx="20" fill="white" />
            <g clipPath="url(#clip0_9244_4770)">
              <path d="M20.9164 28.1011L19.2686 26.4676L23.5939 22.1423H13.459V19.7417H23.5939L19.2686 15.4236L20.9164 13.7829L28.0755 20.942L20.9164 28.1011Z" fill="black" fillOpacity="0.67" />
            </g>
            <defs>
              <clipPath id="clip0_9244_4770">
                <rect width="24" height="24" fill="white" transform="translate(8.5 8.30566)" />
              </clipPath>
            </defs>
          </svg>

        </button>
      </div>
    )
  }


  return (
    <div className="bg-[#5843BD] px-4 sm:px-6 md:px-8 lg:px-0 py-8 md:py-12 lg:py-16 flex justify-center flex-col items-center gap-y-4 md:gap-y-6 lg:gap-y-8">

      <p className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl leading-[1.3] text-center font-medium px-4">What our users are saying</p>

      {mounted ? (
        <Carousel
          swipeable={true}
          renderButtonGroupOutside={true}
          responsive={responsive}
          ssr={true}
          infinite={true}
          autoPlay={window.innerWidth < 500}
          autoPlaySpeed={1000}
          keyBoardControl={true}
          customTransition="transform 0.8s ease"
          transitionDuration={500}
          containerClass="carousel-container"
          removeArrowOnDeviceType={["tablet", "mobile", "desktop"]}
          deviceType={
            window.innerWidth < 500 ? 'mobile' :
              window.innerWidth < 1024 ? 'tablet' :
                'desktop'
          }
          customButtonGroup={<ButtonGroup />}
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialItem
              key={index}
              testimonialImage={testimonial.testimonialImage}
              testimonialName={testimonial.testimonialName}
              testimonial={testimonial.testimonial}
            />
          ))}
        </Carousel>
      ) : (
        <div className="flex flex-wrap justify-center gap-4 w-full max-w-[960px]">
          {testimonials.slice(0, 2).map((testimonial, index) => (
            <TestimonialItem
              key={index}
              testimonialImage={testimonial.testimonialImage}
              testimonialName={testimonial.testimonialName}
              testimonial={testimonial.testimonial}
            />
          ))}
        </div>
      )}


    </div>
  );
}