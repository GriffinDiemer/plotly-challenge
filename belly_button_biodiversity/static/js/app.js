
function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
    // Use `d3.json` to fetch the metadata for a sample
  var selector = d3.select("#selDataset");
  console.log(selector)
  var sample = selector.property('value');
  console.log(sample)
  var metaUrl = "/metadata/"+sample
  console.log(metaUrl)
  // @TODO: Use `d3.json` to fetch the sample data for the plots
   d3.json(metaUrl).then(function(response) {

    console.log(response);
 
    // Use d3 to select the panel with id of `#sample-metadata`
    var metaData = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    metaData.html("")
      Object.entries(response).forEach(([key, value]) => {
        var cell = metaData.append("p");
        cell.text(`${key}: ${value}`);

  });
});
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    
}

function buildCharts(sample) {
  var selector = d3.select("#selDataset");
  console.log(selector)
  var sample = selector.property('value');
  console.log(sample)
  var url = "/samples/"+sample
  console.log(url)
  // @TODO: Use `d3.json` to fetch the sample data for the plots
   d3.json(url).then(function(response) {

    console.log(response);
    var sample_value = response.sample_values
    var otu_id = response.otu_ids
    var otu_label = response.otu_labels

    sample_value.sort(function compareFunction(firstNum, secondNum) {
      // resulting order is (3, 2, -120)
     return secondNum - firstNum;
   });
   const left = sample_value.slice(0, 10);
console.log(left);
   
    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    var trace = {
      type: "pie",
      values: left,
      labels: otu_id,
      text: otu_label,
      hoverinfo:  'text',
      textinfo: 'percent'
    }
    var trace1 = {
      mode: 'markers',
      x: otu_id,
      y: sample_value,
      text: otu_label,
      hovertemplate:
            "(%{y}, %{x})<br>" +
            "%{text}<br><br>" +
            "<extra></extra>",
      marker: {
        size: sample_value,
        color: otu_id,
        colorscale: 'Rainbow'
      }



    }
    var layout =
    {
      xaxis: {
        title: {
          text: 'OTU ID'},
      },
    }
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    data = [trace];
    data1= [trace1];
    Plotly.newPlot("pie",data)
    Plotly.newPlot("bubble",data1, layout)

});
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
