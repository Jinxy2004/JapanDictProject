__author__ = 'admin'

import sqlite3
import time

# Insert path to database/kanji xml file here
conn = sqlite3.connect('testDatabases/test_total.db')
cursor = conn.cursor()

import xml.etree.ElementTree as eTree

tree = eTree.parse('testDatabases/JMdict_e.xml')
root = tree.getroot()

i = 0

start = time.time()
for ent in root.findall('entry'):
    
    # Initialization variables
    ent_seq = 0
    kanji_elements = []
    reading_elements = []

    
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

    #

    #'''
    # Test Statements
    print("Ent seq: ", ent_seq)
    print("Kanji Elements: ", kanji_elements)
    print("Reading Elements: ", reading_elements)
    print("----------------------")
    #'''
    i += 1
    if(i == 25):
        break

