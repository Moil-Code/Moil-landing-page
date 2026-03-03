import { useState, useEffect } from "react";
import Link from "next/link";

export default function LowerNaviation({refQuery, lgQuery }: {refQuery: any, lgQuery: string}) {
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

  const [isWideAndLong, setIsWideAndLong] = useState(false);
  useEffect(() => {
    setIsWideAndLong(window.innerWidth > 1024 && window.innerHeight > 650);
  }, []);

  return (
    <>
      {isWideAndLong && <div className="bg-[#F7F8FC] flex justify-center">
      <div className="max-w-[1200px] w-full py-4 px-8 flex gap-x-12 items-center">
        <Link className="text-base font-medium leading-6 text-center text-[#1A1433]" href={{ pathname: `/`, search: `${queryString}`}}>I am looking for jobs</Link>
        <Link className="text-base font-medium leading-6 text-center text-[#5843BD]" href={{ pathname: `/business`, search: `${queryString}`}}>I want to hire workers</Link>
      </div>
    </div>}
    </>
  )
}