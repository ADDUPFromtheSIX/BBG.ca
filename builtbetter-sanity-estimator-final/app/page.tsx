"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";
import { client, isSanityConfigured, urlFor } from "@/lib/sanity";
import { homepageQuery, testimonialsQuery } from "@/lib/queries";

type SizeTier = "small" | "medium" | "large";
type FinishLevel = "standard" | "premium" | "luxury";
type FenceMaterial = "pressure" | "cedar" | "stained" | "premium";
type ConcreteFinish = "broom" | "cali" | "stamped" | "exposed";
type RailingStyle = "pt" | "woodSpindle" | "aluminum" | "glass";
type YesNo = "yes" | "no";
type ProjectType = "condo-renovation" | "garage-build" | "garden-suite" | "outdoor-living";
type UnitType = "sqft" | "lf" | "steps";

type EstimatorJob = {
  label: string;
  unit: UnitType;
  quantities: Record<SizeTier, number>;
  rate: Record<string, number>;
  type?: "fence" | "concrete" | "railing";
};

type EstimatorSubcategory = {
  label: string;
  description?: string;
  jobs: Record<string, EstimatorJob>;
};

type EstimatorProject = {
  label: string;
  subcategories: Record<string, EstimatorSubcategory>;
};

type Specialty = {
  title: string;
  summary: string;
  items: string[];
};

type ProcessStep = {
  title: string;
  items: string[];
};

type HomepageContent = {
  heroTitle: string;
  heroSubtitle: string;
  heroBackgroundImage?: any;
  specialties: Specialty[];
  processSteps: ProcessStep[];
};

type Testimonial = {
  _id: string;
  quote: string;
  name: string;
  detail?: string;
};

