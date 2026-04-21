"use client";

import { useEffect, useMemo, useState } from "react";

const estimatorPricing = {
  "condo-renovation": {
    label: "Home / Condo Renovation",
    subcategories: {
      kitchenBath: {
        label: "Kitchen & Bath",
        jobs: {
          bathroom: { label: "Bathroom Renovation", unit: "sqft", quantities: { small: 70, medium: 120, large: 180 }, rate: { standard: 280, premium: 360, luxury: 480 } },
          powderRoom: { label: "Powder Room Renovation", unit: "sqft", quantities: { small: 30, medium: 50, large: 80 }, rate: { standard: 260, premium: 330, luxury: 430 } },
          kitchen: { label: "Kitchen Renovation", unit: "sqft", quantities: { small: 100, medium: 180, large: 280 }, rate: { standard: 240, premium: 320, luxury: 430 } },
        },
      },
      fullInterior: {
        label: "Full Interior Renovation",
        jobs: {
          fullCondo: { label: "Full Condo Renovation", unit: "sqft", quantities: { small: 450, medium: 800, large: 1200 }, rate: { standard: 185, premium: 250, luxury: 340 } },
          fullHome: { label: "Full Home Renovation", unit: "sqft", quantities: { small: 900, medium: 1800, large: 3000 }, rate: { standard: 200, premium: 270, luxury: 360 } },
          basement: { label: "Basement Renovation", unit: "sqft", quantities: { small: 400, medium: 800, large: 1400 }, rate: { standard: 165, premium: 220, luxury: 300 } },
        },
      },
      layoutStructural: {
        label: "Layout & Structural",
        jobs: {
          reconfiguration: { label: "Layout Reconfiguration", unit: "sqft", quantities: { small: 250, medium: 700, large: 1400 }, rate: { standard: 220, premium: 290, luxury: 380 } },
          additionArea: { label: "Addition / Major Structural Area", unit: "sqft", quantities: { small: 250, medium: 600, large: 1200 }, rate: { standard: 260, premium: 330, luxury: 420 } },
        },
      },
    },
  },
  "garden-suite": {
    label: "Garage / Garden Suite",
    subcategories: {
      conversions: {
        label: "Conversions",
        description: "Conversion projects transform an existing structure such as a garage or detached space into functional living space with structural, insulation, plumbing, HVAC, electrical, and interior finish upgrades.",
        jobs: {
          garageConversion: { label: "Garage Conversion", unit: "sqft", quantities: { small: 250, medium: 400, large: 650 }, rate: { standard: 310, premium: 385, luxury: 465 } },
          studioSuite: { label: "Studio Garden Suite", unit: "sqft", quantities: { small: 250, medium: 400, large: 550 }, rate: { standard: 320, premium: 400, luxury: 485 } },
        },
      },
      newBuild: {
        label: "New Build Suites",
        jobs: {
          oneBedroom: { label: "1-Bedroom Garden Suite", unit: "sqft", quantities: { small: 450, medium: 650, large: 850 }, rate: { standard: 325, premium: 395, luxury: 470 } },
          twoBedroom: { label: "2-Bedroom Garden Suite", unit: "sqft", quantities: { small: 700, medium: 900, large: 1200 }, rate: { standard: 330, premium: 405, luxury: 485 } },
          customSuite: { label: "Custom Detached Suite", unit: "sqft", quantities: { small: 600, medium: 1000, large: 1500 }, rate: { standard: 345, premium: 420, luxury: 500 } },
        },
      },
      siteService: {
        label: "Site & Service Work",
        jobs: {
          servicingPackage: { label: "Servicing / Utility Package", unit: "lf", quantities: { small: 50, medium: 100, large: 180 }, rate: { standard: 180, premium: 220, luxury: 270 } },
          accessPath: { label: "Access / Walkway Package", unit: "sqft", quantities: { small: 100, medium: 220, large: 450 }, rate: { standard: 70, premium: 90, luxury: 115 } },
        },
      },
    },
  },
  "outdoor-living": {
    label: "Outdoor Living",
    subcategories: {
      concrete: {
        label: "Concrete",
        jobs: {
          driveway: { label: "Driveway", unit: "sqft", type: "concrete", quantities: { small: 400, medium: 700, large: 1100 }, rate: { broom: 22, cali: 26, stamped: 34, exposed: 38 } },
          walkway: { label: "Walkway", unit: "sqft", type: "concrete", quantities: { small: 80, medium: 180, large: 350 }, rate: { broom: 24, cali: 28, stamped: 36, exposed: 40 } },
          patio: { label: "Concrete Patio", unit: "sqft", type: "concrete", quantities: { small: 180, medium: 350, large: 650 }, rate: { broom: 22, cali: 27, stamped: 35, exposed: 39 } },
          stairs: { label: "Concrete Stairs", unit: "steps", type: "concrete", quantities: { small: 3, medium: 6, large: 10 }, rate: { broom: 850, cali: 1000, stamped: 1400, exposed: 1600 } },
        },
      },
      decks: {
        label: "Decks",
        jobs: {
          pressureTreated: { label: "Pressure Treated Deck", unit: "sqft", quantities: { small: 120, medium: 250, large: 450 }, rate: { standard: 65, premium: 78, luxury: 92 } },
          composite: { label: "Composite Deck", unit: "sqft", quantities: { small: 120, medium: 250, large: 450 }, rate: { standard: 90, premium: 110, luxury: 130 } },
          elevated: { label: "Elevated / Framed Deck", unit: "sqft", quantities: { small: 150, medium: 300, large: 550 }, rate: { standard: 110, premium: 130, luxury: 155 } },
          handrail: { label: "Handrail / Guardrail Installation", unit: "lf", type: "railing", quantities: { small: 12, medium: 30, large: 60 }, rate: { pt: 95, woodSpindle: 130, aluminum: 165, glass: 285 } },
        },
      },
      fences: {
        label: "Fences",
        jobs: {
          woodPrivacy: { label: "Wood Privacy Fence", unit: "lf", type: "fence", quantities: { small: 40, medium: 100, large: 180 }, rate: { pressure: 95, cedar: 120, stained: 135, premium: 160 } },
          horizontalSlat: { label: "Horizontal Slat Fence", unit: "lf", type: "fence", quantities: { small: 40, medium: 100, large: 180 }, rate: { pressure: 120, cedar: 145, stained: 165, premium: 190 } },
          gates: { label: "Fence + Gates Package", unit: "lf", type: "fence", quantities: { small: 50, medium: 120, large: 220 }, rate: { pressure: 110, cedar: 135, stained: 155, premium: 180 } },
        },
      },
      hardscaping: {
        label: "Hardscaping",
        jobs: {
          interlockPatio: { label: "Interlock Patio", unit: "sqft", quantities: { small: 180, medium: 350, large: 650 }, rate: { standard: 32, premium: 40, luxury: 50 } },
          retainingWall: { label: "Retaining Wall", unit: "lf", quantities: { small: 20, medium: 50, large: 100 }, rate: { standard: 160, premium: 210, luxury: 260 } },
          fullBackyard: { label: "Full Backyard Hardscape", unit: "sqft", quantities: { small: 500, medium: 900, large: 1500 }, rate: { standard: 55, premium: 75, luxury: 95 } },
        },
      },
    },
  },
};

