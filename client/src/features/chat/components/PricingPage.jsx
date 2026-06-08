import { useState } from "react";

const plans = [
  {
    id: "starter",
    label: "Starter",
    price: "$0",
    period: "/month",
    description: "Perfect For Small Teams",
    cta: "Start Hiring",
    highlight: false,
    features: ["3 Projects", "AI Applicant Screening", "AI Recruiter"],
  },
  {
    id: "professional",
    label: "PROFESSIONAL",
    price: "$99",
    period: "/month",
    description: "Perfect For Growing Teams",
    cta: "Start Hiring",
    highlight: true,
    features: [
      "Unlimited Projects",
      "AI Applicant Screening",
      "AI Recruiter",
      "Risk-Free Guarantee",
    ],
  },
  {
    id: "enterprise",
    label: "ENTERPRISE",
    price: "Custom",
    period: "",
    description: "For Large Organizations",
    cta: "Contact Us",
    highlight: false,
    features: [
      "Unlimited Projects",
      "AI Applicant Screening",
      "Custom Skill Assessments",
      "Custom AI Recruiter",
    ],
  },
];

const CheckIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="flex-shrink-0 mt-1"
  >
    <path
      d="M3 7.5L6.5 11L12 4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function PricingPlans() {
  const [hoveredPlanId, setHoveredPlanId] = useState(null);

  return (
    
    <div className="min-h-screen w-full bg-bg-page dark:bg-[#0D0E15] flex flex-col items-center justify-center px-4 py-16 font-sans transition-colors duration-200">
      
      
      <div className="text-center mb-12 select-none">
        <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight mb-3">
          Pricing plans
        </h1>
        <p className="text-text-muted text-body font-medium">
          Choose the right plan for your needs.
        </p>
      </div>

      
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl items-stretch">
        {plans.map((plan) => {
          const isHovered = hoveredPlanId === plan.id;

          return (
            <div
              key={plan.id}
              onMouseEnter={() => setHoveredPlanId(plan.id)}
              onMouseLeave={() => setHoveredPlanId(null)}
              className={`flex flex-col flex-1 bg-bg-card border rounded-2xl overflow-hidden transition-all duration-300 transform select-none
                ${isHovered 
                  ? "shadow-2xl border-brand dark:border-[#7B6AFF] -translate-y-1.5" 
                  : "shadow-md border-border dark:border-[#2D3042]"}`}
            >
              
              <div
                className={`px-6 pt-8 pb-6 transition-colors duration-200
                  ${plan.highlight 
                    ? "bg-brand/10 dark:bg-[#7B6AFF]/10 border-b border-brand/10" 
                    : "bg-transparent"}`}
              >
                
                <span
                  className={`inline-block text-ui-sm font-bold tracking-wider px-3 py-1 rounded-full mb-4 uppercase
                    ${plan.highlight 
                      ? "bg-brand text-white dark:bg-[#7B6AFF]" 
                      : "bg-surface-hover text-text-muted"}`}
                >
                  {plan.label}
                </span>

                
                <div className="flex items-baseline text-text-primary gap-1">
                  <span className="text-[2.6rem] font-black tracking-tight leading-none">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-text-muted text-body font-semibold">
                      {plan.period}
                    </span>
                  )}
                </div>

                
                <p className="text-text-muted text-body-sm font-medium mt-3">
                  {plan.description}
                </p>
              </div>

              
              <div className="px-6 py-4">
                <button
                  className={`w-full py-3 rounded-xl font-bold text-[14px] tracking-wide transition-all duration-200 cursor-pointer active:scale-[0.98]
                    ${plan.highlight
                      ? "bg-brand dark:bg-[#7B6AFF] text-white hover:opacity-90 shadow-sm"
                      : "bg-text-primary text-bg-card hover:bg-text-primary/90"}`}
                >
                  {plan.cta}
                </button>
              </div>

              
              <div className="h-[1px] bg-border dark:bg-[#2D3042] mx-6 my-2" />

              
              <div className="px-6 pt-4 pb-8 flex flex-col gap-3.5 flex-1">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 text-text-primary">
                    
                    <span className={plan.highlight ? "text-brand dark:text-[#7B6AFF]" : "text-text-muted"}>
                      <CheckIcon />
                    </span>
                    <span className="text-body-sm font-medium leading-tight">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}   