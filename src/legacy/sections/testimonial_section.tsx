"use client";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import TestimonialItem from "../components/testimonial_item";
import { openBusinessRegister } from "../utils/urlBuilder";
import { GridPattern } from "../components/interactive_bg";
import { cn } from "@/src/lib/utils";

interface TestimonialSectionProps {
  refQuery?: string;
  lgQuery?: string;
}

export default function BusinessTestimonialSection({ refQuery, lgQuery }: TestimonialSectionProps) {
  const handleStartCoaching = () => {
    openBusinessRegister({ ref: refQuery, lg: lgQuery });
  };

  const responsive = {
    desktop: {
      breakpoint: { max: 5000, min: 1024 },
      items: 2,
      slidesToSlide: 1
    },
    tablet: {
      breakpoint: { max: 1023, min: 464 },
      items: 1,
      slidesToSlide: 1
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1
    }
  };

  const testimonials = [
    {
      testimonialImage: "https://res.cloudinary.com/drlcisipo/image/upload/v1721818529/Website%20images/Luis_Vives_pleeyc.jpg",
      testimonialName: "Luis Vives",
      testimonial: "I've used it to post a position, and I am impressed with how easy, intuitive, and effective Moil is. Within hours, we were able to connect with multiple great candidates for our position. I definitely recommend it and will keep using it."
    },
    {
      testimonialImage: "https://res.cloudinary.com/drlcisipo/image/upload/v1721818532/Website%20images/Liliana_Cervantes_g2gb0v.jpg",
      testimonialName: "Liliana Cervantes",
      testimonial: "Excellent platform whether to look for a job or to look for workers, I recommend it 100%"
    },
    {
      testimonialImage: "https://res.cloudinary.com/drlcisipo/image/upload/v1721818530/Website%20images/Miguel_Bustos_aktvri.jpg",
      testimonialName: "Miguel Bustos",
      testimonial: "100% RECOMMENDABLE !!. This platform helps me find employees when I need that extra help!"
    }
  ];

  const ButtonGroup = ({ next, previous, goToSlide, ...rest }: any) => {
    const { carouselState: { currentSlide } } = rest;

    return (
      <div className="flex items-center justify-center gap-x-4 mt-8">
        <button
          className={`p-3 rounded-full transition-all duration-300 ${currentSlide < 1 ? 'bg-white/10 text-white/30 cursor-not-allowed' : 'bg-white/20 text-white hover:bg-white/30 hover:scale-110'}`}
          onClick={() => previous()}
          disabled={currentSlide <= 1}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <p className="text-lg font-medium text-white/90 font-mono tracking-wider">{`${currentSlide} / ${testimonials.length}`}</p>

        <button
          className={`p-3 rounded-full transition-all duration-300 ${currentSlide >= testimonials.length ? 'bg-white/10 text-white/30 cursor-not-allowed' : 'bg-white/20 text-white hover:bg-white/30 hover:scale-110'}`}
          onClick={() => next()}
          disabled={currentSlide >= testimonials.length}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    );
  };

  return (
    <div className="relative overflow-hidden bg-[#5843BD] py-20 md:py-28">
      {/* Interactive Grid Background */}
      <GridPattern
        width={60}
        height={60}
        x={-1}
        y={-1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom,white,transparent)] opacity-50 fill-white/10 stroke-white/10"
        )}
      />
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#FF6633]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-24 w-64 h-64 bg-[#7A64DE]/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#FF6633]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-block px-4 py-1.5 bg-white/10 rounded-full text-white/90 text-sm font-medium mb-6 border border-white/20 backdrop-blur-sm">
             ⭐ Trusted by 500+ Businesses
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
            Ready to Meet Your AI <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6633] to-[#FF9E7D]">Co-Founder</span>?
          </h2>
          
          <p className="text-white/80 text-base md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
            Skip expensive consultants and disconnected tools. Get your intelligent business partner that
            connects market research, planning, and hiring in one conversation.
          </p>
        </div>

        {/* Carousel Section */}
        <div className="relative max-w-6xl mx-auto mb-16">
          <div className="text-center mb-10">
            <h3 className="text-white text-xl md:text-2xl font-semibold">What our users are saying</h3>
            <div className="w-16 h-1 bg-[#FF6633] mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="px-4">
            <Carousel
              swipeable={true}
              draggable={true}
              renderButtonGroupOutside={true}
              responsive={responsive}
              ssr={true}
              infinite={true}
              autoPlay={typeof window !== 'undefined' && window.innerWidth < 500}
              autoPlaySpeed={5000}
              keyBoardControl={true}
              customTransition="transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
              transitionDuration={600}
              containerClass="carousel-container pb-8"
              itemClass="px-3 md:px-4"
              removeArrowOnDeviceType={["tablet", "mobile", "desktop"]}
              deviceType={
                typeof window !== 'undefined' && window.innerWidth < 500 ? 'mobile' :
                  typeof window !== 'undefined' && window.innerWidth < 1024 ? 'tablet' :
                    'desktop'
              }
              customButtonGroup={<ButtonGroup />}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="h-full">
                  <TestimonialItem
                    testimonialImage={testimonial.testimonialImage}
                    testimonialName={testimonial.testimonialName}
                    testimonial={testimonial.testimonial}
                  />
                </div>
              ))}
            </Carousel>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <button
            onClick={handleStartCoaching}
            className="group relative bg-white text-[#5843BD] font-bold py-4 px-8 md:py-5 md:px-10 rounded-2xl transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-white/20 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            <span className="relative flex items-center gap-2 text-lg">
              Start Talking to Your AI Coach
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}