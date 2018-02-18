// Use the OTU IDs for the x values
// Use the Sample Values for the y values
// Use the Sample Values for the marker size
// Use the OTU IDs for the marker colors
// Use the OTU Description Data for the text values

var otus = bb940.map(record => record.otu_id);
var values = bb940.map(record => record.sample_value);
var names = bb940.map(record => record.lowest_taxonomic_unit_found);

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
  
  Plotly.newPlot('bubble', data, layout);