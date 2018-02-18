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

buildDropdown();

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

buildMeta("BB_940");

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

pieChart("BB_940");

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
    
bubbleChart("BB_940");




// build guage
function guageChart(sample){
    url = '/wfreq/'+sample;
    Plotly.d3.json(url, function(error, data){
        if (error) return console.warn(error);
        // Enter a speed between 0 and 180
        var level = +data.washes*180/9;

        // Trig to calc meter point
        var degrees = 180 - level,
            radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);

        // Path: may have to change to create a better triangle
        var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
            pathX = String(x),
            space = ' ',
            pathY = String(y),
            pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);
        var data = [{ type: 'scatter',
        x: [0], y:[0],
        marker: {size: 28, color:'850000'},
        showlegend: false,
        name: 'washes',
        text: level,
        hoverinfo: 'text+name'},
        { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
        rotation: 90,
        text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
        textinfo: 'text',
        textposition:'inside',      
        marker: {colors:['rgba(14, 127, 0, .7)', 'rgba(14, 127, 0, .6)', 'rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                            'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                            'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                            'rgba(232, 226, 202, .3)', 'rgba(255, 255, 255, 0)']},
        labels: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', ''],
        hoverinfo: 'label',  
        hole: .5,
        type: 'pie',
        showlegend: false
        }];

        var layout = {
        shapes:[{
            type: 'path',
            path: path,
            fillcolor: '850000',
            line: {
            color: '850000'
            }
        }],
        title: 'Washes Per Week',
        height: 400,
        width: 500,
        xaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]},
        yaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]}
        };

        var GUAGE = document.getElementById('washes');
        Plotly.plot(GUAGE, data, layout);
    }
)}
/*
function guageChart(sample){
    url = '/wfreq/'+sample;
    Plotly.d3.json(url, function(error, data){
        if (error) return console.warn(error);
        var level = +data.washes*180/9;
        console.log(level);
    }
)}
*/
guageChart("BB_940")