const estimatorPricing: Record<ProjectType, EstimatorProject> = {
  "condo-renovation": {
    label: "Home / Condo Renovation",
    subcategories: {
      kitchenBath: {
        label: "Kitchen & Bath",
        jobs: {
          bathroom: {
            label: "Bathroom Renovation",
            unit: "sqft",
            quantities: { small: 70, medium: 120, large: 180 },
            rate: { standard: 280, premium: 360, luxury: 480 },
          },
          powderRoom: {
            label: "Powder Room Renovation",
            unit: "sqft",
            quantities: { small: 30, medium: 50, large: 80 },
            rate: { standard: 260, premium: 330, luxury: 430 },
          },
          kitchen: {
            label: "Kitchen Renovation",
            unit: "sqft",
            quantities: { small: 100, medium: 180, large: 280 },
            rate: { standard: 240, premium: 320, luxury: 430 },
          },
        },
      },
      fullInterior: {
        label: "Full Interior Renovation",
        jobs: {
          fullCondo: {
            label: "Full Condo Renovation",
            unit: "sqft",
            quantities: { small: 450, medium: 800, large: 1200 },
            rate: { standard: 185, premium: 250, luxury: 340 },
          },
          fullHome: {
            label: "Full Home Renovation",
            unit: "sqft",
            quantities: { small: 900, medium: 1800, large: 3000 },
            rate: { standard: 200, premium: 270, luxury: 360 },
          },
          basement: {
            label: "Basement Renovation",
            unit: "sqft",
            quantities: { small: 400, medium: 800, large: 1400 },
            rate: { standard: 165, premium: 220, luxury: 300 },
          },
        },
      },
      layoutStructural: {
        label: "Layout & Structural",
        jobs: {
          reconfiguration: {
            label: "Layout Reconfiguration",
            unit: "sqft",
            quantities: { small: 250, medium: 700, large: 1400 },
            rate: { standard: 220, premium: 290, luxury: 380 },
          },
          additionArea: {
            label: "Addition / Major Structural Area",
            unit: "sqft",
            quantities: { small: 250, medium: 600, large: 1200 },
            rate: { standard: 260, premium: 330, luxury: 420 },
          },
        },
      },
    },
  },
  "garage-build": {
    label: "New Garage Build",
    subcategories: {
      detachedGarage: {
        label: "Detached / Custom Garage Builds",
        description:
          "Ground-up garage construction including excavation, concrete slab, framing, roofing, exterior finishes, electrical rough-in, and compliance with Toronto building code requirements.",
        jobs: {
          singleCar: {
            label: "Single Car Garage",
            unit: "sqft",
            quantities: { small: 240, medium: 320, large: 400 },
            rate: { standard: 180, premium: 230, luxury: 290 },
          },
          doubleCar: {
            label: "Double Car Garage",
            unit: "sqft",
            quantities: { small: 400, medium: 550, large: 750 },
            rate: { standard: 170, premium: 220, luxury: 280 },
          },
          customGarage: {
            label: "Custom Garage / Workshop",
            unit: "sqft",
            quantities: { small: 500, medium: 800, large: 1200 },
            rate: { standard: 190, premium: 250, luxury: 320 },
          },
        },
      },
    },
  },
  "garden-suite": {
    label: "Garden Suite",
    subcategories: {
      newBuild: {
        label: "New Build Suites",
        description:
          "Detached secondary dwelling construction including structure, envelope, mechanical systems, interior finishes, servicing, and Toronto code compliance.",
        jobs: {
          studioSuite: {
            label: "Studio Garden Suite",
            unit: "sqft",
            quantities: { small: 250, medium: 400, large: 550 },
            rate: { standard: 320, premium: 400, luxury: 485 },
          },
          oneBedroom: {
            label: "1-Bedroom Garden Suite",
            unit: "sqft",
            quantities: { small: 450, medium: 650, large: 850 },
            rate: { standard: 325, premium: 395, luxury: 470 },
          },
          twoBedroom: {
            label: "2-Bedroom Garden Suite",
            unit: "sqft",
            quantities: { small: 700, medium: 900, large: 1200 },
            rate: { standard: 330, premium: 405, luxury: 485 },
          },
          customSuite: {
            label: "Custom Detached Suite",
            unit: "sqft",
            quantities: { small: 600, medium: 1000, large: 1500 },
            rate: { standard: 345, premium: 420, luxury: 500 },
          },
        },
      },
      siteService: {
        label: "Site & Service Work",
        jobs: {
          servicingPackage: {
            label: "Servicing / Utility Package",
            unit: "lf",
            quantities: { small: 50, medium: 100, large: 180 },
            rate: { standard: 180, premium: 220, luxury: 270 },
          },
          accessPath: {
            label: "Access / Walkway Package",
            unit: "sqft",
            quantities: { small: 100, medium: 220, large: 450 },
            rate: { standard: 70, premium: 90, luxury: 115 },
          },
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
          driveway: {
            label: "Driveway",
            unit: "sqft",
            type: "concrete",
            quantities: { small: 400, medium: 700, large: 1100 },
            rate: { broom: 22, cali: 26, stamped: 34, exposed: 38 },
          },
          walkway: {
            label: "Walkway",
            unit: "sqft",
            type: "concrete",
            quantities: { small: 80, medium: 180, large: 350 },
            rate: { broom: 24, cali: 28, stamped: 36, exposed: 40 },
          },
          patio: {
            label: "Concrete Patio",
            unit: "sqft",
            type: "concrete",
            quantities: { small: 180, medium: 350, large: 650 },
            rate: { broom: 22, cali: 27, stamped: 35, exposed: 39 },
          },
          stairs: {
            label: "Concrete Stairs",
            unit: "steps",
            type: "concrete",
            quantities: { small: 3, medium: 6, large: 10 },
            rate: { broom: 850, cali: 1000, stamped: 1400, exposed: 1600 },
          },
        },
      },
      decks: {
        label: "Decks",
        jobs: {
          pressureTreated: {
            label: "Pressure Treated Deck",
            unit: "sqft",
            quantities: { small: 120, medium: 250, large: 450 },
            rate: { standard: 65, premium: 78, luxury: 92 },
          },
          composite: {
            label: "Composite Deck",
            unit: "sqft",
            quantities: { small: 120, medium: 250, large: 450 },
            rate: { standard: 90, premium: 110, luxury: 130 },
          },
          elevated: {
            label: "Elevated / Framed Deck",
            unit: "sqft",
            quantities: { small: 150, medium: 300, large: 550 },
            rate: { standard: 110, premium: 130, luxury: 155 },
          },
          handrail: {
            label: "Handrail / Guardrail Installation",
            unit: "lf",
            type: "railing",
            quantities: { small: 12, medium: 30, large: 60 },
            rate: { pt: 95, woodSpindle: 130, aluminum: 165, glass: 285 },
          },
        },
      },
      fences: {
        label: "Fences",
        jobs: {
          woodPrivacy: {
            label: "Wood Privacy Fence",
            unit: "lf",
            type: "fence",
            quantities: { small: 40, medium: 100, large: 180 },
            rate: { pressure: 95, cedar: 120, stained: 135, premium: 160 },
          },
          horizontalSlat: {
            label: "Horizontal Slat Fence",
            unit: "lf",
            type: "fence",
            quantities: { small: 40, medium: 100, large: 180 },
            rate: { pressure: 120, cedar: 145, stained: 165, premium: 190 },
          },
          gates: {
            label: "Fence + Gates Package",
            unit: "lf",
            type: "fence",
            quantities: { small: 50, medium: 120, large: 220 },
            rate: { pressure: 110, cedar: 135, stained: 155, premium: 180 },
          },
        },
      },
      hardscaping: {
        label: "Hardscaping",
        jobs: {
          interlockPatio: {
            label: "Interlock Patio",
            unit: "sqft",
            quantities: { small: 180, medium: 350, large: 650 },
            rate: { standard: 32, premium: 40, luxury: 50 },
          },
          retainingWall: {
            label: "Retaining Wall",
            unit: "lf",
            quantities: { small: 20, medium: 50, large: 100 },
            rate: { standard: 160, premium: 210, luxury: 260 },
          },
          fullBackyard: {
            label: "Full Backyard Hardscape",
            unit: "sqft",
            quantities: { small: 500, medium: 900, large: 1500 },
            rate: { standard: 55, premium: 75, luxury: 95 },
          },
        },
      },
    },
  },
};

