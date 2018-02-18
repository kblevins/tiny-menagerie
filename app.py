#################################################
# import necessary libraries
#################################################
import pandas as pd
import json

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, inspect, func

from flask import Flask, render_template, redirect, jsonify

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

session = Session(engine)
#################################################
# Flask Setup
#################################################

# create instance of Flask app
app = Flask(__name__)

# route that returns a list of sample names
@app.route('/names')
def sample_list():
    columns = inspector.get_columns('samples')
    sample_ids = []
    for c in columns:
        sample_ids.append(c['name'])
    sample_ids = sample_ids[1:]
    return jsonify(sample_ids)

# route that returns a list of the otu descriptions
@app.route('/otu')
def otu_list():
    results = session.query(OTU.lowest_taxonomic_unit_found).all()
    return jsonify({"otu_list":results})

# route that returns metadata for a given sample
@app.route('/metadata/<sample>')
def return_metadata(sample):
    sample = sample.replace("BB_", "")
    sample = int(sample)
    met = session.query(Meta.AGE, Meta.BBTYPE, Meta.ETHNICITY, Meta.GENDER,                             
    Meta.LOCATION, Meta.SAMPLEID).filter(Meta.SAMPLEID == sample).all()
    cols = ('AGE', 'BBTYPE', 'ETHNICITY', 'GENDER', 'LOCATION', 'SAMPLEID')
    samp_dict = {}
    for i in range(0,len(met[0])):
        samp_dict[cols[i]] = met[0][i]
    
    return json.dumps(samp_dict)

# route that returns the washing frequency for a given sample
@app.route('/wfreq/<sample>')
def wfreq(sample):
    sample = sample.replace("BB_", "")
    sample = int(sample)
    wash = session.query(Meta.WFREQ).filter(Meta.SAMPLEID == sample).all()
    wash_dict = {"washes": wash[0][0]}
   
    return jsonify(wash_dict)

# route that returns the otu ids & sample values for a given sample
@app.route('/samples/<sample>')
def otu_df(sample):
    col = f'Samples.{sample}'
    zoo = session.query(Samples.otu_id, col).all()
    zoo_df = pd.DataFrame(zoo)
    zoo_df.columns = ['otu_id', 'sample_value']
    zoo_df = zoo_df.sort_values('sample_value', ascending = False)

    otu_list = session.query(OTU.otu_id, OTU.lowest_taxonomic_unit_found).all()
    otu_df = pd.DataFrame(otu_list)
    
    zoo_df_wn = pd.merge(zoo_df, otu_df)
    zoo_df_j = zoo_df_wn.to_json(orient="records")
    return zoo_df_j

# route that renders index.html template
@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)