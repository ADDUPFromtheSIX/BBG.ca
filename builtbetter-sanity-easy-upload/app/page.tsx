import { client, urlFor } from "@/lib/sanity";
import { homepageQuery, testimonialsQuery } from "@/lib/queries";

type HomepageData = {
  heroTitle?: string;
  heroSubtitle?: string;
  heroBackgroundImage?: any;
  specialties?: Array<{ title: string; summary: string; items: string[] }>;
  processSteps?: Array<{ title: string; items: string[] }>;
};

type Testimonial = { _id: string; quote: string; name: string; detail?: string };

const fallbackHomepage: HomepageData = {
  heroTitle: "Condo Renovations. Design & Build.\nOutdoor Living.",
  heroSubtitle:
    "Built Better Group specializes in high-end condo renovations, full design-build projects, premium outdoor hardscaping, garage builds, and garden suites across Toronto and the GTA.",
  specialties: [
    {
      title: "Home & Condo Renovations",
      summary: "High-end interior renovations tailored for Toronto homes and condo buildings.",
      items: ["Bathroom and powder room renovations","Kitchen renovations and full interior remodels","Basement finishing and layout reconfiguration","Structural and addition scopes"],
    },
    {
      title: "New Garage Builds & Garden Suites",
      summary: "Ground-up secondary structures and detached building solutions for Toronto properties.",
      items: ["Single car, double car, and custom garage builds","Studio, 1-bedroom, 2-bedroom, and custom garden suites","Site servicing and access work","Permits, planning, and build management"],
    },
    {
      title: "Outdoor Living",
      summary: "Durable exterior upgrades designed to improve curb appeal, function, and outdoor use.",
      items: ["Concrete driveways, walkways, patios, and stairs","Pressure treated, composite, elevated decks, and handrails","Fence packages by material type","Interlock patios, retaining walls, and full backyard scopes"],
    },
  ],
  processSteps: [
    { title: "Consultation", items: ["Initial phone or site consultation","Review goals, budget, and scope","Discuss timeline and feasibility","Outline next steps"] },
    { title: "Planning", items: ["Scope definition and pricing","Material and finish selection","Permits and approvals where required","Scheduling and project coordination"] },
    { title: "Build", items: ["Site prep and trade coordination","Quality control and active management","Progress updates throughout the project","Execution to scope and schedule"] },
    { title: "Closeout", items: ["Final walkthrough","Deficiency completion","Site cleanup","Client handoff"] },
  ],
};

const fallbackTestimonials: Testimonial[] = [
  { _id: "1", quote: "Built Better Group kept the project organized from start to finish. The pricing was clear, the communication was strong, and the quality of the final renovation exceeded expectations.", name: "Michael R.", detail: "Condo Renovation · Downtown Toronto" },
  { _id: "2", quote: "They handled the design-build process professionally and made a complicated backyard project feel straightforward. The crew was clean, punctual, and detail-oriented.", name: "Sara L.", detail: "Outdoor Living Project · Etobicoke" },
  { _id: "3", quote: "From planning to permits to execution, everything felt managed properly. We always knew what stage the job was in and the workmanship was excellent.", name: "David K.", detail: "Garden Suite Project · Toronto GTA" },
];

async function getHomepageData() {
  try {
    const data = await client.fetch(homepageQuery);
    return data || fallbackHomepage;
  } catch {
    return fallbackHomepage;
  }
}

async function getTestimonials() {
  try {
    const data = await client.fetch(testimonialsQuery);
    return Array.isArray(data) && data.length ? data : fallbackTestimonials;
  } catch {
    return fallbackTestimonials;
  }
}