const defaultHomepage: HomepageContent = {
  heroTitle: "Condo Renovations. Design & Build.\nOutdoor Living.",
  heroSubtitle:
    "Built Better Group specializes in high-end condo renovations, full design-build projects, premium outdoor hardscaping, garage builds, and garden suites across Toronto and the GTA.",
  specialties: [
    {
      title: "Home & Condo Renovations",
      summary: "High-end interior renovations tailored for Toronto homes and condo buildings.",
      items: [
        "Bathroom and powder room renovations",
        "Kitchen renovations and full interior remodels",
        "Basement finishing and layout reconfiguration",
        "Structural and addition scopes",
      ],
    },
    {
      title: "New Garage Builds & Garden Suites",
      summary: "Ground-up secondary structures and detached building solutions for Toronto properties.",
      items: [
        "Single car, double car, and custom garage builds",
        "Studio, 1-bedroom, 2-bedroom, and custom garden suites",
        "Site servicing and access work",
        "Permits, planning, and build management",
      ],
    },
    {
      title: "Outdoor Living",
      summary: "Durable exterior upgrades designed to improve curb appeal, function, and outdoor use.",
      items: [
        "Concrete driveways, walkways, patios, and stairs",
        "Pressure treated, composite, elevated decks, and handrails",
        "Fence packages by material type",
        "Interlock patios, retaining walls, and full backyard scopes",
      ],
    },
  ],
  processSteps: [
    {
      title: "Consultation",
      items: [
        "Initial phone or site consultation",
        "Review goals, budget, and scope",
        "Discuss timeline and feasibility",
        "Outline next steps",
      ],
    },
    {
      title: "Planning",
      items: [
        "Scope definition and pricing",
        "Material and finish selection",
        "Permits and approvals where required",
        "Scheduling and project coordination",
      ],
    },
    {
      title: "Build",
      items: [
        "Site prep and trade coordination",
        "Quality control and active management",
        "Progress updates throughout the project",
        "Execution to scope and schedule",
      ],
    },
    {
      title: "Closeout",
      items: [
        "Final walkthrough",
        "Deficiency completion",
        "Site cleanup",
        "Client handoff",
      ],
    },
  ],
};

