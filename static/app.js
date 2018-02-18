/* Dropdown with list of all sample names */

// Populating dropdown with sample names
function buildDropdown() {
    Plotly.d3.json('/names', function(error, names){
        if (error) return console.warn(error);
        var selDataset = document.getElementById("selDataset");
        for (i = 0; i < names.length; i++) {
                    sample = names[i]
                    var sample_option = document.createElement("option");
                    sample_option.text = sample;
                    sample_option.value= sample;
                    selDataset.appendChild(sample_option);
                }
    }
)}

buildDropdown()

// Populating metadata
function buildMeta(sample) {
    url = '/metadata/'+sample
    Plotly.d3.json(url, function(error, data){
        if (error) return console.warn(error);
        
        var age = document.getElementById("age");
        var bbtype = document.getElementById("bbtype");
        var gender = document.getElementById("gender");
        var location = document.getElementById("location");
        var sampleid = document.getElementById("sampleid");
        
        age.innerHTML = data.AGE;
        bbtype.innerHTML = data.BBTYPE;
        gender.innerHTML = data.GENDER; 
        location.innerHTML = data.LOCATION;
        sampleid.innerHTML = data.SAMPLEID;
        
    }
    )}

buildMeta("BB_940")

// build pie chart
function pieChart(sample){
    url = '/samples/'+sample;
    Plotly.d3.json(url, function(error, data){
        if (error) return console.warn(error);
    
        samples=[]
        otus=[]
        for (i = 0; i < 10; i++) {
            samples.push(+data[i].sample_value)
            otus.push(+data[i].otu_id)
        }

        var trace1 = {
            labels: samples,
            values: otus,
            type: 'pie'
        }
        
        var pieData = [trace1];

        layout = {
            height: 400,
            width: 400,
        }
        var PIE = document.getElementById('pie');
        Plotly.plot(PIE, pieData, layout);
        }
)}

pieChart("BB_940")

// build bubble chart
function bubbleChart(sample){
    url = '/samples/'+sample;
    Plotly.d3.json(url, function(error, data){
        if (error) return console.warn(error);
        var otus = data.map(record => record.otu_id);
        var values = data.map(record => record.sample_value);
        var names = data.map(record => record.lowest_taxonomic_unit_found);

        var trace1 = {
            x: otus,
            y: values,
            text: names,
            mode: 'markers',
            marker: {
            size: values,
            color: otus
            }
        };
        
        var data = [trace1];
        
        var layout = {
            showlegend: false
        };
        var BUBBLE = document.getElementById('bubble');
        
        Plotly.plot(BUBBLE, data, layout);        
    }
    )}
    
    bubbleChart("BB_940")