const specialties = [
  {
    title: "Home & Condo Renovations",
    summary: "High-end interior renovations tailored for Toronto homes and condo buildings.",
    items: ["Bathrooms and powder rooms", "Kitchen renovations", "Full interior remodels", "Basement finishing", "Layout changes and structural scopes"],
  },
  {
    title: "Garage & Garden Suites",
    summary: "Complete design-build solutions for secondary suites, detached spaces, and property expansion.",
    items: ["Garage conversions", "Studio, 1-bedroom and 2-bedroom suites", "Custom detached suites", "Site servicing and access work"],
  },
  {
    title: "Outdoor Living",
    summary: "Durable exterior upgrades designed to improve curb appeal, function, and outdoor use.",
    items: ["Concrete driveways, walkways, patios, stairs", "Deck builds and handrails", "Fence packages", "Interlock, retaining walls, full backyard hardscape"],
  },
];

const processSteps = [
  { title: "1. Consultation", items: ["Initial call or site visit", "Budget and scope review", "Project feasibility discussion", "Next-step planning"] },
  { title: "2. Planning", items: ["Scope definition", "Material and finish selection", "Permit coordination where required", "Scheduling and project planning"] },
  { title: "3. Build", items: ["Site prep", "Trade coordination", "Quality control", "Execution to scope and schedule"] },
  { title: "4. Closeout", items: ["Final walkthrough", "Deficiency completion", "Site cleanup", "Project handoff"] },
];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(value);
}

