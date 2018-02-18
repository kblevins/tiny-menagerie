import pandas as pd
import json

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, inspect, func

#################################################
# Database Setup
#################################################

engine = create_engine("sqlite:///data/belly_button_biodiversity.sqlite", echo=False)
inspector = inspect(engine)

# Reflect Database into ORM class
Base = automap_base()
Base.prepare(engine, reflect=True)
OTU = Base.classes.otu
Samples = Base.classes.samples
Meta = Base.classes.samples_metadata

def sample_list():
    columns = inspector.get_columns('samples')
    sample_ids = []
    for c in columns:
        sample_ids.append(c['name'])
    sample_ids = sample_ids[1:]
    return sample_ids

sample_ids = sample_list()
sample_ids[0:10]

session = Session(engine)


# create a list of otu descriptions
def otu_list():
    results = session.query(OTU.lowest_taxonomic_unit_found).all()
    return results

otus = otu_list()
otus[0:5]

def return_metadata(sample):

    sample = sample.replace("BB_", "")
    sample = int(sample)
    met = session.query(Meta.AGE, Meta.BBTYPE, Meta.ETHNICITY, Meta.GENDER,                             Meta.LOCATION, Meta.SAMPLEID).filter(Meta.SAMPLEID == sample).all()
    cols = ('AGE', 'BBTYPE', 'ETHNICITY', 'GENDER', 'LOCATION', 'SAMPLEID')
    samp_dict = {}
    for i in range(0,len(met[0])):
        samp_dict[cols[i]] = met[0][i]
    
    return json.dumps(samp_dict)

return_metadata("BB_940")

def return_metadata(sample):

    sample = sample.replace("BB_", "")
    sample = int(sample)
    wash = session.query(Meta.WFREQ).filter(Meta.SAMPLEID == sample).all()
   
    return wash[0][0]

def otu_df(sample):
    col = f'Samples.{sample}'
    zoo = session.query(Samples.otu_id, col).all()
    zoo_df = pd.DataFrame(zoo)
    zoo_df.columns = ['otu_id', 'sample_value']
    zoo_df = zoo_df.sort_values('sample_value', ascending = False)
    return zoo_df

otu_df("BB_940").head()

