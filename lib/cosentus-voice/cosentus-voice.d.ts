/**
 * TypeScript definitions for Cosentus Voice Agent Library
 * @version 1.0.0
 */

declare module 'cosentus-voice' {
  /**
   * Available agent names
   */
  export type AgentName = 'chloe' | 'cindy';

  /**
   * Event types
   */
  export type VoiceAgentEvent =
    | 'connected'
    | 'disconnected'
    | 'speaking'
    | 'listening'
    | 'connecting'
    | 'error'
    | 'statusChange'
    | 'update';

  /**
   * Agent state
   */
  export interface VoiceAgentState {
    isConnected: boolean;
    isRecording: boolean;
    isConnecting: boolean;
    error: string | null;
    agentId: string;
    agentName: string;
  }

  /**
   * Event callback types
   */
  export type EventCallback<T = any> = (data?: T) => void;

  /**
   * Voice Agent Instance
   */
  export interface VoiceAgent {
    /**
     * Agent ID (Retell)
     */
    readonly agentId: string;

    /**
     * Agent name
     */
    readonly agentName: string;

    /**
     * Current connection state
     */
    readonly isConnected: boolean;

    /**
     * Whether agent is currently speaking
     */
    readonly isRecording: boolean;

    /**
     * Whether connection is in progress
     */
    readonly isConnecting: boolean;

    /**
     * Current error message, if any
     */
    readonly error: string | null;

    /**
     * Connect to the agent and start voice call
     * @throws {Error} If connection fails
     */
    connect(): Promise<void>;

    /**
     * Disconnect from the agent and end voice call
     */
    disconnect(): void;

    /**
     * Register an event listener
     * @param event - Event name
     * @param callback - Callback function
     */
    on(event: 'connected', callback: EventCallback<void>): void;
    on(event: 'disconnected', callback: EventCallback<void>): void;
    on(event: 'speaking', callback: EventCallback<void>): void;
    on(event: 'listening', callback: EventCallback<void>): void;
    on(event: 'connecting', callback: EventCallback<void>): void;
    on(event: 'error', callback: EventCallback<string>): void;
    on(event: 'statusChange', callback: EventCallback<string>): void;
    on(event: 'update', callback: EventCallback<any>): void;

    /**
     * Remove an event listener
     * @param event - Event name
     * @param callback - Callback function to remove
     */
    off(event: VoiceAgentEvent, callback: EventCallback): void;

    /**
     * Get current agent state
     */
    getState(): VoiceAgentState;
  }

  /**
   * Configuration options
   */
  export interface CosentusVoiceConfig {
    /**
     * Custom API endpoint for token generation
     * @default '/api/retell/register-call'
     */
    apiEndpoint?: string;
  }

  /**
   * Main Cosentus Voice API
   */
  export interface CosentusVoiceAPI {
    /**
     * Available agents (name → ID mapping)
     */
    readonly agents: Record<AgentName, string>;

    /**
     * Library version
     */
    readonly version: string;

    /**
     * Create a new voice agent instance
     * @param agentName - Agent name ('chloe' or 'cindy')
     * @returns Voice agent instance
     * @throws {Error} If agent name is invalid
     */
    createAgent(agentName: AgentName): VoiceAgent;

    /**
     * Configure the library
     * @param options - Configuration options
     */
    configure(options: CosentusVoiceConfig): void;
  }

  /**
   * Global CosentusVoice object
   */
  export const CosentusVoice: CosentusVoiceAPI;

  export default CosentusVoice;
}

/**
 * Global type augmentation for browser usage
 */
declare global {
  interface Window {
    CosentusVoice: import('cosentus-voice').CosentusVoiceAPI;
  }
}

