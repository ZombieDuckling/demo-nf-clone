-- Search vector trigger
CREATE OR REPLACE FUNCTION update_content_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.tagline, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS content_search_vector_update ON content;
CREATE TRIGGER content_search_vector_update
  BEFORE INSERT OR UPDATE ON content
  FOR EACH ROW EXECUTE FUNCTION update_content_search_vector();

-- GIN index on search_vector
CREATE INDEX IF NOT EXISTS content_search_vector_idx ON content USING GIN(search_vector);

-- Watch history indexes
CREATE INDEX IF NOT EXISTS watch_history_profile_date_idx ON watch_history(profile_id, last_watched_at DESC);

-- My list unique index (already in schema but ensure)
CREATE UNIQUE INDEX IF NOT EXISTS my_list_profile_content_idx ON my_list(profile_id, content_id);
