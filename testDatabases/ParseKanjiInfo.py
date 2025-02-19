__author__ = 'admin'

import sqlite3
import time

# Insert path to database/kanji xml file here
conn = sqlite3.connect('testDatabases/test_total.db')
cursor = conn.cursor()

import xml.etree.ElementTree as eTree

tree = eTree.parse('testDatabases/kanjidic2.xml')
root = tree.getroot()

# Inserts data into kanji table
def add_kanji(values):
    query = ('''INSERT INTO kanji (k_literal,unicode_value,radical_num,grade_learned,stroke_count,app_frequency,rad_name,JLPT_level,on_reading,kun_reading,meaning,nanori)
                   VALUES(?,?,?,?,?,?,?,?,?,?,?,?)''')
    
    
    cursor.execute(query,values)
    return cursor.lastrowid

# Inserts data into dict references
def add_dict_ref(dict_values,last_row_id):
    insert_values = (dict_values[0],dict_values[1],last_row_id)
    query = ('''INSERT INTO dict_references (dic_type,dic_value,kanji_id)
             VALUES(?,?,?)''')
    
    cursor.execute(query,insert_values)

# Inserts kanji variants
def add_kanji_variants(variant_values,last_row_id):
    insert_values = (variant_values[0],variant_values[1],last_row_id)
    query = ('''INSERT INTO kanji_variants (variant_type,variant_code,kanji_id)
             VALUES(?,?,?)''')
    
    cursor.execute(query,insert_values)




start = time.time()
# Loops through every character element
for k in root.findall("character"):

    # Initialization variables for insert into DB
    k_literal = ""
    uni_value = ""
    rad_num = ""
    grade_learned = ""
    stroke_count = ""
    app_frequency = ""
    rad_name = ""
    JLPT_level = ""
    kanji_variants = []
    dict_values = []
    on_reading = "" 
    kun_reading = "" 
    meaning = ""
    nanori = ""

    # Kanji literal
    k_literal = k.find("literal").text

    # Finds unicode value 
    for cp_val in k.find("codepoint"):
        if(cp_val.get('cp_type') == "ucs"):
            uni_value = cp_val.text
    
    # Finds radical number
    for rad_val in k.find("radical"):
        if(rad_val.get('rad_type') == "classical"):
            rad_num = rad_val.text

    # Handles MISC element tree
    for val in k.find("misc"):
        if(val.tag == 'grade'):
            grade_learned = val.text
        elif(val.tag == 'stroke_count'):
            stroke_count = val.text
        elif(val.tag == 'freq'):
            app_frequency = val.text
        elif(val.tag == 'jlpt'):
            JLPT_level = val.text
        elif(val.tag == 'rad_name'):
            rad_name = val.text + " | " + rad_name
        elif(val.tag == 'variant'):
            var_type = val.get("var_type")
            var_code = val.text
            kanji_variants.append((var_type,var_code))
    
    # Handles Dict References
    try:
        for val in k.find("dic_number"):
            dic_type = val.get("dr_type")
            dic_value = val.text
            dict_values.append((dic_type,dic_value))
    except: 
        continue

    # Handles readings/meanings and nanori
    try:
        for val in k.find("reading_meaning"):
            for rm_val in val:
                if(rm_val.get('r_type') == 'ja_on'):
                    on_reading = on_reading.__add__(rm_val.text) + ', '
                elif(rm_val.get('r_type') == 'ja_kun'):
                    kun_reading = kun_reading.__add__(rm_val.text) + ', '
                elif (rm_val.get('m_lang') is None and rm_val.tag == 'meaning'):
                    meaning = meaning.__add__(rm_val.text) + ', '
            on_reading = on_reading.rstrip(', ')
            kun_reading = kun_reading.rstrip(', ')
            meaning = meaning.rstrip(', ')
            if(val.tag == 'nanori'):
                nanori = nanori.__add__(val.text) + ', '
        nanori = nanori.rstrip(', ')
    except:
        continue
            
    # Adding Values
    
    values = (k_literal,uni_value,rad_num,grade_learned,stroke_count,app_frequency,rad_name,JLPT_level,on_reading,kun_reading,meaning,nanori)
    last_row_id = add_kanji(values)
    
    for value in dict_values:
        add_dict_ref(value,last_row_id)
    for value in kanji_variants:
        add_kanji_variants(value,last_row_id)
    

    # Testing
    '''
    print("Kanji Literal: ",k_literal)
    print("Unicode Value: ",uni_value)
    print("Radical Num: ",rad_num)
    print("Grade learned: ",grade_learned)
    print("Stroke count: ",stroke_count)
    print("App freq: ",app_frequency)
    print("Radical name: ",rad_name)
    print("JLPT level: ",JLPT_level)
    print("Kanji variants: ",kanji_variants)
    print("Dict values: ",dict_values)
    print("Onyomi reading: ",on_reading)
    print("Kunyomi reading: ",kun_reading)
    print("Meaning: ",meaning)
    print("Nanori: ", nanori)
    print("-----------------------")
    '''
conn.commit()  
cursor.close()  
conn.close()   
end = time.time()
print("Time taken: ",(end-start) * 10**3, "ms")   


   
    