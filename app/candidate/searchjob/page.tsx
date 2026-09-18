import { Suspense } from 'react';
import Link from 'next/link';
import SearchJobField from '../../../src/candidate/sections/search_field';

function SearchJobFieldContent() {
  return <SearchJobField accType="client" />;
}

export default function SearchJobFieldPage() {
  return (
    <>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      }>
        <SearchJobFieldContent />
      </Suspense>

      <section aria-labelledby="job-search-guide" className="bg-white px-4 py-16 text-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5843BE]">Job search guide</p>
          <h2 id="job-search-guide" className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
            Find current opportunities and make each search count.
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            This directory shows jobs that employers have made available through Moil. Openings change as employers
            publish, pause, or fill roles, so an empty search does not mean your kind of work is unavailable. Start with
            a role or skill, add a city or ZIP code when location matters, and broaden either field when the first search
            is too narrow.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-lg font-semibold">Search by the work you do</h3>
              <p className="mt-3 leading-7 text-slate-600">
                Use a familiar job title such as carpenter, driver, maintenance technician, server, painter, or plumber.
                You can also search by a core skill when employers use different titles for similar work.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-lg font-semibold">Try nearby locations</h3>
              <p className="mt-3 leading-7 text-slate-600">
                Search your city first, then try a nearby city or a wider region. Local service and trade roles may be
                advertised from the employer&apos;s office even when the work happens across several communities.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-lg font-semibold">Prepare before you apply</h3>
              <p className="mt-3 leading-7 text-slate-600">
                Keep your recent experience, certifications, preferred schedule, and contact details ready. A concise,
                accurate profile helps an employer understand your fit without guessing what you can do.
              </p>
            </article>
          </div>

          <div className="mt-10 rounded-2xl bg-[#F5F2FF] p-6 sm:p-8">
            <h3 className="text-xl font-semibold">No matching jobs right now?</h3>
            <p className="mt-3 max-w-4xl leading-7 text-slate-700">
              Remove one filter, try a related title, and check back as new roles are added. You can also use Moil&apos;s
              candidate tools to improve your resume and practice interview answers while you wait for the right opening.
              Never pay someone who promises a guaranteed job, and verify the employer and role before sharing sensitive
              personal information.
            </p>
            <div className="mt-5 flex flex-wrap gap-4">
              <Link href="/candidate" className="font-semibold text-[#5843BE] underline underline-offset-4">
                Explore candidate tools
              </Link>
              <Link href="/help" className="font-semibold text-[#5843BE] underline underline-offset-4">
                Visit the help center
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