const defaultTestimonials: Testimonial[] = [
  {
    _id: "1",
    quote:
      "Built Better Group kept the project organized from start to finish. The pricing was clear, the communication was strong, and the quality of the final renovation exceeded expectations.",
    name: "Michael R.",
    detail: "Condo Renovation · Downtown Toronto",
  },
  {
    _id: "2",
    quote:
      "They handled the design-build process professionally and made a complicated backyard project feel straightforward. The crew was clean, punctual, and detail-oriented.",
    name: "Sara L.",
    detail: "Outdoor Living Project · Etobicoke",
  },
  {
    _id: "3",
    quote:
      "From planning to permits to execution, everything felt managed properly. We always knew what stage the job was in and the workmanship was excellent.",
    name: "David K.",
    detail: "Garden Suite Project · Toronto GTA",
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatUnit(unit: UnitType) {
  if (unit === "sqft") return "sqft";
  if (unit === "lf") return "LF";
  return "steps";
}

function getSizeLabels(job: EstimatorJob): Record<SizeTier, string> {
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

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
};

function Button({
  className = "",
  variant = "default",
  type = "button",
  children,
  ...props
}: ButtonProps) {
  const base =
    variant === "outline"
      ? "inline-flex items-center justify-center rounded-2xl border border-gray-700 bg-transparent px-4 py-3 font-medium text-white transition hover:bg-white/5"
      : "inline-flex items-center justify-center rounded-2xl bg-yellow-500 px-4 py-3 font-medium text-black transition hover:opacity-90";

  return (
    <button type={type} className={`${base} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}

function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`rounded-2xl ${className}`.trim()}>{children}</div>;
}

function CardContent({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={className}>{children}</div>;
}

function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return (
    <input
      {...rest}
      className={`w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 ${className}`.trim()}
    />
  );
}

function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", ...rest } = props;
  return (
    <textarea
      {...rest}
      className={`w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 ${className}`.trim()}
    />
  );
}

export default function BuiltBetterWebsite() {
  const [homepage, setHomepage] = useState<HomepageContent>(defaultHomepage);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [heroBackgroundUrl, setHeroBackgroundUrl] = useState<string>(
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  );
  const [openStep, setOpenStep] = useState<number | null>(0);
  const [openSpecialty, setOpenSpecialty] = useState<number | null>(0);
  const [projectType, setProjectType] = useState<ProjectType>("outdoor-living");
  const [subCategory, setSubCategory] = useState<string>("fences");
  const [jobType, setJobType] = useState<string>("woodPrivacy");
  const [sizeTier, setSizeTier] = useState<SizeTier>("medium");
  const [finishLevel, setFinishLevel] = useState<FinishLevel>("premium");
  const [fenceMaterial, setFenceMaterial] = useState<FenceMaterial>("cedar");
  const [concreteFinish, setConcreteFinish] = useState<ConcreteFinish>("broom");
  const [railingStyle, setRailingStyle] = useState<RailingStyle>("aluminum");
  const [permitsRequired, setPermitsRequired] = useState<YesNo>("yes");
  const [designBuild, setDesignBuild] = useState<YesNo>("yes");
  const [showBreakdown, setShowBreakdown] = useState(false);

  useEffect(() => {
    async function loadSanityContent() {
      if (!isSanityConfigured || !client) return;

      try {
        const homepageData = (await client.fetch(homepageQuery)) as Partial<HomepageContent> | null;
        if (homepageData) {
          setHomepage({
            heroTitle: homepageData.heroTitle || defaultHomepage.heroTitle,
            heroSubtitle: homepageData.heroSubtitle || defaultHomepage.heroSubtitle,
            heroBackgroundImage: homepageData.heroBackgroundImage,
            specialties: homepageData.specialties || defaultHomepage.specialties,
            processSteps: homepageData.processSteps || defaultHomepage.processSteps,
          });

          if (homepageData.heroBackgroundImage) {
            const built = urlFor(homepageData.heroBackgroundImage);
            if (built) {
              setHeroBackgroundUrl(built.width(1800).height(1000).url());
            }
          }
        }

        const testimonialData = (await client.fetch(testimonialsQuery)) as Testimonial[] | null;
        if (Array.isArray(testimonialData) && testimonialData.length > 0) {
          setTestimonials(testimonialData);
        }
      } catch {
        // Keep defaults if Sanity is unavailable
      }
    }

    void loadSanityContent();
  }, []);

  const selectedProject = estimatorPricing[projectType];
  const subcategoryKeys = Object.keys(selectedProject.subcategories);
  const safeSubCategory = selectedProject.subcategories[subCategory]
    ? subCategory
    : subcategoryKeys[0];
  const selectedSubCategory = selectedProject.subcategories[safeSubCategory];
  const jobKeys = Object.keys(selectedSubCategory.jobs);
  const safeJobType = selectedSubCategory.jobs[jobType] ? jobType : jobKeys[0];
  const selectedJob = selectedSubCategory.jobs[safeJobType];

  useEffect(() => {
    if (safeSubCategory !== subCategory) setSubCategory(safeSubCategory);
    if (safeJobType !== jobType) setJobType(safeJobType);
  }, [jobType, safeJobType, safeSubCategory, subCategory]);

  const estimate = useMemo(() => {
    const quantity = selectedJob.quantities[sizeTier];
    const rate =
      selectedJob.type === "fence"
        ? selectedJob.rate[fenceMaterial]
        : selectedJob.type === "concrete"
          ? selectedJob.rate[concreteFinish]
          : selectedJob.type === "railing"
            ? selectedJob.rate[railingStyle]
            : selectedJob.rate[finishLevel];

    const base = quantity * rate;
    const permitCost =
      permitsRequired === "yes"
        ? Math.max(
            base * (projectType === "outdoor-living" ? 0.03 : 0.05),
            projectType === "outdoor-living" ? 1000 : 3000,
          )
        : 0;
    const designCost =
      designBuild === "yes"
        ? Math.max(
            base * (projectType === "outdoor-living" ? 0.08 : 0.12),
            projectType === "outdoor-living" ? 1500 : 5000,
          )
        : 0;
    const complexityFactor =
      projectType === "condo-renovation"
        ? 1.1
        : projectType === "garden-suite" || projectType === "garage-build"
          ? 1.07
          : 1.08;
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
      quantity,
      rate,
    };
  }, [
    concreteFinish,
    designBuild,
    fenceMaterial,
    finishLevel,
    permitsRequired,
    projectType,
    railingStyle,
    selectedJob,
    selectedSubCategory.label,
    sizeTier,
  ]);

  const breakdownItems = useMemo(() => {
    const common = [
      `Project type: ${selectedProject.label}`,
      `Sub category: ${selectedSubCategory.label}`,
      `Job type: ${selectedJob.label}`,
      `Estimated scope: ${estimate.quantityLabel}`,
      `Base rate: ${estimate.rateLabel}`,
      "Labour, standard materials, and contractor margin included",
      permitsRequired === "yes" ? "Permit allowance included" : "Permit allowance excluded",
      designBuild === "yes"
        ? "Design-build coordination included"
        : "Design-build coordination excluded",
    ];

    if (selectedSubCategory.description) {
      common.splice(2, 0, `About this category: ${selectedSubCategory.description}`);
    }

    return common;
  }, [
    designBuild,
    estimate.quantityLabel,
    estimate.rateLabel,
    permitsRequired,
    selectedJob.label,
    selectedProject.label,
    selectedSubCategory.description,
    selectedSubCategory.label,
  ]);

  const materialDetails = useMemo(() => {
    if (selectedJob.type === "concrete") {
      const concreteDetails: Record<ConcreteFinish, { title: string; points: string[] }> = {
        broom: {
          title: "Broom Finish",
          points: [
            "Standard slip-resistant broom texture.",
            "Natural grey concrete appearance.",
            "Best suited for driveways, walkways, and utility slabs.",
          ],
        },
        cali: {
          title: "California Broom",
          points: [
            "More refined directional broom pattern.",
            "Cleaner visual finish than standard broom.",
            "Popular for modern exterior concrete work.",
          ],
        },
        stamped: {
          title: "Stamped Concrete",
          points: [
            "Decorative pattern pressed into finished concrete.",
            "Higher-detail labour and finishing.",
            "Premium visual result for feature areas.",
          ],
        },
        exposed: {
          title: "Exposed Aggregate",
          points: [
            "Top surface washed to reveal stone aggregate.",
            "Strong slip resistance and premium texture.",
            "Popular for upscale entries and walkways.",
          ],
        },
      };
      return concreteDetails[concreteFinish];
    }

    if (selectedJob.type === "fence") {
      const fenceDetails: Record<FenceMaterial, { title: string; points: string[] }> = {
        pressure: {
          title: "Pressure Treated",
          points: [
            "Most budget-friendly fence material option.",
            "Designed for exterior durability.",
            "Can be left natural or stained later.",
          ],
        },
        cedar: {
          title: "Cedar",
          points: [
            "Naturally rot-resistant wood.",
            "Warmer premium look than pressure treated.",
            "Popular for higher-end residential fences.",
          ],
        },
        stained: {
          title: "Stained Cedar",
          points: [
            "Cedar fence package with stain allowance included.",
            "Better colour consistency and weather protection.",
            "More finished final appearance.",
          ],
        },
        premium: {
          title: "Premium / Horizontal Upgrade",
          points: [
            "Cleaner architectural fence detailing.",
            "Upgraded hardware and finish allowance.",
            "Best for modern fence styles.",
          ],
        },
      };
      return fenceDetails[fenceMaterial];
    }

    if (selectedJob.type === "railing") {
      const railingDetails: Record<RailingStyle, { title: string; points: string[] }> = {
        pt: {
          title: "Pressure Treated Rail",
          points: [
            "Most economical guard/handrail option.",
            "Good for simple exterior guardrails.",
            "Can be stained or painted later.",
          ],
        },
        woodSpindle: {
          title: "Wood Rail with Spindles",
          points: [
            "Traditional warm residential look.",
            "Good fit for classic deck builds.",
            "Works well with stained wood finishes.",
          ],
        },
        aluminum: {
          title: "Aluminum Picket / Spindle",
          points: [
            "Low-maintenance powder-coated system.",
            "Clean modern appearance.",
            "Commonly selected in black or white.",
          ],
        },
        glass: {
          title: "Glass Railing System",
          points: [
            "Premium tempered glass guard system.",
            "Open sightlines and modern finish.",
            "Best suited for high-end outdoor projects.",
          ],
        },
      };
      return railingDetails[railingStyle];
    }

    const finishDetails: Record<FinishLevel, { title: string; points: string[] }> = {
      standard: {
        title: "Standard Finish Level",
        points: [
          "Practical material selections.",
          "Value-focused finish allowances.",
          "Built for clean execution and solid function.",
        ],
      },
      premium: {
        title: "Premium Finish Level",
        points: [
          "Upgraded finish quality and better visual results.",
          "Most common tier for quality GTA residential work.",
          "Better detailing and finish selections.",
        ],
      },
      luxury: {
        title: "Luxury Finish Level",
        points: [
          "Higher-end materials and premium selections.",
          "Best for custom or design-forward projects.",
          "Top-tier finish expectations.",
        ],
      },
    };

    return finishDetails[finishLevel];
  }, [concreteFinish, fenceMaterial, finishLevel, railingStyle, selectedJob.type]);

  const estimateFinishSelection = useMemo(() => {
    if (selectedJob.type === "fence") {
      return {
        label: "Fence Material",
        value:
          fenceMaterial === "pressure"
            ? "Pressure Treated"
            : fenceMaterial === "cedar"
              ? "Cedar"
              : fenceMaterial === "stained"
                ? "Stained Cedar"
                : "Premium / Horizontal Upgrade",
      };
    }

    if (selectedJob.type === "concrete") {
      return {
        label: "Concrete Finish",
        value:
          concreteFinish === "broom"
            ? "Broom Finish"
            : concreteFinish === "cali"
              ? "California Broom"
              : concreteFinish === "stamped"
                ? "Stamped Concrete"
                : "Exposed Aggregate",
      };
    }

    if (selectedJob.type === "railing") {
      return {
        label: "Handrail Style",
        value:
          railingStyle === "pt"
            ? "Pressure Treated Rail"
            : railingStyle === "woodSpindle"
              ? "Wood Rail with Spindles"
              : railingStyle === "aluminum"
                ? "Aluminum Picket / Spindle"
                : "Glass Railing System",
      };
    }

    return {
      label: "Finish Level",
      value:
        finishLevel === "standard"
          ? "Standard"
          : finishLevel === "premium"
            ? "Premium"
            : "Luxury",
    };
  }, [concreteFinish, fenceMaterial, finishLevel, railingStyle, selectedJob.type]);

  const professionalEstimateSummary = useMemo(() => {
    return [
      "BUILT BETTER GROUP - PROFESSIONAL ESTIMATE REQUEST",
      "",
      `Estimate: ${estimate.label}`,
      `Budget Range: ${formatCurrency(estimate.low)} - ${formatCurrency(estimate.high)}`,
      `Project Type: ${selectedProject.label}`,
      `Sub Category: ${selectedSubCategory.label}`,
      `Job Type: ${selectedJob.label}`,
      `Project Size: ${estimate.quantityLabel}`,
      `${estimateFinishSelection.label}: ${estimateFinishSelection.value}`,
      `Permits Required: ${permitsRequired === "yes" ? "Yes" : "No"}`,
      `Design & Build Support: ${designBuild === "yes" ? "Included" : "Excluded"}`,
      "",
      "PRICING BREAKDOWN",
      `Base Estimate: ${formatCurrency(estimate.base)}`,
      `Permit Allowance: ${formatCurrency(estimate.permitCost)}`,
      `Design / Build Allowance: ${formatCurrency(estimate.designCost)}`,
      `Complexity Factor: x${estimate.complexityFactor.toFixed(2)}`,
      "",
      "INCLUSIONS",
      ...breakdownItems.map((item) => `- ${item}`),
      "",
      "MATERIAL / FINISH NOTES",
      `${materialDetails.title}`,
      ...materialDetails.points.map((point) => `- ${point}`),
    ].join("\n");
  }, [
    breakdownItems,
    designBuild,
    estimate.base,
    estimate.complexityFactor,
    estimate.designCost,
    estimate.label,
    estimate.low,
    estimate.high,
    estimate.permitCost,
    estimate.quantityLabel,
    estimateFinishSelection.label,
    estimateFinishSelection.value,
    materialDetails.points,
    materialDetails.title,
    permitsRequired,
    selectedJob.label,
    selectedProject.label,
    selectedSubCategory.label,
  ]);

  const sizeOptions = getSizeLabels(selectedJob);
  const isFenceJob = selectedJob.type === "fence";
  const isConcreteJob = selectedJob.type === "concrete";
  const isRailingJob = selectedJob.type === "railing";

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="flex flex-col gap-4 border-b border-gray-800 bg-black px-5 py-5 text-white sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-900 font-bold text-yellow-400">
            BBG
          </div>
          <span className="text-sm tracking-[0.4em] text-gray-400">BUILT BETTER GROUP</span>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-xs text-gray-400">Call Now</p>
          <a href="tel:4377999675" className="text-lg font-semibold hover:text-yellow-400 transition">
            437-799-9675
          </a>
        </div>
      </header>

      <section
        className="relative bg-cover bg-center px-5 py-20 text-white sm:px-8 sm:py-28"
        style={{ backgroundImage: `url('${heroBackgroundUrl}')` }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 whitespace-pre-line text-4xl font-bold leading-tight sm:text-5xl md:text-6xl"
          >
            {homepage.heroTitle}
          </motion.h1>
          <p className="mb-6 text-lg text-gray-200">{homepage.heroSubtitle}</p>
          <div className="mb-6 flex max-w-xl flex-col gap-3 sm:flex-row">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200">
              Toronto-focused design-build pricing
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200">
              Transparent estimator with live scope options
            </div>
          </div>
          <Button
            className="w-full px-6 py-4 sm:w-auto sm:px-8"
            onClick={() => {
              document.getElementById("project-estimator")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
          >
            Project Estimating Calculator
          </Button>
        </div>
      </section>

      <section className="bg-gray-950 px-5 py-16 text-white sm:px-8 sm:py-20">
        <h2 className="mb-4 text-center text-3xl font-bold text-yellow-500">Our Specialties</h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-gray-400">
          Focused services built around the projects we do best across Toronto and the GTA.
        </p>
        <div className="mx-auto max-w-5xl space-y-4">
          {homepage.specialties.map((specialty, i) => {
            const isOpen = openSpecialty === i;
            return (
              <div key={specialty.title} className="overflow-hidden rounded-2xl border border-gray-800 bg-black/40">
                <button
                  type="button"
                  onClick={() => setOpenSpecialty(isOpen ? null : i)}
                  className="w-full px-6 py-5 text-left transition hover:bg-white/5"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{specialty.title}</h3>
                      <p className="mt-2 max-w-2xl text-sm text-gray-400">{specialty.summary}</p>
                    </div>
                    <span className="mt-1 text-2xl leading-none text-yellow-500">{isOpen ? "−" : "+"}</span>
                  </div>
                </button>
                {isOpen && (
                  <div className="border-t border-gray-800 px-6 pb-6">
                    <div className="grid gap-3 pt-5 text-gray-300 md:grid-cols-2">
                      {specialty.items.map((item) => (
                        <div key={item} className="flex gap-3">
                          <span className="text-yellow-500">•</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-black px-5 py-16 text-white sm:px-8 sm:py-20">
        <h2 className="mb-4 text-center text-3xl font-bold text-yellow-500">Our Process</h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-gray-400">
          Every project follows a clear process so you know what to expect at each stage.
        </p>
        <div className="mx-auto grid max-w-5xl gap-4 sm:gap-6 md:grid-cols-2">
          {homepage.processSteps.map((step, i) => {
            const isOpen = openStep === i;
            return (
              <button
                key={step.title}
                type="button"
                onClick={() => setOpenStep(isOpen ? null : i)}
                className="rounded-2xl border border-gray-800 bg-gray-950 p-6 text-left transition hover:border-yellow-500"
                aria-expanded={isOpen}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 font-bold text-black">
                      {i + 1}
                    </span>
                    <p className="text-lg font-semibold">{step.title}</p>
                  </div>
                  <span className="text-2xl leading-none text-yellow-500">{isOpen ? "−" : "+"}</span>
                </div>
                {isOpen && (
                  <ul className="mt-4 space-y-3 text-gray-300">
                    {step.items.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="text-yellow-500">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <section className="bg-gray-950 px-5 py-16 text-white sm:px-8 sm:py-20">
        <h2 className="mb-4 text-center text-3xl font-bold text-yellow-500">Client Testimonials</h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-gray-400">
          What clients say about working with Built Better Group across Toronto and the GTA.
        </p>
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <Card key={item._id} className="border border-gray-800 bg-black/40 text-white">
              <CardContent className="p-6">
                <div className="mb-4 text-3xl text-yellow-500">“</div>
                <p className="mb-6 leading-7 text-gray-200">{item.quote}</p>
                <div className="border-t border-gray-800 pt-4">
                  <p className="font-semibold text-white">{item.name}</p>
                  <p className="text-sm text-gray-400">{item.detail}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="project-estimator" className="bg-black px-5 py-16 text-white sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-start gap-6 sm:gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="mb-4 text-3xl font-bold text-yellow-500">Project Estimating Calculator</h2>
            <p className="mb-8 max-w-2xl text-gray-400">
              Give clients a transparent ballpark price before consultation. This estimator covers interior renovations, new garage builds, garden suites, concrete, decks, fences, handrails, and hardscape scopes across Toronto and the GTA.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-gray-400">Project Type</label>
                <select
                  value={projectType}
                  onChange={(e) => {
                    setProjectType(e.target.value as ProjectType);
                    setSizeTier("medium");
                  }}
                  className="min-h-12 w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-white"
                >
                  <option value="condo-renovation">Home / Condo Renovation</option>
                  <option value="garage-build">New Garage Build</option>
                  <option value="garden-suite">Garden Suite</option>
                  <option value="outdoor-living">Outdoor Living</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-400">Sub Category</label>
                <select
                  value={safeSubCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className="min-h-12 w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-white"
                >
                  {Object.entries(selectedProject.subcategories).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-gray-400">Job Type</label>
                <select
                  value={safeJobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="min-h-12 w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-white"
                >
                  {Object.entries(selectedSubCategory.jobs).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-400">Project Size</label>
                <select
                  value={sizeTier}
                  onChange={(e) => setSizeTier(e.target.value as SizeTier)}
                  className="min-h-12 w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-white"
                >
                  <option value="small">{sizeOptions.small}</option>
                  <option value="medium">{sizeOptions.medium}</option>
                  <option value="large">{sizeOptions.large}</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  {isFenceJob
                    ? "Fence Material"
                    : isConcreteJob
                      ? "Concrete Finish"
                      : isRailingJob
                        ? "Handrail Style / Material"
                        : "Finish Level"}
                </label>
                {isFenceJob ? (
                  <select
                    value={fenceMaterial}
                    onChange={(e) => setFenceMaterial(e.target.value as FenceMaterial)}
                    className="min-h-12 w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-white"
                  >
                    <option value="pressure">Pressure Treated</option>
                    <option value="cedar">Cedar</option>
                    <option value="stained">Stained Cedar</option>
                    <option value="premium">Premium / Horizontal Upgrade</option>
                  </select>
                ) : isConcreteJob ? (
                  <select
                    value={concreteFinish}
                    onChange={(e) => setConcreteFinish(e.target.value as ConcreteFinish)}
                    className="min-h-12 w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-white"
                  >
                    <option value="broom">Broom Finish</option>
                    <option value="cali">California Broom</option>
                    <option value="stamped">Stamped Concrete</option>
                    <option value="exposed">Exposed Aggregate</option>
                  </select>
                ) : isRailingJob ? (
                  <select
                    value={railingStyle}
                    onChange={(e) => setRailingStyle(e.target.value as RailingStyle)}
                    className="min-h-12 w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-white"
                  >
                    <option value="pt">Pressure Treated Rail</option>
                    <option value="woodSpindle">Wood Rail with Spindles</option>
                    <option value="aluminum">Aluminum Picket / Spindle</option>
                    <option value="glass">Glass Railing System</option>
                  </select>
                ) : (
                  <select
                    value={finishLevel}
                    onChange={(e) => setFinishLevel(e.target.value as FinishLevel)}
                    className="min-h-12 w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-white"
                  >
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                    <option value="luxury">Luxury</option>
                  </select>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-400">Permits Required?</label>
                <select
                  value={permitsRequired}
                  onChange={(e) => setPermitsRequired(e.target.value as YesNo)}
                  className="min-h-12 w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-white"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-400">Include Design &amp; Build Support?</label>
                <select
                  value={designBuild}
                  onChange={(e) => setDesignBuild(e.target.value as YesNo)}
                  className="min-h-12 w-full rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-white"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
          </div>

          <Card className="rounded-2xl border border-gray-800 bg-gray-950 text-white lg:sticky lg:top-4">
            <CardContent className="p-5 sm:p-8">
              <p className="mb-3 text-sm uppercase tracking-[0.2em] text-gray-400">Estimated Budget Range</p>
              <h3 className="mb-2 text-2xl font-semibold">{estimate.label}</h3>
              <p className="mb-4 text-3xl font-bold text-yellow-500 sm:text-4xl">
                {formatCurrency(estimate.low)} - {formatCurrency(estimate.high)}
              </p>
              <div className="mb-6 space-y-2 text-sm text-gray-300">
                <p>• Scope: {estimate.quantityLabel}</p>
                <p>• Rate: {estimate.rateLabel}</p>
                <p>• Includes labour, materials, and contractor margin</p>
              </div>
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowBreakdown((prev) => !prev)}
                  className="w-full rounded-2xl border-gray-700 bg-transparent text-white hover:bg-white/5"
                >
                  {showBreakdown ? "Hide Quote Breakdown" : "View What's Included"}
                </Button>
                <Button
                  className="w-full rounded-2xl bg-yellow-500 text-black"
                  onClick={() => {
                    document.getElementById("project-contact-form")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                >
                  Request This Estimate
                </Button>
              </div>
              {showBreakdown && (
                <div className="mt-6 border-t border-gray-800 pt-6">
                  <p className="mb-3 text-sm uppercase tracking-[0.2em] text-gray-400">Quote Breakdown</p>
                  <div className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
                    <div className="space-y-4">
                      <div className="space-y-2 text-sm text-gray-300">
                        {breakdownItems.map((item) => (
                          <div key={item} className="flex gap-3">
                            <span className="text-yellow-500">•</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm text-gray-400">
                        <div>
                          <p>Base Estimate</p>
                          <p className="text-white">{formatCurrency(estimate.base)}</p>
                        </div>
                        <div>
                          <p>Permit Allowance</p>
                          <p className="text-white">{formatCurrency(estimate.permitCost)}</p>
                        </div>
                        <div>
                          <p>Design / Build Allowance</p>
                          <p className="text-white">{formatCurrency(estimate.designCost)}</p>
                        </div>
                        <div>
                          <p>Complexity Factor</p>
                          <p className="text-white">x{estimate.complexityFactor.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                    <aside className="h-fit rounded-2xl border border-gray-800 bg-black/30 p-4">
                      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-gray-400">Material / Finish Notes</p>
                      <p className="mb-3 font-semibold text-white">{materialDetails.title}</p>
                      <div className="space-y-2 text-sm text-gray-300">
                        {materialDetails.points.map((point) => (
                          <div key={point} className="flex gap-3">
                            <span className="text-yellow-500">•</span>
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    </aside>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="project-contact-form" className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
        <h2 className="mb-3 text-center text-3xl font-bold">Request Your Professional Estimate</h2>
        <p className="mx-auto mb-8 max-w-2xl text-center text-gray-600">
          Submit your details and we will receive a formatted estimate summary including your selected scope, finish level, pricing range, and quote breakdown.
        </p>
        <form action="https://formspree.io/f/maqapqqe" method="POST" className="grid gap-4">
          <input
            type="hidden"
            name="_subject"
            value={`Built Better Group Estimate Request - ${estimate.label} - ${formatCurrency(
              estimate.low,
            )} to ${formatCurrency(estimate.high)}`}
          />
          <input type="hidden" name="submission_type" value="Professional Estimate Request" />
          <input type="hidden" name="estimate_title" value={estimate.label} />
          <input
            type="hidden"
            name="estimate_budget_range"
            value={`${formatCurrency(estimate.low)} - ${formatCurrency(estimate.high)}`}
          />
          <input type="hidden" name="estimate_project_type" value={selectedProject.label} />
          <input type="hidden" name="estimate_sub_category" value={selectedSubCategory.label} />
          <input type="hidden" name="estimate_job_type" value={selectedJob.label} />
          <input type="hidden" name="estimate_scope" value={estimate.quantityLabel} />
          <input type="hidden" name="estimate_base_rate" value={estimate.rateLabel} />
          <input type="hidden" name="estimate_finish_label" value={estimateFinishSelection.label} />
          <input type="hidden" name="estimate_finish_value" value={estimateFinishSelection.value} />
          <input
            type="hidden"
            name="estimate_permits_required"
            value={permitsRequired === "yes" ? "Yes" : "No"}
          />
          <input
            type="hidden"
            name="estimate_design_build_support"
            value={designBuild === "yes" ? "Included" : "Excluded"}
          />
          <input type="hidden" name="estimate_base_estimate" value={formatCurrency(estimate.base)} />
          <input
            type="hidden"
            name="estimate_permit_allowance"
            value={formatCurrency(estimate.permitCost)}
          />
          <input
            type="hidden"
            name="estimate_design_allowance"
            value={formatCurrency(estimate.designCost)}
          />
          <input
            type="hidden"
            name="estimate_complexity_factor"
            value={`x${estimate.complexityFactor.toFixed(2)}`}
          />
          <input type="hidden" name="estimate_material_notes_title" value={materialDetails.title} />
          <input
            type="hidden"
            name="estimate_material_notes"
            value={materialDetails.points.join(" | ")}
          />
          <input
            type="hidden"
            name="estimate_inclusions"
            value={breakdownItems.join(" | ")}
          />
          <textarea
            name="professional_estimate_summary"
            value={professionalEstimateSummary}
            readOnly
            className="hidden"
          />
          <Input name="name" placeholder="Full Name" required />
          <Input name="phone" placeholder="Phone" required />
          <Input name="email" type="email" placeholder="Email" required />
          <Input name="project" placeholder="Project Type" defaultValue={estimate.label} />
          <Textarea name="details" placeholder="Tell us about your project" className="min-h-32" />
          <Button type="submit" className="w-full rounded-2xl bg-yellow-500 py-4 text-black sm:w-auto">
            Submit Professional Estimate Request
          </Button>
        </form>
      </section>

      <footer className="border-t border-gray-800 bg-black p-6 text-center text-white sm:p-8">
        <p>Built Better Group</p>
        <p className="text-sm text-gray-400">Condo Renovation, Garage Builds, Garden Suites & Outdoor Specialists - Toronto</p>
        <p className="mt-2 text-sm">
          <a href="mailto:Info@BuiltBetterGroup.ca" className="transition hover:text-yellow-400">
            Info@BuiltBetterGroup.ca
          </a>
          {" | "}
          <a href="tel:4377999675" className="transition hover:text-yellow-400">
            437-799-9675
          </a>
        </p>
      </footer>
    </div>
  );
}