export default async function HomePage() {
  const homepage = await getHomepageData();
  const testimonials = await getTestimonials();
  const bgUrl = homepage.heroBackgroundImage ? urlFor(homepage.heroBackgroundImage).width(1800).height(1000).url() : "https://images.unsplash.com/photo-1600585154340-be6161a56a0c";

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="flex flex-col gap-4 border-b border-gray-800 bg-black px-5 py-5 text-white sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-900 font-bold text-yellow-400">BBG</div>
          <span className="text-sm tracking-[0.4em] text-gray-400">BUILT BETTER GROUP</span>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-xs text-gray-400">Call Now</p>
          <a href="tel:4377999675" className="text-lg font-semibold transition hover:text-yellow-400">437-799-9675</a>
        </div>
      </header>

      <section className="relative bg-cover bg-center px-5 py-20 text-white sm:px-8 sm:py-28" style={{ backgroundImage: `url('${bgUrl}')` }}>
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 max-w-3xl">
          <h1 className="mb-6 whitespace-pre-line text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">{homepage.heroTitle}</h1>
          <p className="mb-6 text-lg text-gray-200">{homepage.heroSubtitle}</p>
          <div className="mb-6 flex max-w-xl flex-col gap-3 sm:flex-row">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200">Toronto-focused design-build pricing</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200">Transparent estimator with live scope options</div>
          </div>
          <a href="#project-contact-form" className="inline-flex w-full items-center justify-center rounded-2xl bg-yellow-500 px-6 py-4 font-medium text-black transition hover:opacity-90 sm:w-auto sm:px-8">Request a Consultation</a>
        </div>
      </section>

      <section className="bg-gray-950 px-5 py-16 text-white sm:px-8 sm:py-20">
        <h2 className="mb-4 text-center text-3xl font-bold text-yellow-500">Our Specialties</h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-gray-400">Focused services built around the projects we do best across Toronto and the GTA.</p>
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {(homepage.specialties || []).map((specialty) => (
            <div key={specialty.title} className="rounded-2xl border border-gray-800 bg-black/40 p-6">
              <h3 className="mb-3 text-xl font-semibold text-white">{specialty.title}</h3>
              <p className="mb-5 text-sm text-gray-400">{specialty.summary}</p>
              <div className="space-y-3 text-sm text-gray-300">
                {specialty.items?.map((item) => <div key={item} className="flex gap-3"><span className="text-yellow-500">•</span><span>{item}</span></div>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-black px-5 py-16 text-white sm:px-8 sm:py-20">
        <h2 className="mb-4 text-center text-3xl font-bold text-yellow-500">Our Process</h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-gray-400">Every project follows a clear process so you know what to expect at each stage.</p>
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          {(homepage.processSteps || []).map((step, i) => (
            <div key={step.title} className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 font-bold text-black">{i + 1}</span>
                <p className="text-lg font-semibold">{step.title}</p>
              </div>
              <div className="space-y-3 text-gray-300">
                {step.items?.map((item) => <div key={item} className="flex gap-3"><span className="text-yellow-500">•</span><span>{item}</span></div>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-950 px-5 py-16 text-white sm:px-8 sm:py-20">
        <h2 className="mb-4 text-center text-3xl font-bold text-yellow-500">Client Testimonials</h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-gray-400">What clients say about working with Built Better Group across Toronto and the GTA.</p>
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <div key={item._id} className="rounded-2xl border border-gray-800 bg-black/40 p-6 text-white">
              <div className="mb-4 text-3xl text-yellow-500">“</div>
              <p className="mb-6 leading-7 text-gray-200">{item.quote}</p>
              <div className="border-t border-gray-800 pt-4">
                <p className="font-semibold text-white">{item.name}</p>
                <p className="text-sm text-gray-400">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="project-contact-form" className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
        <h2 className="mb-8 text-center text-3xl font-bold">Start Your Project</h2>
        <form action="https://formspree.io/f/maqapqqe" method="POST" className="grid gap-4">
          <input type="hidden" name="_subject" value="New Built Better Group Website Lead" />
          <input name="name" placeholder="Full Name" required className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20" />
          <input name="phone" placeholder="Phone" required className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20" />
          <input name="email" type="email" placeholder="Email" required className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20" />
          <textarea name="details" placeholder="Tell us about your project" className="min-h-32 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20" />
          <button type="submit" className="inline-flex w-full items-center justify-center rounded-2xl bg-yellow-500 px-6 py-4 font-medium text-black transition hover:opacity-90 sm:w-auto">Submit</button>
        </form>
      </section>

      <footer className="border-t border-gray-800 bg-black p-6 text-center text-white sm:p-8">
        <p>Built Better Group</p>
        <p className="text-sm text-gray-400">Condo Renovation, Garage Builds, Garden Suites & Outdoor Specialists - Toronto</p>
        <p className="mt-2 text-sm">
          <a href="mailto:Info@BuiltBetterGroup.ca" className="transition hover:text-yellow-400">Info@BuiltBetterGroup.ca</a>
          {" | "}
          <a href="tel:4377999675" className="transition hover:text-yellow-400">437-799-9675</a>
        </p>
      </footer>
    </div>
  );
}
