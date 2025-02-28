
# query = ('''INSERT INTO''')
# Data functions
def insertEntry(entry,cursor):
    ent_seq = [entry]
    query = ('''INSERT INTO entries (ent_seq)
             VALUES(?)''')   
    cursor.execute(query,ent_seq)
    return cursor.lastrowid

def insertSense(lastRow,cursor):
    sense_query = ('''INSERT INTO senses (entries_id)
                   VALUES(?)''')
    cursor.execute(sense_query,[lastRow])
    return cursor.lastrowid

def insertAllSenses(sense,lastRow,cursor):
    insertStagk(sense,lastRow,cursor)
    insertStagr(sense,lastRow,cursor)
    insertPOS(sense,lastRow,cursor)
    insertCrossReferences(sense,lastRow,cursor)
    insertAntonyms(sense,lastRow,cursor)
    insertField(sense,lastRow,cursor)
    insertMisc(sense,lastRow,cursor)
    insertSenseInfo(sense,lastRow,cursor)
    insertLoanwordSource(sense,lastRow,cursor)
    insertDialect(sense,lastRow,cursor)
    insertGloss(sense,lastRow,cursor)

# All of these take in a dictionary and for each value in the key 
# it inserts it into it's respective table

# Sense inserts

def insertStagk(sense, lastRow,cursor):
    query = ('''INSERT INTO stagk (kanjis_restricted_to,senses_id)
             VALUES(?,?)''')
    stagk_values = sense.get("stagk",[])
    for stagk in stagk_values:
        cursor.execute(query,[stagk,lastRow])

def insertStagr(sense,lastRow,cursor):
    query = ('''INSERT INTO stagr (readings_restricted_to,senses_id)
             VALUES(?,?)''')
    stagr_values = sense.get("stagr",[])
    for stagr in stagr_values:
        cursor.execute(query,[stagr,lastRow])

def insertPOS(sense,lastRow,cursor):
    query = ('''INSERT INTO parts_of_speech(pos_info,senses_id)
             VALUES(?,?)''')
    pos_values = sense.get("pos",[])
    for pos in pos_values:
        cursor.execute(query,[pos,lastRow])

def insertCrossReferences(sense,lastRow,cursor):
    query = ('''INSERT INTO cross_references(cross_reference,senses_id)
             VALUES(?,?)''')
    c_values = sense.get("xref")
    for cross in c_values:
        cursor.execute(query,[cross,lastRow])

def insertAntonyms(sense,lastRow,cursor):
    query = ('''INSERT INTO antonyms(ant_reference,senses_id)
             VALUES(?,?)''')
    ant_values = sense.get("ant")
    for ant in ant_values:
        cursor.execute(query,[ant,lastRow])

def insertField(sense,lastRow,cursor):
    query = ('''INSERT INTO field(field_info,senses_id)
             VALUES(?,?)''')
    field_values = sense.get("field")
    for field in field_values:
        cursor.execute(query,[field,lastRow])

def insertMisc(sense,lastRow,cursor):
    query = ('''INSERT INTO misc(misc_info,senses_id)
             VALUES(?,?)''')
    misc_values = sense.get("misc")
    for misc in misc_values:
        cursor.execute(query,[misc,lastRow])

def insertSenseInfo(sense,lastRow,cursor):
    query = ('''INSERT INTO sense_info(extra_info,senses_id)
             VALUES(?,?)''')
    sense_info_values = sense.get("s_inf")
    for sense_info in sense_info_values:
        cursor.execute(query,[sense_info,lastRow])

def insertLoanwordSource(sense,lastRow,cursor):
    query = ('''INSERT INTO loanword_source(l_source,senses_id)
             VALUES(?,?)''')
    loanword_source_values = sense.get("lsource")
    for loanword_source in loanword_source_values:
        cursor.execute(query,[loanword_source,lastRow])

def insertDialect(sense, lastRow, cursor):
    query = ('''INSERT INTO dialect(dialect_info,senses_id)
             VALUES(?,?)''')
    dialect_values = sense.get("dialect")
    for dialect in dialect_values:
        cursor.execute(query,[dialect,lastRow])

def insertGloss(sense,lastRow,cursor):
    query = ('''INSERT INTO gloss(word_info,senses_id)
             VALUES(?,?)''')
    gloss_values = sense.get("gloss")
    for gloss in gloss_values:
        cursor.execute(query,[gloss,lastRow])
        
# Kanji element inserts

def insertAllKan(k_element,lastRow,cursor):
    insertKanjiInfo(k_element,lastRow,cursor)
    insertKanjiPri(k_element,lastRow,cursor)

def insertKanjiElement(ent_seq,k_element,cursor):
    query = ('''INSERT INTO kanji_elements(keb_element,entries_id)
             VALUES(?,?)''')
    insert_value = k_element.get("keb")
    cursor.execute(query,[insert_value,ent_seq])
    return cursor.lastrowid
    
def insertKanjiInfo(k_element,lastRow,cursor):
    query = ('''INSERT INTO kanji_info(k_info,kanji_elements_id)
             VALUES(?,?)''')
    info_values = k_element.get("ke_inf")
    for info in info_values:
        cursor.execute(query,[info,lastRow])

def insertKanjiPri(k_element,lastRow,cursor):
    query = ('''INSERT INTO kanji_priority(k_priority_info,kanji_elements_id)
             VALUES(?,?)''')
    pri_values = k_element.get("ke_pri")
    for pri in pri_values:
        cursor.execute(query,[pri,lastRow])

# Reading Elements

def insertAllReadingEle(r_element,lastRow,cursor):
    insertRestrictedReadings(r_element,lastRow,cursor)
    insertReadingsInfo(r_element,lastRow,cursor)
    insertReadingPri(r_element,lastRow,cursor)
    
def insertReadingElement(r_element,lastRow,cursor):
    query = ('''INSERT INTO reading_elements(word_reading,no_kanji,entries_id)
             VALUES(?,?,?)''')
    w_reading = r_element.get("reb")
    no_k = r_element.get("no_kanji")
    cursor.execute(query,[w_reading,no_k,lastRow])
    return cursor.lastrowid

def insertRestrictedReadings(r_element,lastRow,cursor):
    query = ('''INSERT INTO readings_restricted(restricted_reading,reading_elements_id)
             VALUES(?,?)''')
    restricted_values = r_element.get("restricted_readings")
    for restrict in restricted_values:
        cursor.execute(query,[restrict,lastRow])
        
def insertReadingsInfo(r_element,lastRow,cursor):
    query = ('''INSERT INTO readings_info(specific_info,reading_elements_id)
             VALUES(?,?)''')
    reading_values = r_element.get("r_inf")
    for reading in reading_values:
        cursor.execute(query,[reading,lastRow])
        
def insertReadingPri(r_element,lastRow,cursor):
    query = ('''INSERT INTO readings_priority(re_priority_Info,reading_elements_id)
             VALUES(?,?)''')
    pri_values = r_element.get("r_pri")
    for pri in pri_values:
        cursor.execute(query,[pri,lastRow])
    
    
