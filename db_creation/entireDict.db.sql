BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "antonyms" (
	"id"	INTEGER NOT NULL,
	"ant_reference"	TEXT,
	"senses_id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("senses_id") REFERENCES "senses"("id")
);
CREATE TABLE IF NOT EXISTS "cross_references" (
	"id"	INTEGER NOT NULL,
	"cross_reference"	TEXT,
	"senses_id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("senses_id") REFERENCES "senses"("id")
);
CREATE TABLE IF NOT EXISTS "dialect" (
	"id"	INTEGER NOT NULL,
	"dialect_info"	TEXT,
	"senses_id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("senses_id") REFERENCES "senses"("id")
);
CREATE TABLE IF NOT EXISTS "dict_references" (
	"id"	INTEGER NOT NULL,
	"dic_type"	TEXT,
	"dic_value"	TEXT,
	"kanji_id"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("kanji_id") REFERENCES "kanji"("id")
);
CREATE TABLE IF NOT EXISTS "entries" (
	"ent_seq"	INTEGER NOT NULL,
	PRIMARY KEY("ent_seq")
);
CREATE TABLE IF NOT EXISTS "field" (
	"id"	INTEGER NOT NULL,
	"field_info"	TEXT,
	"senses_id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("senses_id") REFERENCES "senses"("id")
);
CREATE TABLE IF NOT EXISTS "gloss" (
	"id"	INTEGER NOT NULL,
	"word_info"	TEXT,
	"senses_id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("senses_id") REFERENCES "senses"("id")
);
CREATE TABLE IF NOT EXISTSAL TABLE gloss_fts USING fts5(
  word_info, 
  senses_id, 
  content='gloss',
  content_rowid='id',
  tokenize='porter'
);
CREATE TABLE IF NOT EXISTS "gloss_fts_config" (
	"k"	,
	"v"	,
	PRIMARY KEY("k")
) WITHOUT ROWID;
CREATE TABLE IF NOT EXISTS "gloss_fts_data" (
	"id"	INTEGER,
	"block"	BLOB,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "gloss_fts_docsize" (
	"id"	INTEGER,
	"sz"	BLOB,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "gloss_fts_idx" (
	"segid"	,
	"term"	,
	"pgno"	,
	PRIMARY KEY("segid","term")
) WITHOUT ROWID;
CREATE TABLE IF NOT EXISTS "jlpt_levels" (
	"id"	INTEGER NOT NULL,
	"jlpt_level"	TEXT NOT NULL,
	"senses_id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("senses_id") REFERENCES "senses"("id")
);
CREATE TABLE IF NOT EXISTS "jlptn4" (
	"field1"	TEXT
);
CREATE TABLE IF NOT EXISTS "kanji" (
	"id"	INTEGER NOT NULL,
	"k_literal"	TEXT,
	"unicode_value"	TEXT,
	"radical_num"	TEXT,
	"grade_learned"	TEXT,
	"stroke_count"	TEXT,
	"app_frequency"	TEXT,
	"rad_name"	TEXT,
	"JLPT_level"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "kanji_elements" (
	"id"	INTEGER NOT NULL,
	"keb_element"	TEXT,
	"entries_id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("entries_id") REFERENCES "entries"("ent_seq")
);
CREATE TABLE IF NOT EXISTS "kanji_info" (
	"id"	INTEGER NOT NULL,
	"k_info"	TEXT NOT NULL,
	"kanji_elements_id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("kanji_elements_id") REFERENCES "kanji_elements"("id")
);
CREATE TABLE IF NOT EXISTS "kanji_kun_readings" (
	"id"	INTEGER NOT NULL,
	"kun_reading"	TEXT,
	"kanji_id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("kanji_id") REFERENCES "kanji"("id")
);
CREATE TABLE IF NOT EXISTS "kanji_meanings" (
	"id"	INTEGER NOT NULL,
	"meaning"	TEXT,
	"kanji_id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("kanji_id") REFERENCES "kanji"("id")
);
CREATE TABLE IF NOT EXISTS "kanji_nanori" (
	"id"	INTEGER NOT NULL,
	"nanori_reading"	TEXT,
	"kanji_id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("kanji_id") REFERENCES "kanji"("id")
);
CREATE TABLE IF NOT EXISTS "kanji_on_readings" (
	"id"	INTEGER NOT NULL,
	"on_reading"	TEXT,
	"kanji_id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("kanji_id") REFERENCES "kanji"("id")
);
CREATE TABLE IF NOT EXISTS "kanji_priority" (
	"id"	INTEGER NOT NULL,
	"k_priority_info"	TEXT,
	"kanji_elements_id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("kanji_elements_id") REFERENCES "kanji_elements"("id")
);
CREATE TABLE IF NOT EXISTS "kanji_variants" (
	"id"	INTEGER NOT NULL,
	"variant_type"	TEXT,
	"variant_code"	TEXT,
	"kanji_id"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("kanji_id") REFERENCES "kanji"("id")
);
CREATE TABLE IF NOT EXISTS "loanword_source" (
	"id"	INTEGER NOT NULL,
	"l_source"	TEXT,
	"senses_id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("senses_id") REFERENCES "senses"("id")
);
CREATE TABLE IF NOT EXISTS "misc" (
	"id"	INTEGER NOT NULL,
	"misc_info"	TEXT,
	"senses_id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("senses_id") REFERENCES "senses"("id")
);
CREATE TABLE IF NOT EXISTS "parts_of_speech" (
	"id"	INTEGER NOT NULL,
	"pos_info"	TEXT,
	"senses_id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("senses_id") REFERENCES "senses"("id")
);
CREATE TABLE IF NOT EXISTS "reading_elements" (
	"id"	INTEGER NOT NULL,
	"word_reading"	TEXT,
	"no_kanji"	INTEGER,
	"entries_id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("entries_id") REFERENCES "entries"("ent_seq")
);
CREATE TABLE IF NOT EXISTS "readings_info" (
	"id"	INTEGER NOT NULL,
	"specific_info"	TEXT,
	"reading_elements_id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("reading_elements_id") REFERENCES "reading_elements"("id")
);
CREATE TABLE IF NOT EXISTS "readings_priority" (
	"id"	INTEGER NOT NULL,
	"re_priority_info"	TEXT,
	"reading_elements_id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("reading_elements_id") REFERENCES "reading_elements"("id")
);
CREATE TABLE IF NOT EXISTS "readings_restricted" (
	"id"	INTEGER NOT NULL,
	"restricted_reading"	TEXT,
	"reading_elements_id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("reading_elements_id") REFERENCES "reading_elements"("id")
);
CREATE TABLE IF NOT EXISTS "sense_info" (
	"id"	INTEGER NOT NULL,
	"extra_info"	TEXT,
	"senses_id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("senses_id") REFERENCES "senses"("id")
);
CREATE TABLE IF NOT EXISTS "senses" (
	"id"	INTEGER NOT NULL,
	"entries_id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("entries_id") REFERENCES "entries"("ent_seq")
);
CREATE TABLE IF NOT EXISTS "stagk" (
	"id"	INTEGER NOT NULL,
	"kanjis_restricted_to"	TEXT,
	"senses_id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("senses_id") REFERENCES "senses"("id")
);
CREATE TABLE IF NOT EXISTS "stagr" (
	"id"	INTEGER NOT NULL,
	"readings_restricted_to"	TEXT,
	"senses_id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("senses_id") REFERENCES "senses"("id")
);
CREATE TABLE IF NOT EXISTS "user_analyzed_text" (
	"id"	INTEGER NOT NULL,
	"text_analyzed"	TEXT NOT NULL,
	"date_searched"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "user_recent_kanji_searches" (
	"id"	INTEGER NOT NULL,
	"recent_search"	TEXT,
	"date_searched"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "user_recent_searches" (
	"id"	INTEGER NOT NULL,
	"recent_search"	TEXT NOT NULL,
	"date_searched"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE INDEX IF NOT EXISTS "idx_antonyms" ON "antonyms" (
	"senses_id"
);
CREATE INDEX IF NOT EXISTS "idx_cref" ON "cross_references" (
	"senses_id"
);
CREATE INDEX IF NOT EXISTS "idx_dialect" ON "dialect" (
	"senses_id"
);
CREATE INDEX IF NOT EXISTS "idx_field" ON "field" (
	"senses_id"
);
CREATE INDEX IF NOT EXISTS "idx_gloss" ON "gloss" (
	"senses_id"
);
CREATE INDEX IF NOT EXISTS "idx_kPri" ON "kanji_priority" (
	"kanji_elements_id"
);
CREATE INDEX IF NOT EXISTS "idx_kanjInfo" ON "kanji_info" (
	"kanji_elements_id"
);
CREATE INDEX IF NOT EXISTS "idx_kanji_elements_entries" ON "kanji_elements" (
	"entries_id"
);
CREATE INDEX IF NOT EXISTS "idx_kanji_elements_search" ON "kanji_elements" (
	"keb_element"
);
CREATE INDEX IF NOT EXISTS "idx_lsource" ON "loanword_source" (
	"senses_id"
);
CREATE INDEX IF NOT EXISTS "idx_misc" ON "misc" (
	"senses_id"
);
CREATE INDEX IF NOT EXISTS "idx_pos" ON "parts_of_speech" (
	"senses_id"
);
CREATE INDEX IF NOT EXISTS "idx_reInfo" ON "readings_info" (
	"reading_elements_id"
);
CREATE INDEX IF NOT EXISTS "idx_rePri" ON "readings_priority" (
	"reading_elements_id"
);
CREATE INDEX IF NOT EXISTS "idx_reReadings" ON "readings_restricted" (
	"reading_elements_id"
);
CREATE INDEX IF NOT EXISTS "idx_reading_elements_entries" ON "reading_elements" (
	"entries_id"
);
CREATE INDEX IF NOT EXISTS "idx_reading_elements_search" ON "reading_elements" (
	"word_reading"
);
CREATE INDEX IF NOT EXISTS "idx_sense_info" ON "sense_info" (
	"senses_id"
);
CREATE INDEX IF NOT EXISTS "idx_senses_entries" ON "senses" (
	"entries_id"
);
CREATE INDEX IF NOT EXISTS "idx_stagk" ON "stagk" (
	"senses_id"
);
CREATE INDEX IF NOT EXISTS "idx_stagr" ON "stagr" (
	"senses_id"
);
CREATE TRIGGER maintain_analyzed_history
AFTER INSERT ON user_analyzed_text
BEGIN
	DELETE FROM user_analyzed_text
	WHERE id NOT IN (
		SELECT id from user_analyzed_text
		ORDER BY datetime(date_searched) DESC
		LIMIT 50
		);
END;
CREATE TRIGGER maintain_search_history
AFTER INSERT ON user_recent_searches
BEGIN
	DELETE FROM user_recent_searches
	WHERE id NOT IN (
		SELECT id from user_recent_searches
		ORDER BY datetime(date_searched) DESC
		LIMIT 50
		);
END;
COMMIT;
