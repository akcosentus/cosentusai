/**
 * Cosentus Voice Agent Configuration
 * 
 * This file maps friendly agent names to Retell AI agent IDs.
 * Update this file when agent IDs change - no other code needs to be modified.
 */

export const AGENTS = {
  chloe: 'agent_1105555b1ff51f2bb88da4e8be',
  cindy: 'agent_65a721eac689079c9ce91d7a9b'
};

/**
 * API endpoint for token generation
 * Can be overridden using CosentusVoice.configure()
 */
export const DEFAULT_API_ENDPOINT = '/api/retell/register-call';

