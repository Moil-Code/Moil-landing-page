import { useState, useEffect } from "react";
import Link from "next/link";
import { FacebookSvg, InstagramSvg, LinkedInSvg, MoilSvg } from "../components/svgs";

export default function FooterSection({ refQuery, lgQuery }: any) {

  const currentYear = new Date().getFullYear();
  let [ queryString, setQueryString ] = useState("");
  // Automatically update queryString when refQuery or lgQuery change
  useEffect(() => {
    if (refQuery && lgQuery) {
      setQueryString(`?ref=${refQuery}&lg=${lgQuery}`);
    } else if (refQuery && !lgQuery) {
      setQueryString(`?ref=${refQuery}`);
    } else if (!refQuery && lgQuery) {
      setQueryString(`?lg=${lgQuery}`);
    } else {
      setQueryString(""); // No query parameters
    }
  }, [refQuery, lgQuery]); // Runs when refQuery or lgQuery changes


  return (
    <footer className="relative w-full bg-gradient-to-br from-[#5843BD] via-[#4a3ba0] to-[#3d2f85] overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Decorative Gradient Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-24">
        {/* Logo and Description */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block mb-4">
            <img src='https://res.cloudinary.com/drlcisipo/image/upload/v1705704261/Website%20images/logo_gox0fw.png' alt="Moil Logo" className="h-10 md:h-12 brightness-0 invert" />
          </Link>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto">
            Empowering businesses and workers with AI-powered tools for hiring, job search, and business growth.
          </p>
        </div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* For Businesses */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">For Businesses</h3>
            <ul className="space-y-3">
              <li>
                <Link href={`/business${queryString}`} className="text-white/70 hover:text-white transition-colors text-sm">
                  Hire Employees
                </Link>
              </li>
              <li>
                <Link href={`/business${queryString}#services`} className="text-white/70 hover:text-white transition-colors text-sm">
                  AI Business Tools
                </Link>
              </li>
              <li>
                <Link href={`/business/pricing${queryString}`} className="text-white/70 hover:text-white transition-colors text-sm">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href={`/business${queryString}`} className="text-white/70 hover:text-white transition-colors text-sm">
                  Post a Job
                </Link>
              </li>
            </ul>
          </div>

          {/* For Job Seekers */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">For Job Seekers</h3>
            <ul className="space-y-3">
              <li>
                <Link href={`/${queryString}`} className="text-white/70 hover:text-white transition-colors text-sm">
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link href={`/${queryString}#how-it-works`} className="text-white/70 hover:text-white transition-colors text-sm">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href={`/${queryString}`} className="text-white/70 hover:text-white transition-colors text-sm">
                  Browse Opportunities
                </Link>
              </li>
              <li>
                <Link href={`/${queryString}`} className="text-white/70 hover:text-white transition-colors text-sm">
                  Career Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* AI Features */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">AI Features</h3>
            <ul className="space-y-3">
              <li>
                <span className="text-white/70 text-sm">AI Business Coach</span>
              </li>
              <li>
                <span className="text-white/70 text-sm">Market Research</span>
              </li>
              <li>
                <span className="text-white/70 text-sm">Content Creation</span>
              </li>
              <li>
                <span className="text-white/70 text-sm">Marketing Calendar</span>
              </li>
              <li>
                <span className="text-white/70 text-sm">Candidate Matching</span>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link target="_blank" href="https://blog.moilapp.com" className="text-white/70 hover:text-white transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href={`/business${queryString}`} className="text-white/70 hover:text-white transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href={`/business${queryString}`} className="text-white/70 hover:text-white transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link href={`/business${queryString}`} className="text-white/70 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center items-center gap-6 mb-8">
          <a href="/" className="text-white/70 hover:text-white transition-colors" aria-label="Moil">
            <MoilSvg />
          </a>
          <a href="https://www.linkedin.com/company/moilapp" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors" aria-label="LinkedIn">
            <LinkedInSvg />
          </a>
          <a href="https://www.facebook.com/themoilapp" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors" aria-label="Facebook">
            <FacebookSvg />
          </a>
          <a href="https://instagram.com/themoilapp" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors" aria-label="Instagram">
            <InstagramSvg />
          </a>
          <a href="https://www.threads.net/@themoilapp" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors" aria-label="Threads">
            <svg width="19" height="22" viewBox="0 0 19 22" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.5164 9.77743C14.3544 6.79043 12.7224 5.08043 9.98237 5.06343C8.33037 5.05343 6.94937 5.75343 6.10337 7.03643L7.61137 8.06943C8.24537 7.10843 9.24637 6.90943 9.97137 6.91643C10.8744 6.92243 11.5544 7.18443 11.9954 7.69643C12.3154 8.06843 12.5304 8.58343 12.6374 9.23243C11.836 9.09643 10.9727 9.05477 10.0474 9.10743C7.44137 9.25743 5.76737 10.7774 5.87937 12.8884C5.93637 13.9594 6.46937 14.8814 7.38137 15.4834C8.15137 15.9924 9.14537 16.2404 10.1764 16.1844C11.5394 16.1094 12.6084 15.5904 13.3544 14.6394C13.9204 13.9174 14.2784 12.9814 14.4364 11.8034C15.0864 12.1954 15.5664 12.7104 15.8334 13.3304C16.2854 14.3844 16.3114 16.1164 14.8984 17.5284C13.6604 18.7644 12.1724 19.3004 9.92338 19.3164C7.42838 19.2984 5.54138 18.4974 4.31538 16.9384C3.16538 15.4784 2.57237 13.3684 2.55037 10.6694C2.57237 7.96943 3.16638 5.86043 4.31538 4.39943C5.54138 2.84043 7.42838 2.04043 9.92338 2.02243C12.4364 2.04143 14.3554 2.84443 15.6294 4.41243C16.2544 5.18043 16.7244 6.14643 17.0354 7.27243L18.8014 6.80243C18.4244 5.41543 17.8324 4.22043 17.0274 3.22943C15.3944 1.21943 12.9944 0.190434 9.91737 0.169434C6.84637 0.190434 4.48537 1.22443 2.89837 3.24043C1.48737 5.03543 0.758375 7.54643 0.734375 10.6764C0.758375 13.8064 1.48737 16.3034 2.89837 18.0984C4.48537 20.1144 6.85837 21.1484 9.92837 21.1694C12.6594 21.1504 14.5834 20.4354 16.1684 18.8524C18.2434 16.7794 18.1804 14.1824 17.4974 12.5884C16.9724 11.3634 15.9274 10.3824 14.5174 9.77843M10.0794 14.3354C8.93737 14.3994 7.75137 13.8874 7.69237 12.7894C7.64937 11.9754 8.27238 11.0674 10.1494 10.9594C10.9977 10.9026 11.8498 10.9611 12.6824 11.1334C12.4664 13.8354 11.1974 14.2734 10.0794 14.3354Z" />
            </svg>
          </a>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 mb-8"></div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-white/60 text-sm">
            © {currentYear} Moil. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
