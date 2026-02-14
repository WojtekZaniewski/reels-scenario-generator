export interface Scenario {
  hook: string;
  mainContent: string[];
  cta: string;
  musicMood: string;
  filmingTips: string[];
  estimatedDuration: string;
}

export interface ScenarioResponse {
  scenario: Scenario;
  patterns: string[];
}
