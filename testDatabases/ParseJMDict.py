__author__ = 'admin'

import sqlite3
import time

# Insert path to database/kanji xml file here
conn = sqlite3.connect('testDatabases/test_total.db')
cursor = conn.cursor()

from lxml import etree as eTree

parser = eTree.XMLParser(resolve_entities=False)
tree = eTree.parse("testDatabases/JMdict_e.xml", parser)
root = tree.getroot()

i = 0

start = time.time()
for ent in root.findall('entry'):
    
    # Initialization variables
    ent_seq = 0
    keb_element = []

    # Getting ID for each entry
    ent_seq = ent.find('ent_seq').text

    # Getting Kanji element and related info
    #for k_ele in ent.findall('k_ele'):
        
        #keb_element.append(k_ele.text)
        


    # Test Statements
    print("Ent seq: ", ent_seq)
    print("Keb elemnts: ", keb_element)

    i += 1
    if(i == 10):
        break

