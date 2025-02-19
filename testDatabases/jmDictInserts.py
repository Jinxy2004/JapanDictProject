
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
    query = ('''INSERT INTO stagk (readings_restricted_to,senses_id)
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

