export default function FAQItem(props: {question: string, answer: any, active: boolean, onClick: () => void}) {
  return (
    <div 
      onClick={props.onClick} 
      className={`group relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden ${
        props.active ? 'ring-2 ring-[#5843BE]/20 shadow-lg' : 'hover:border-[#5843BE]/30'
      }`}
    >
      {/* Gradient overlay for active state */}
      {props.active && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#5843BE]/5 to-[#FF6633]/5 pointer-events-none" />
      )}
      
      <div className="relative flex items-start gap-x-4 justify-between p-6 md:p-8">
        <div className="flex flex-col gap-y-4 flex-1">
          <h3 className={`font-semibold text-lg md:text-xl leading-[1.3] transition-colors duration-200 ${
            props.active ? 'text-[#5843BE]' : 'text-gray-800 group-hover:text-[#5843BE]'
          }`}>
            {props.question}
          </h3>
          
          {props.active && (
            <div className="animate-fadeIn">
              <div className="w-12 h-0.5 bg-gradient-to-r from-[#5843BE] to-[#FF6633] mb-4 rounded-full" />
              <div className={`text-gray-700 text-base md:text-lg leading-relaxed ${
                typeof props.answer === 'string' ? '' : 'prose prose-blue max-w-none'
              }`}>
                {props.answer}
              </div>
            </div>
          )}
        </div>
        
        <button className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
          props.active 
            ? 'bg-[#5843BE] shadow-lg' 
            : 'bg-gray-100 group-hover:bg-[#5843BE]/10 group-hover:scale-105'
        }`}>
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            className={`transition-all duration-200 ${
              props.active ? 'rotate-45 text-white' : 'text-gray-600 group-hover:text-[#5843BE]'
            }`}
          >
            <path 
              d="M12 5v14M5 12h14" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}