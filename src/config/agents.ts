/**
 * Cosentus Voice Agent Configuration
 * 
 * Centralized configuration for all voice agents.
 * This is the single source of truth for agent IDs.
 * 
 * When agent IDs change:
 * 1. Update this file
 * 2. Update lib/cosentus-voice/config.js (for third-party library)
 * 3. Redeploy
 */

export const AGENTS = {
  /**
   * Allison - Customer Service Agent
   * General customer service, handles inquiries
   */
  allison: 'agent_9d9f880dbde25925f75e5b2739',

  /**
   * Cindy - Payment & Balance Specialist
   * Handles outstanding balances, payment processing
   * Speaks 50+ languages, handles 20 calls simultaneously
   */
  cindy: 'agent_4510e7416ee31ca808b8546ed7',
  
  /**
   * Chris - Insurance Claim Follow-Up Specialist
   * Handles outbound insurance claim follow-ups
   */
  chris: 'agent_9571fe9261e3944f33777a1406',
  
  /**
   * Harper - Eligibility & Benefits Verification
   * Verifies patient insurance coverage and benefits
   */
  james: 'agent_f7e96fe43ce9bb611481839af8',
  
  /**
   * Olivia - Prior Authorization Follow-Up
   * Tracks prior authorization approvals with insurance companies
   */
  olivia: 'agent_a8f606995d3160a92be6874661',
  
  /**
   * Michael - Payment Reconciliation
   * Tracks down and resolves payment discrepancies with insurance companies
   */
  michael: 'agent_443ead51c8a35f874d0ca1a8c1',
  
  /**
   * Emily - Pre-Service Anesthesia Cost Estimates
   * Helps patients understand anesthesia costs before surgery
   */
  emily: 'agent_ff8707dccf16f96ecec4c448d3',
  
  /**
   * Sarah - Medical Appointment Scheduling
   * Handles inbound and outbound appointment scheduling for medical practices
   */
  sarah: 'agent_1b7fe9e057f84254f4fcca9256',
  
  /**
   * Chat Agent - Text-based AI Assistant
   * Answers questions about Cosentus using knowledge base
   */
  chat: 'agent_90d094ac45b9da3833c3fc835b',
} as const;

/**
 * Type-safe agent names
 */
export type AgentName = keyof typeof AGENTS;

/**
 * Helper to get agent ID by name
 */
export function getAgentId(name: AgentName): string {
  const id = AGENTS[name];
  if (!id) {
    throw new Error(`Agent ID not configured for: ${name}`);
  }
  return id;
}

/**
 * Helper to validate agent configuration
 */
export function validateAgentConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!AGENTS.allison) {
    errors.push('Agent ID not set for Allison');
  }

  if (!AGENTS.cindy) {
    errors.push('Agent ID not set for Cindy');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

