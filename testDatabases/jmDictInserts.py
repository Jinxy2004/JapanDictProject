
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

def insertStagk(sense, lastRow,cursor):
    query = ('''INSERT INTO stagk (kanjis_restricted_to,senses_id)
             VALUES(?,?)''')
    for entry in sense:
        stagk_values = entry.get("stagk",[])
        for stagk in stagk_values:
            cursor.execute(query,[stagk,lastRow])

def insertStagr(sense,lastRow,cursor):
    query = ('''INSERT INTO stagr (readings_restricted_to,senses_id)
             VALUES(?,?)''')
    for entry in sense:
        stagr_values = entry.get("stagr",[])
        for stagr in stagr_values:
            cursor.execute(query,[stagr,lastRow])

def insertPOS(sense,lastRow,cursor):
    query = ('''INSERT INTO parts_of_speech(pos_info,senses_id)
             VALUES(?,?)''')
    for entry in sense:
        pos_values = entry.get("pos",[])
        for pos in pos_values:
            cursor.execute(query,[pos,lastRow])

def insertCrossReferences(sense,lastRow,cursor):
    query = ('''INSERT INTO cross_references(cross_reference,senses_id)
             VALUES(?,?)''')
    for entry in sense:
        c_values = entry.get("xref")
        for cross in c_values:
            cursor.execute(query,[cross,lastRow])

def insertAntonyms(sense,lastRow,cursor):
    query = ('''INSERT INTO antonyms(ant_reference,senses_id)
             VALUES(?,?)''')
    for entry in sense:
        ant_values = entry.get("ant")
        for ant in ant_values:
            cursor.execute(query,[ant,lastRow])

def insertField(sense,lastRow,cursor):
    query = ('''INSERT INTO field(field_info,senses_id)
             VALUES(?,?)''')
    for entry in sense:
        field_values = entry.get("field")
        for field in field_values:
            cursor.execute(query,[field,lastRow])

def insertMisc(sense,lastRow,cursor):
    query = ('''INSERT INTO misc(misc_info,senses_id)
             VALUES(?,?)''')
    for entry in sense:
        misc_values = entry.get("misc")
        for misc in misc_values:
            cursor.execute(query,[misc,lastRow])

def insertSenseInfo(sense,lastRow,cursor):
    query = ('''INSERT INTO sense_info(extra_info,senses_id)
             VALUES(?,?)''')
    for entry in sense:
        sense_info_values = entry.get("s_inf")
        for sense_info in sense_info_values:
            cursor.execute(query,[sense_info,lastRow])

def insertLoanwordSource(sense,lastRow,cursor):
    query = ('''INSERT INTO loanword_source(l_source,senses_id)
             VALUES(?,?)''')
    for entry in sense:
        loanword_source_values = entry.get("lsource")
        for loanword_source in loanword_source_values:
            cursor.execute(query,[loanword_source,lastRow])

def insertDialect(sense, lastRow, cursor):
    query = ('''INSERT INTO dialect(dialect_info,senses_id)
             VALUES(?,?)''')
    for entry in sense:
        dialect_values = entry.get("dialect")
        for dialect in dialect_values:
            cursor.execute(query,[dialect,lastRow])

def insertGloss(sense,lastRow,cursor):
    query = ('''INSERT INTO gloss(word_info,senses_id)
             VALUES(?,?)''')
    for entry in sense:
        gloss_values = entry.get("gloss")
        for gloss in gloss_values:
            cursor.execute(query,[gloss,lastRow])