function formatUnit(unit) {
  if (unit === "sqft") return "sqft";
  if (unit === "lf") return "LF";
  return "steps";
}

function sizeLabels(job) {
  const small = job.quantities.small;
  const medium = job.quantities.medium;
  const unit = formatUnit(job.unit);
  if (job.unit === "steps") {
    return {
      small: `Small (1 - ${small} ${unit})`,
      medium: `Medium (${small + 1} - ${medium} ${unit})`,
      large: `Large (${medium + 1}+ ${unit})`,
    };
  }
  return {
    small: `Small (Up to ${small} ${unit})`,
    medium: `Medium (${small + 1} - ${medium} ${unit})`,
    large: `Large (${medium + 1}+ ${unit})`,
  };
}

export default function Home() {
  const [projectType, setProjectType] = useState("outdoor-living");
  const [subCategory, setSubCategory] = useState("fences");
  const [jobType, setJobType] = useState("woodPrivacy");
  const [sizeTier, setSizeTier] = useState("medium");
  const [finishLevel, setFinishLevel] = useState("premium");
  const [fenceMaterial, setFenceMaterial] = useState("cedar");
  const [concreteFinish, setConcreteFinish] = useState("broom");
  const [railingStyle, setRailingStyle] = useState("aluminum");
  const [permitsRequired, setPermitsRequired] = useState("yes");
  const [designBuild, setDesignBuild] = useState("yes");
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [openProcess, setOpenProcess] = useState(0);
  const [openSpecialty, setOpenSpecialty] = useState(0);

  const selectedProject = estimatorPricing[projectType];
  const safeSubCategory = selectedProject.subcategories[subCategory] ? subCategory : Object.keys(selectedProject.subcategories)[0];
  const selectedSubCategory = selectedProject.subcategories[safeSubCategory];
  const safeJobType = selectedSubCategory.jobs[jobType] ? jobType : Object.keys(selectedSubCategory.jobs)[0];
  const selectedJob = selectedSubCategory.jobs[safeJobType];

  useEffect(() => {
    if (safeSubCategory !== subCategory) setSubCategory(safeSubCategory);
    if (safeJobType !== jobType) setJobType(safeJobType);
  }, [safeSubCategory, safeJobType, subCategory, jobType]);

  const estimate = useMemo(() => {
    const quantity = selectedJob.quantities[sizeTier];
    const rate = selectedJob.type === "fence"
      ? selectedJob.rate[fenceMaterial]
      : selectedJob.type === "concrete"
      ? selectedJob.rate[concreteFinish]
      : selectedJob.type === "railing"
      ? selectedJob.rate[railingStyle]
      : selectedJob.rate[finishLevel];

    const base = quantity * rate;
    const permitCost = permitsRequired === "yes" ? Math.max(base * (projectType === "outdoor-living" ? 0.03 : 0.05), projectType === "outdoor-living" ? 1000 : 3000) : 0;
    const designCost = designBuild === "yes" ? Math.max(base * (projectType === "outdoor-living" ? 0.08 : 0.12), projectType === "outdoor-living" ? 1500 : 5000) : 0;
    const complexityFactor = projectType === "condo-renovation" ? 1.1 : projectType === "garden-suite" ? 1.07 : 1.08;
    const subtotal = base * complexityFactor + permitCost + designCost;
    const roundBase = projectType === "outdoor-living" ? 500 : 1000;

    return {
      label: `${selectedSubCategory.label} - ${selectedJob.label}`,
      quantityLabel: `${quantity} ${formatUnit(selectedJob.unit)}`,
      rateLabel: `${formatCurrency(rate)}/${formatUnit(selectedJob.unit)}`,
      low: Math.round((subtotal * 0.9) / roundBase) * roundBase,
      high: Math.round((subtotal * 1.15) / roundBase) * roundBase,
      base,
      permitCost,
      designCost,
      complexityFactor,
    };
  }, [selectedJob, sizeTier, fenceMaterial, concreteFinish, railingStyle, finishLevel, permitsRequired, designBuild, projectType, selectedSubCategory.label]);

  const breakdownItems = useMemo(() => {
    const items = [
      `Project type: ${selectedProject.label}`,
      `Sub category: ${selectedSubCategory.label}`,
      `Job type: ${selectedJob.label}`,
      `Estimated scope: ${estimate.quantityLabel}`,
      `Base rate: ${estimate.rateLabel}`,
      `Labour, materials, and contractor margin included`,
      permitsRequired === "yes" ? "Permit allowance included" : "Permit allowance excluded",
      designBuild === "yes" ? "Design-build coordination included" : "Design-build coordination excluded",
    ];
    if (selectedSubCategory.description) items.splice(2, 0, `About this category: ${selectedSubCategory.description}`);
    return items;
  }, [selectedProject.label, selectedSubCategory.label, selectedSubCategory.description, selectedJob.label, estimate.quantityLabel, estimate.rateLabel, permitsRequired, designBuild]);

  const materialNotes = useMemo(() => {
    if (selectedJob.type === "fence") {
      return fenceMaterial === "pressure"
        ? ["Pressure treated wood is the most budget-friendly option.", "Good for durability and straightforward installs.", "Can be stained later."]
        : fenceMaterial === "cedar"
        ? ["Cedar offers a warmer premium look.", "Naturally more rot-resistant.", "Popular for higher-end residential fences."]
        : fenceMaterial === "stained"
        ? ["Stained cedar includes a more finished appearance.", "Better colour consistency.", "Adds weather protection."]
        : ["Premium upgrade suits more modern fence styles.", "Higher-detail finish and hardware allowance.", "Best for architectural looks."];
    }
    if (selectedJob.type === "concrete") {
      return concreteFinish === "broom"
        ? ["Slip-resistant utility-friendly finish.", "Most cost-efficient concrete option.", "Best for driveways and walkways."]
        : concreteFinish === "cali"
        ? ["Refined directional broom pattern.", "Cleaner visual finish than standard broom.", "Balanced upgrade."]
        : concreteFinish === "stamped"
        ? ["Decorative patterned surface.", "Includes higher-detail labour.", "Premium visual appeal."]
        : ["Aggregate is exposed for texture and grip.", "Premium finish for entries and walkways.", "Higher finishing allowance included."];
    }
    if (selectedJob.type === "railing") {
      return railingStyle === "pt"
        ? ["Pressure treated rail is the most economical option.", "Works well for simple exterior guardrails.", "Can be stained or painted later."]
        : railingStyle === "woodSpindle"
        ? ["Traditional wood look with spindle system.", "Warm residential style.", "Good fit for classic decks."]
        : railingStyle === "aluminum"
        ? ["Low-maintenance powder-coated system.", "Clean modern appearance.", "Commonly selected in black or white."]
        : ["Tempered glass railing system.", "Premium open sightlines.", "Best for high-end modern projects."];
    }
    return finishLevel === "standard"
      ? ["Practical material selections.", "Good-value finish allowances.", "Built for strong value and clean execution."]
      : finishLevel === "premium"
      ? ["Upgraded finish quality and allowances.", "Most common tier for quality GTA residential work.", "Better detailing and finish selections."]
      : ["Higher-end materials and premium selections.", "Best for custom or design-forward projects.", "Top-tier finish expectations."];
  }, [selectedJob.type, fenceMaterial, concreteFinish, railingStyle, finishLevel]);

  const labels = sizeLabels(selectedJob);

  return (
    <main>
      <header className="topbar">
        <div className="brand">
          <div className="logoBox">BBG</div>
          <div>
            <div className="eyebrow">BUILT BETTER GROUP</div>
            <div className="subeyebrow">Toronto General Contracting</div>
          </div>
        </div>
        <div className="topContact">
          <div>Call Now</div>
          <a href="tel:4377999675">437-799-9675</a>
        </div>
      </header>

      <section className="hero">
        <div className="heroOverlay"></div>
        <div className="container heroInner">
          <h1>Condo Renovations. Design &amp; Build.<br />Outdoor Living.</h1>
          <p>
            Built Better Group helps Toronto and GTA clients complete high-quality
            condo renovations, garage and garden suites, and outdoor living projects
            with transparent pricing and professional project management.
          </p>
          <div className="pillRow">
            <div className="pill">Toronto-focused pricing</div>
            <div className="pill">One-stop contractor support</div>
            <div className="pill">Mobile-ready estimating form</div>
          </div>
          <button className="primaryBtn" onClick={() => document.getElementById("estimator")?.scrollIntoView({ behavior: "smooth" })}>
            Project Estimating Calculator
          </button>
        </div>
      </section>

      <section className="darkSection">
        <div className="container">
          <h2 className="sectionTitle">Our Specialties</h2>
          <p className="sectionIntro">Focused services built around the projects we do best across Toronto and the GTA.</p>
          <div className="accordionStack">
            {specialties.map((item, index) => (
              <div className="accordionCard" key={item.title}>
                <button className="accordionButton" onClick={() => setOpenSpecialty(openSpecialty === index ? -1 : index)}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                  </div>
                  <span>{openSpecialty === index ? "−" : "+"}</span>
                </button>
                {openSpecialty === index && (
                  <div className="accordionBody">
                    {item.items.map((point) => (
                      <div className="bulletRow" key={point}><span>•</span><span>{point}</span></div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="blackSection">
        <div className="container">
          <h2 className="sectionTitle">Our Process</h2>
          <p className="sectionIntro">Every project follows a clear process so clients know exactly what to expect.</p>
          <div className="gridTwo">
            {processSteps.map((step, index) => (
              <button className="processCard" key={step.title} onClick={() => setOpenProcess(openProcess === index ? -1 : index)}>
                <div className="processHead">
                  <div className="processTitle">{step.title}</div>
                  <span>{openProcess === index ? "−" : "+"}</span>
                </div>
                {openProcess === index && (
                  <div className="processBody">
                    {step.items.map((point) => (
                      <div className="bulletRow" key={point}><span>•</span><span>{point}</span></div>
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="darkSection">
        <div className="container">
          <h2 className="sectionTitle">Recent Work</h2>
          <div className="gridThree">
            {["Modern Condo Remodel", "Custom Backyard Deck", "Fence & Landscaping Project"].map((project) => (
              <div className="projectCard" key={project}>
                <div className="projectImage"></div>
                <div className="projectCopy">
                  <h3>{project}</h3>
                  <p>Toronto, Ontario</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="estimator" className="blackSection">
        <div className="container estimatorWrap">
          <div>
            <h2 className="sectionTitle left">Project Estimating Calculator</h2>
            <p className="sectionIntro left">
              Give prospects a clear starting point before consultation. This estimator covers interior renovations, suites, concrete, decks, handrails, fences, and hardscape scopes.
            </p>

            <div className="formGrid">
              <div>
                <label>Project Type</label>
                <select value={projectType} onChange={(e) => { setProjectType(e.target.value); setSizeTier("medium"); }}>
                  <option value="condo-renovation">Home / Condo Renovation</option>
                  <option value="garden-suite">Garage / Garden Suite</option>
                  <option value="outdoor-living">Outdoor Living</option>
                </select>
              </div>

              <div>
                <label>Sub Category</label>
                <select value={safeSubCategory} onChange={(e) => setSubCategory(e.target.value)}>
                  {Object.entries(selectedProject.subcategories).map(([key, value]) => (
                    <option key={key} value={key}>{value.label}</option>
                  ))}
                </select>
              </div>

              <div className="spanTwo">
                <label>Job Type</label>
                <select value={safeJobType} onChange={(e) => setJobType(e.target.value)}>
                  {Object.entries(selectedSubCategory.jobs).map(([key, value]) => (
                    <option key={key} value={key}>{value.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label>Project Size</label>
                <select value={sizeTier} onChange={(e) => setSizeTier(e.target.value)}>
                  <option value="small">{labels.small}</option>
                  <option value="medium">{labels.medium}</option>
                  <option value="large">{labels.large}</option>
                </select>
              </div>

              <div>
                <label>{selectedJob.type === "fence" ? "Fence Material" : selectedJob.type === "concrete" ? "Concrete Finish" : selectedJob.type === "railing" ? "Handrail Style / Material" : "Finish Level"}</label>
                {selectedJob.type === "fence" ? (
                  <select value={fenceMaterial} onChange={(e) => setFenceMaterial(e.target.value)}>
                    <option value="pressure">Pressure Treated</option>
                    <option value="cedar">Cedar</option>
                    <option value="stained">Stained Cedar</option>
                    <option value="premium">Premium / Horizontal Upgrade</option>
                  </select>
                ) : selectedJob.type === "concrete" ? (
                  <select value={concreteFinish} onChange={(e) => setConcreteFinish(e.target.value)}>
                    <option value="broom">Broom Finish</option>
                    <option value="cali">California Broom</option>
                    <option value="stamped">Stamped Concrete</option>
                    <option value="exposed">Exposed Aggregate</option>
                  </select>
                ) : selectedJob.type === "railing" ? (
                  <select value={railingStyle} onChange={(e) => setRailingStyle(e.target.value)}>
                    <option value="pt">Pressure Treated Rail</option>
                    <option value="woodSpindle">Wood Rail with Spindles</option>
                    <option value="aluminum">Aluminum Picket / Spindle</option>
                    <option value="glass">Glass Railing System</option>
                  </select>
                ) : (
                  <select value={finishLevel} onChange={(e) => setFinishLevel(e.target.value)}>
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                    <option value="luxury">Luxury</option>
                  </select>
                )}
              </div>

              <div>
                <label>Permits Required?</label>
                <select value={permitsRequired} onChange={(e) => setPermitsRequired(e.target.value)}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div>
                <label>Include Design &amp; Build Support?</label>
                <select value={designBuild} onChange={(e) => setDesignBuild(e.target.value)}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
          </div>

          <div className="estimateCard">
            <div className="cardEyebrow">Estimated Budget Range</div>
            <h3>{estimate.label}</h3>
            <div className="priceRange">{formatCurrency(estimate.low)} - {formatCurrency(estimate.high)}</div>
            <div className="metaList">
              <p>• Scope: {estimate.quantityLabel}</p>
              <p>• Rate: {estimate.rateLabel}</p>
              <p>• Includes labour, materials, and contractor margin</p>
            </div>

            <button className="secondaryBtn" onClick={() => setShowBreakdown(!showBreakdown)}>
              {showBreakdown ? "Hide Quote Breakdown" : "View What's Included"}
            </button>
            <button className="primaryBtn full" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
              Request This Estimate
            </button>

            {showBreakdown && (
              <div className="breakdown">
                <h4>Quote Breakdown</h4>
                <div className="breakdownGrid">
                  <div>
                    {breakdownItems.map((item) => (
                      <div className="bulletRow" key={item}><span>•</span><span>{item}</span></div>
                    ))}
                    <div className="costGrid">
                      <div><small>Base Estimate</small><strong>{formatCurrency(estimate.base)}</strong></div>
                      <div><small>Permit Allowance</small><strong>{formatCurrency(estimate.permitCost)}</strong></div>
                      <div><small>Design / Build</small><strong>{formatCurrency(estimate.designCost)}</strong></div>
                      <div><small>Complexity Factor</small><strong>x{estimate.complexityFactor.toFixed(2)}</strong></div>
                    </div>
                  </div>
                  <aside className="notesBox">
                    <div className="cardEyebrow">Material / Finish Notes</div>
                    {materialNotes.map((item) => (
                      <div className="bulletRow" key={item}><span>•</span><span>{item}</span></div>
                    ))}
                  </aside>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="contact" className="lightSection">
        <div className="container narrow">
          <h2 className="contactTitle">Start Your Project</h2>
          <form className="contactForm" action="https://formspree.io/f/maqapqqe" method="POST">
            <input type="hidden" name="_subject" value="New Built Better Group Website Lead" />
            <input type="hidden" name="estimate_project_type" value={selectedProject.label} />
            <input type="hidden" name="estimate_sub_category" value={selectedSubCategory.label} />
            <input type="hidden" name="estimate_job_type" value={selectedJob.label} />
            <input type="hidden" name="estimate_scope" value={estimate.quantityLabel} />
            <input type="hidden" name="estimate_rate" value={estimate.rateLabel} />
            <input type="hidden" name="estimate_range" value={`${formatCurrency(estimate.low)} - ${formatCurrency(estimate.high)}`} />
            <input type="hidden" name="estimate_breakdown" value={breakdownItems.join(" | ")} />

            <input name="name" placeholder="Full Name" required />
            <input name="phone" placeholder="Phone" required />
            <input name="email" type="email" placeholder="Email" required />
            <input name="project" placeholder="Project Type" defaultValue={estimate.label} />
            <textarea name="details" placeholder="Tell us about your project"></textarea>
            <button className="primaryBtn full" type="submit">Submit</button>
          </form>
        </div>
      </section>

      <footer className="footer">
        <div>Built Better Group</div>
        <div>Condo Renovation, Suites &amp; Outdoor Specialists - Toronto</div>
        <div>
          <a href="mailto:Info@BuiltBetterGroup.ca">Info@BuiltBetterGroup.ca</a>
          {" | "}
          <a href="tel:4377999675">437-799-9675</a>
        </div>
      </footer>
    </main>
  );
}
