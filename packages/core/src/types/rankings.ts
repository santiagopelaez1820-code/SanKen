export type RankingScope =
  | 'global'
  | 'city'
  | 'country'
  | 'gym'
  | 'age_bracket'
  | 'sex'
  | 'strength_category';

export interface RankingEntry {
  rank: number;
  user_id: number;
  user_name: string;
  metric_value: number;
  is_viewer: boolean;
}

export interface RankingResponse {
  scope: RankingScope;
  scope_label: string | null;
  entries: RankingEntry[];
  viewer: RankingEntry | null;
}
