var trace1 = {
    labels: ['1167', '2859', '482', '2264', '41', '1189', '352', '189', '2318', '1977'],
    values: [163, 126, 113, 78, 71, 51, 50, 47, 40, 40],
    type: 'pie'
  };
  
  var pieData = [trace1];

  layout = {
    height: 400,
    width: 400,
  }
  
  Plotly.newPlot("pie", pieData, layout);

