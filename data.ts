
import { AppData } from './types.ts';

export const APP_DATA: AppData = {
  hero: {
    status: "SYSTEM ONLINE",
    headline: "EXECUTIVE PROTOCOLS",
    subheadline: "Deploy enterprise-grade operating procedures. Verified methodologies for high-stakes decision making and structural capital.",
  },
  protocols: [
    {
      id: "p1",
      category: "Finance",
      level: "Enterprise",
      title: "SaaS Valuation Model v4",
      description: "Standardized DCF and comparable analysis framework for B2B SaaS acquisition targets.",
      price: "$249",
      isVerified: true,
      tags: ["Structured Output", "XLSX Source"],
      acquisitionCount: 142,
    },
    {
      id: "p2",
      category: "Compliance",
      level: "Advanced",
      title: "GDPR Audit Core",
      description: "Complete checklist and document generator for EU data privacy compliance audits.",
      price: "$199",
      isVerified: true,
      tags: ["PDF Gen", "Legal"],
      acquisitionCount: 210,
    },
    {
      id: "p3",
      category: "Operations",
      level: "Core",
      title: "Crisis Response Unit",
      description: "Communication templates and decision trees for immediate PR crisis management.",
      price: "$89",
      isVerified: false,
      tags: ["Playbook"],
      acquisitionCount: 88,
    },
    {
      id: "p4",
      category: "Strategy",
      level: "Enterprise",
      title: "Board Deck Architect",
      description: "Narrative structures and slide layouts for Series B+ fundraising and board meetings.",
      price: "$349",
      isVerified: true,
      tags: ["Presentation", "Strategy"],
      acquisitionCount: 95,
    }
  ],
  tools: [
    {
      id: "t1",
      name: "Valuation Terminal",
      status: "Online",
      description: "Real-time market multiples and comp sets.",
      type: "Terminal",
      access: "Pro"
    },
    {
      id: "t2",
      name: "Protocol Documenter",
      status: "Online",
      description: "Auto-generate protocol documentation from raw notes.",
      type: "Document",
      access: "Free"
    },
    {
      id: "t3",
      name: "Risk Matrix Analyzer",
      status: "Beta",
      description: "Quantify operational risks using monte-carlo sims.",
      type: "Analytics",
      access: "Pro"
    },
    {
      id: "t4",
      name: "Contract Synthesizer",
      status: "Online",
      description: "Extract key terms from legal PDFs instantly.",
      type: "Terminal",
      access: "Pro"
    }
  ],
  footer: {
    systemStatus: "SYSTEM OPERATIONAL",
    version: "v2.0.4-rc"
  }
};
