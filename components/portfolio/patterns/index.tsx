/**
 * Pattern registry — maps each portfolio slug to its unique interaction
 * pattern. Every one of the 36 entries has a dedicated component
 * (data-testid={`pattern-${slug}`}).
 */
import React from 'react';
import type { PatternProps } from './kit.tsx';
import * as A from './suites-a.tsx';
import * as B from './suites-b.tsx';
import * as W from './workflows.tsx';

const REGISTRY: Record<string, React.FC<PatternProps>> = {
  // 21 suites
  'customer-support-control': A.CustomerSupportControl,
  'finance-close-reporting': A.FinanceCloseReporting,
  'finance-planning-treasury': A.FinancePlanningTreasury,
  'finance-ap-ar-operations': A.FinanceApArOperations,
  'finance-risk-crime-credit': A.FinanceRiskCrimeCredit,
  'finance-tax-revenue-compliance': A.FinanceTaxRevenueCompliance,
  'investment-ma-analytics': A.InvestmentMaAnalytics,
  'pricing-monetization-science': A.PricingMonetizationScience,
  'healthcare-revenue-cycle': A.HealthcareRevenueCycle,
  'clinical-patient-decision-support': A.ClinicalPatientDecisionSupport,
  'clinical-trials-life-sciences': A.ClinicalTrialsLifeSciences,
  'healthcare-operations-compliance': B.HealthcareOperationsCompliance,
  'fraud-identity-financial-crime': B.FraudIdentityFinancialCrime,
  'security-access-data-integrity': B.SecurityAccessDataIntegrity,
  'legal-contract-transaction': B.LegalContractTransaction,
  'legal-regulatory-privacy-ai': B.LegalRegulatoryPrivacyAi,
  'hr-hiring-privacy-onboarding': B.HrHiringPrivacyOnboarding,
  'communications-control': B.CommunicationsControl,
  'marketing-sales-evidence': B.MarketingSalesEvidence,
  'operations-procurement': B.OperationsProcurement,
  'mixed-quick-win-workflows': B.MixedQuickWinWorkflows,
  // 15 workflows
  'contract-review': W.ContractReview,
  'iac-security': W.IacSecurity,
  'ma-diligence': W.MaDiligence,
  'incident-postmortem': W.IncidentPostmortem,
  'grc-evidence': W.GrcEvidence,
  'reconciliation': W.Reconciliation,
  'enterprise-rfp': W.EnterpriseRfp,
  'govcon-rfp': W.GovConRfp,
  'fpa-variance': W.FpaVariance,
  'executive-flash': W.ExecutiveFlash,
  'lease-abstraction': W.LeaseAbstraction,
  'seo-planner': W.SeoPlanner,
  'evidence-backed-prd': W.EvidenceBackedPrd,
  'customer-health': W.CustomerHealth,
  'ab-experiment': W.AbExperiment,
};

export const PATTERN_SLUGS: string[] = Object.keys(REGISTRY);

export const Pattern: React.FC<PatternProps> = ({ entry }) => {
  const Component = REGISTRY[entry.slug];
  if (!Component) return null;
  return <Component entry={entry} />;
};
