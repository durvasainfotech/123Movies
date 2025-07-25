export interface MediaBase {
  id: number;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  original_language: string;
  genre_ids: number[];
  media_type?: 'movie' | 'tv';
}

export interface Movie extends MediaBase {
  title: string;
  release_date?: string;
  original_title?: string;
  video?: boolean;
  adult?: boolean;
}

export interface TVShow extends MediaBase {
  name: string;
  first_air_date?: string;
  original_name?: string;
  origin_country?: string[];
}

export type MediaItem = Movie | TVShow;

export interface MediaListResponse<T = MediaItem> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export type MovieListResponse = MediaListResponse<Movie>;
export type TVShowListResponse = MediaListResponse<TVShow>;

export interface Genre {
  id: number;
  name: string;
}

export interface TVShowDetails extends Omit<TVShow, 'genre_ids'> {
  created_by: {
    id: number;
    credit_id: string;
    name: string;
    gender: number;
    profile_path: string | null;
  }[];
  episode_run_time: number[];
  genres: Genre[];
  homepage: string;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: {
    id: number;
    name: string;
    overview: string;
    vote_average: number;
    vote_count: number;
    air_date: string;
    episode_number: number;
    episode_type: string;
    production_code: string;
    runtime: number | null;
    season_number: number;
    show_id: number;
    still_path: string | null;
  } | null;
  next_episode_to_air: null;
  networks: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  seasons: {
    air_date: string | null;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    season_number: number;
    vote_average: number;
  }[];
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string;
  type: string;
  videos?: {
    results: Video[];
  };
  credits?: {
    cast: Credit[];
    crew: Credit[];
  };
  images?: {
    backdrops: Image[];
    posters: Image[];
    logos: Image[];
  };
  reviews?: {
    results: Review[];
  };
  similar?: {
    results: TVShow[];
  };
  recommendations?: {
    results: TVShow[];
  };
}

export interface MovieDetails extends Omit<Movie, 'genre_ids'> {
  belongs_to_collection: null | {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  };
  budget: number;
  genres: Genre[];
  homepage: string;
  imdb_id: string;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  revenue: number;
  runtime: number | null;
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string;
  videos?: {
    results: Video[];
  };
  credits?: {
    cast: Credit[];
    crew: Credit[];
  };
  images?: {
    backdrops: Image[];
    posters: Image[];
  };
  reviews?: {
    results: Review[];
  };
  similar?: {
    results: Movie[];
  };
  recommendations?: {
    results: Movie[];
  };
}

export interface Credit {
  id: number;
  name: string;
  profile_path: string | null;
  character?: string;
  job?: string;
  known_for_department?: string;
  department?: string;
  gender?: number;
  credit_id?: string;
  original_name?: string;
  popularity?: number;
  cast_id?: number;
  order?: number;
}

export interface CreditsResponse {
  id: number;
  cast: Credit[];
  crew: Credit[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
}

export interface MovieVideosResponse {
  id: number;
  results: Video[];
}

export interface MovieCreditsResponse {
  id: number;
  cast: Credit[];
  crew: Credit[];
}

export interface Review {
  id: string;
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number | null;
  };
  content: string;
  created_at: string;
  updated_at: string;
  url: string;
}

export interface MovieReviewsResponse {
  id: number;
  page: number;
  results: Review[];
  total_pages: number;
  total_results: number;
}

export interface Image {
  aspect_ratio: number;
  file_path: string;
  height: number;
  iso_639_1: string | null;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface MovieImagesResponse {
  id: number;
  backdrops: Image[];
  posters: Image[];
  logos: Image[];
}

export interface MovieDetails extends Movie {
  belongs_to_collection: null | {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  };
  budget: number;
  genres: Genre[];
  homepage: string;
  imdb_id: string;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  revenue: number;
  runtime: number | null;
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string;
  videos?: {
    results: Video[];
  };
  credits?: {
    cast: Credit[];
    crew: Credit[];
  };
  images?: {
    backdrops: Image[];
    posters: Image[];
  };
  reviews?: {
    results: Review[];
  };
  similar?: {
    results: Movie[];
  };
  recommendations?: {
    results: Movie[];
  };
}

export interface SearchParams {
  query: string;
  page?: number;
}

export interface DiscoverParams {
  page?: number;
  sort_by?: string;
  with_genres?: string;
  primary_release_year?: number;
  first_air_date_year?: number;
  with_watch_providers?: string;
  watch_region?: string;
  with_watch_monetization_types?: string;
}
