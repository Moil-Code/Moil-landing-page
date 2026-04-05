"use client";

import { useState } from "react";
import FAQItem from "../components/faq_item";
import Link from "next/link";

export default function FAQSection() {

  const [active, setActive] = useState('');
  const FAQ = [
    {
      question: "What is Moil?",
      answer: "Moil is a platform that connects skilled professionals — including tradespeople, service workers, hospitality staff, logistics workers, and more — with job opportunities. Our AI matches workers with roles that fit their skills, location, and experience, across a wide range of industries and small businesses."
    },
    {
      question: "How does Moil work?",
      answer: "Moil leverages AI to match skilled professionals with job opportunities posted by individuals or businesses in need of services. Users can sign up, create profiles, and start connecting with job opportunities or service providers."
    },
    {
      question: "How do I create a profile on Moil?",
      answer: "To create a profile, go to moilapp.com, sign up with your email or social media accounts, and fill in your details, including your skills, and your experience."
    },
    {
      question: "How can I find job opportunities on Moil?",
      answer: "Once your profile is set up, you can browse through available job listings, apply for jobs that match your skills, and connect with potential employers."
    },
    {
      question: "Is there a fee to use Moil as a job seeker?",
      answer: "Moil offers a free basic service for job seekers. There may be premium features available for an additional fee, providing enhanced visibility and access to exclusive job listings."
    },
    {
      question: "How secure is my data on Moil?",
      answer: (
        <span>
          Moil prioritizes the security of your data with robust encryption and regular security audits. For more information, refer to our <Link href="/privacy" className="text-blue-500 underline">privacy policy</Link>.
        </span>
      )
    },
    {
      question: "How do I report a problem or get support?",
      answer: (
        <span>
          If you encounter any issues or need support, you can contact our support team through the app or by emailing <a href="mailto:cs@moilapp.com" className="text-blue-500 underline">cs@moilapp.com</a>.
        </span>
      )
    },
    {
      question: "How can I provide feedback or suggest improvements?",
      answer: (
        <span>
          We value your feedback! You can provide feedback or suggest improvements by emailing <a href="mailto:cs@moilapp.com" className="text-blue-500 underline">cs@moilapp.com</a>.
        </span>
      )
    }
  ];



  const onClick = (question: string) => {
    if (active !== question) {
      setActive(question);
    } else {
      setActive('');
    }
  }
  return (
    <div className="relative py-20 bg-gradient-to-br from-slate-50 via-[#5843BE]/5 to-[#FF6633]/5 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#5843BE]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#FF6633]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#5843BE]/8 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-[#FF6633]/8 rounded-full blur-3xl"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex justify-center flex-col gap-y-12">
        <div className="text-center space-y-4">
          <h2 className="font-bold text-3xl md:text-5xl lg:text-6xl text-[#5843BE]">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-700 text-lg md:text-xl max-w-2xl mx-auto px-4">
            Find answers to common questions about Moil and how our platform works
          </p>
        </div>
        
        <div className="flex w-full px-6 md:px-8 lg:px-12 xl:px-0 self-center flex-col gap-y-6 container xl:max-w-[950px] xtraxl:xl:max-w-[1152px]">
          {
            FAQ?.map((faq, i) => {
              return <FAQItem onClick={() => onClick(faq.question)} key={i} question={faq.question} answer={faq.answer} active={faq.question === active} />
            })
          }
        </div>
      </div>
    </div>
  );
}