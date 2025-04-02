
export interface OpenverseMedia {
  id: string;
  title: string;
  creator: string;
  creator_url: string;
  url: string;
  foreign_landing_url: string;
  license: string;
  license_version: string;
  license_url: string;
  provider: string;
  source: string;
  thumbnail: string;
  filesize?: number;
  filetype?: string;
  detail_url: string;
  related_url: string;
  fields_matched?: string[];
  tags?: Array<{name: string}>;
  description?: string;
  date_created?: string;
  category?: string;
}

export interface OpenverseImageMedia extends OpenverseMedia {
  height: number;
  width: number;
  alt_text?: string;
}

export interface OpenverseAudioMedia extends OpenverseMedia {
  audio_set?: string;
  duration?: number;
  bit_rate?: number;
  sample_rate?: number;
  genres?: string[];
  waveform?: string;
  audio_url?: string;
}

export interface OpenverseVideoMedia extends OpenverseMedia {
  duration?: number;
  bit_rate?: number;
  frame_rate?: number;
  height?: number;
  width?: number;
  video_codec?: string;
  video_thumbnail?: string;
  video_url?: string;
}

export type MediaType = 'image' | 'audio' | 'video' | 'all';

export interface SearchFilters {
  license?: string;
  license_type?: string;
  creator?: string;
  tags?: string[];
  source?: string;
  category?: string;
  size?: string;
  extension?: string;
  aspect_ratio?: string;
}

export interface SearchParams {
  q: string;
  page?: number;
  page_size?: number;
  filter_dead?: boolean;
  source?: string;
  category?: string;
}

export interface SearchResponse {
  result_count: number;
  page_count: number;
  page_size: number;
  page: number;
  results: OpenverseMedia[];
}
