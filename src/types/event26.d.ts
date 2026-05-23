export interface EventRecord {
  event_id: string | null;
  source_url: string | null;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  venue: string | null;
  address: string | null;
  region: string | null;
  category: string | null;
  tags: string[];
  image_url: string | null;
  raw_html_path: string | null;
  fetched_at: string | null;
}
