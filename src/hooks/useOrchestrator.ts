import { useReducer, useDeferredValue, useCallback } from 'react';
import type { ModuleType } from '../types';

export interface OrchestratorState {
  activeModule: ModuleType;
  pendingChatInput: { content: string; immediate?: boolean } | null;
  agentInternetAllowed: boolean;
  devMode: boolean;
  activeAccountEmail: string;
  uiMutation: { css: string; htmlPatch?: string };
  lamportClock: number;
}

export type OrchestratorAction =
  | { type: 'SET_MODULE'; payload: ModuleType }
  | { type: 'SET_PENDING_CHAT'; payload: { content: string; immediate?: boolean } | null }
  | { type: 'TOGGLE_INTERNET' }
  | { type: 'SET_DEV_MODE'; payload: boolean }
  | { type: 'SWITCH_ACCOUNT_EMAIL'; payload: string }
  | { type: 'SET_UI_MUTATION'; payload: { css: string; htmlPatch?: string } }
  | { type: 'INCREMENT_CLOCK' };

const initialOrchestratorState: OrchestratorState = {
  activeModule: 'chat',
  pendingChatInput: null,
  agentInternetAllowed: true,
  devMode: true,
  activeAccountEmail: 'joshualhamilton17@gmail.com',
  uiMutation: { css: '' },
  lamportClock: 1
};

/**
 * Pure reducer function governing orchestrator state transitions.
 * Enforces stateless functional programming and deterministic state evolution
 * adhering to the patterns specified in codingKnowledgeBase.ts.
 */
export function orchestratorReducer(state: OrchestratorState, action: OrchestratorAction): OrchestratorState {
  const nextClock = state.lamportClock + 1;
  switch (action.type) {
    case 'SET_MODULE':
      return {
        ...state,
        activeModule: action.payload,
        lamportClock: nextClock
      };
    case 'SET_PENDING_CHAT':
      return {
        ...state,
        pendingChatInput: action.payload,
        lamportClock: nextClock
      };
    case 'TOGGLE_INTERNET':
      return {
        ...state,
        agentInternetAllowed: !state.agentInternetAllowed,
        lamportClock: nextClock
      };
    case 'SET_DEV_MODE':
      return {
        ...state,
        devMode: action.payload,
        lamportClock: nextClock
      };
    case 'SWITCH_ACCOUNT_EMAIL':
      return {
        ...state,
        activeAccountEmail: action.payload,
        lamportClock: nextClock
      };
    case 'SET_UI_MUTATION':
      return {
        ...state,
        uiMutation: action.payload,
        lamportClock: nextClock
      };
    case 'INCREMENT_CLOCK':
      return {
        ...state,
        lamportClock: nextClock
      };
    default:
      return state;
  }
}

/**
 * useOrchestrator Hook
 * Governs root orchestrator execution, integrating React 19 Concurrent Fiber scheduling
 * (via useDeferredValue) and formal state transitions.
 */
export function useOrchestrator(initialState: OrchestratorState = initialOrchestratorState) {
  // Pattern: State Management strictly enforced by Compendium logic
  const [state, dispatch] = useReducer(orchestratorReducer, initialState);

  // Fiber-level concurrency decoupling: prevent heavy sub-module transitions from blocking main thread input
  const deferredActiveModule = useDeferredValue(state.activeModule);

  const setActiveModule = useCallback((module: ModuleType) => {
    dispatch({ type: 'SET_MODULE', payload: module });
  }, []);

  const setPendingChatInput = useCallback((input: { content: string; immediate?: boolean } | null) => {
    dispatch({ type: 'SET_PENDING_CHAT', payload: input });
  }, []);

  const injectIntoChat = useCallback((content: string, immediate = false) => {
    dispatch({ type: 'SET_PENDING_CHAT', payload: { content, immediate } });
    dispatch({ type: 'SET_MODULE', payload: 'chat' });
  }, []);

  const toggleInternet = useCallback(() => {
    dispatch({ type: 'TOGGLE_INTERNET' });
  }, []);

  const setDevMode = useCallback((enabled: boolean) => {
    dispatch({ type: 'SET_DEV_MODE', payload: enabled });
  }, []);

  const switchAccountEmail = useCallback((email: string) => {
    dispatch({ type: 'SWITCH_ACCOUNT_EMAIL', payload: email });
  }, []);

  const setUiMutation = useCallback((mutation: { css: string; htmlPatch?: string }) => {
    dispatch({ type: 'SET_UI_MUTATION', payload: mutation });
  }, []);

  return {
    state,
    dispatch,
    deferredActiveModule,
    setActiveModule,
    setPendingChatInput,
    injectIntoChat,
    toggleInternet,
    setDevMode,
    switchAccountEmail,
    setUiMutation
  };
}
