export interface Media {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: 'movie' | 'tv';
  genre_ids: number[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetails extends Media {
  title: string;
  runtime: number;
  release_date: string;
  genres: Genre[];
  videos: {
    results: Video[];
  };
  credits: {
    cast: Cast[];
    crew: Crew[];
  };
}

export interface TvDetails extends Media {
  name: string;
  first_air_date: string;
  episode_run_time: number[];
  number_of_seasons: number;
  number_of_episodes: number;
  genres: Genre[];
  videos: {
    results: Video[];
  };
  credits: {
    cast: Cast[];
    crew: Crew[];
  };
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}