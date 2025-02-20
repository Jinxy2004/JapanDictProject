__author__ = 'admin'


import time
import jmDictInserts as ins
import sqlite3


import xml.etree.ElementTree as eTree

tree = eTree.parse('testDatabases/JMdict_e.xml')
root = tree.getroot()

conn = sqlite3.connect('testDatabases/test_total.db')
cursor = conn.cursor()

i = 0
start = time.time()
for ent in root.findall('entry'):
    
    # Initialization variables
    ent_seq = 0
    kanji_elements = []
    reading_elements = []
    sense_elements = []
    
    # Getting ID for each entry
    ent_seq = ent.find('ent_seq').text

    # Both reading elements and kanji elements are found by,
    # looping through every element in an entry and inserting it into
    # a dictionary and then appending it to a total list for each entry

    # Getting Kanji element and related info
    for k_ele in ent.findall('k_ele'):
        ke_pri_list = []
        ke_inf_list = []
        keb_text = k_ele.find('keb').text
        for val in k_ele.findall('ke_inf'):
            ke_inf_list.append(val.text)
        for val in k_ele.findall('ke_pri'):
            ke_pri_list.append(val.text)
        
        kanji_entry = {
            "keb": keb_text,
            "ke_inf": ke_inf_list,
            "ke_pri": ke_pri_list
        }
        kanji_elements.append(kanji_entry)
    
    # Getting Reading elements and related info
    
    for r_ele in ent.findall('r_ele'):
        reb_text = r_ele.find('reb').text
        r_inf_list = []
        r_pri_list = []
        restricted_readings = []
        if r_ele.find('re_nokanji') is not None:
            no_kanji = 1
        else:
            no_kanji = 0
        for val in r_ele.findall('re_inf'):
            r_inf_list.append(val.text)
        for val in r_ele.findall('re_pri'):
            r_pri_list.append(val.text)
        for val in r_ele.findall('re_restr'):
            restricted_readings.append(val.text)
        
        reading_entry = {
            "reb": reb_text,
            "restricted_readings": restricted_readings,
            "no_kanji": no_kanji,
            "r_inf": r_inf_list,
            "r_pri": r_pri_list
        }
        reading_elements.append(reading_entry)

    # Senses - works same as kanji/reading variables
    for sense in ent.findall('sense'):
        sense_info = []
        dialects = []
        stagk = []
        gloss = []
        stagr = []
        antonyms = []
        part_of_speech = []
        field = []
        cross_references = []
        misc = []
        loanword_source = []
        for val in sense.findall('stagk'):
            stagk.append(val.text)
        for val in sense.findall('stagr'):
            stagr.append(val.text)
        for val in sense.findall('pos'):
            part_of_speech.append(val.text)
        for val in sense.findall('xref'):
            cross_references.append(val.text)
        for val in sense.findall('ant'):
            antonyms.append(val.text)
        for val in sense.findall('field'):
            field.append(val.text)
        for val in sense.findall('misc'):
            misc.append(val.text)
        for val in sense.findall('s_inf'):
            sense_info.append(val.text)
        for val in sense.findall('lsource'):
            loanword_source.append(val.text)
        for val in sense.findall('dial'):
            dialects.append(val.text)
        for val in sense.findall('gloss'):
            gloss.append(val.text)

        sense_entry = {
            "stagk": stagk,
            "stagr": stagr,
            "pos": part_of_speech,
            "xref": cross_references,
            "ant": antonyms,
            "field": field,
            "misc": misc,
            "s_inf": sense_info,
            "lsource": loanword_source,
            "dialect": dialects,
            "gloss": gloss
        }

        sense_elements.append(sense_entry)
    
    entLastRow = ins.insertEntry(ent_seq,cursor)
    for i in range(len(sense_elements)):
        lastRow = ins.insertSense(entLastRow,cursor)
    ins.insertStagk(sense_elements,lastRow,cursor)
    ins.insertStagr(sense_elements,lastRow,cursor)
    ins.insertPOS(sense_elements,lastRow,cursor)
    ins.insertCrossReferences(sense_elements,lastRow,cursor)
    ins.insertAntonyms(sense_elements,lastRow,cursor)
    ins.insertField(sense_elements,lastRow,cursor)
    ins.insertMisc(sense_elements,lastRow,cursor)
    ins.insertSenseInfo(sense_elements,lastRow,cursor)
    ins.insertLoanwordSource(sense_elements,lastRow,cursor)
    ins.insertDialect(sense_elements,lastRow,cursor)
    ins.insertGloss(sense_elements,lastRow,cursor)
    
    
    '''
    # Test Statements
    print("Ent seq: ", ent_seq)
    print("Kanji Elements: ", kanji_elements)
    print("Reading Elements: ", reading_elements)
    print("Sense: ", sense_elements)
    print("----------------------")
    '''
    #```
    i += 1
    if(i == 35):
        print("Loop broke: ",i)
        break
    #``

conn.commit()
cursor.close()
conn.close()
end = time.time()
print("Time taken: ",(end-start) * 10**3, "ms")   