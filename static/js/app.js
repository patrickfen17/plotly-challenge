function loadCharts(id) {

  console.log(id)

  d3.json("samples.json").then((data)=>{

    // Check getting data
    console.log(data);

    // Create selected Sample and Meta variables
    var selectedData = data.samples.filter(obj => obj.id == id)
    
    // Create metadata
    var metadata = data.metadata;

    // Set selected metadata to first ID
    var selectedMetaData = (metadata.filter(obj => obj.id == id))[0];

    // Create variables 
    var otuIds = selectedData[0].otu_ids;
    var sampleValues = selectedData[0].sample_values;
    var otuLabels = selectedData[0].otu_labels;

    // Slice the first 10 objects for plotting
    var slicedIds = otuIds.slice(0, 10);
    var slicedSamples = sampleValues.slice(0,10);
    var slicedLabels = otuLabels.slice(0,10);

    // Reverse the objects
    var reversedIds = slicedIds.reverse();
    var reversedSamples = slicedSamples.reverse();
    var reversedLabels = slicedLabels.reverse();

    // ****** Build Bar Chart ******
    var trace1 = {
      x: reversedSamples,
      y: reversedIds.map(d => "OTU " + d),
      text: reversedLabels,
      type: "bar",
      orientation: "h"
    };

    // Data
    var barData = [trace1];

    // Layout 
    var layout = {
        title: {text: "Top 10 OTUs", font: { size: 24 } },
        yaxis: {
            type: "category"
        },
        margin: { l: 100, r: 50, t: 50, b: 10 },
        barmode: 'stack'
      };

    // Plot to div tag "bar"
    Plotly.newPlot("bar", barData, layout);


    // ****** Build Bubble Chart ******
    var trace1 = {
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        mode: "markers",
        marker: {
          color: otuIds,
          size: sampleValues
        }
    };
    
    // Data
    var bubbleData = [trace1];
  
    // Layout
    var layout = {
      title: {text: 'Test Subject Data', font: { size: 26 } },
      showlegend: false,
      height: 800,
      width: 1200
    };
  
    // Plot to div tag "bubble"
    Plotly.newPlot('bubble', bubbleData, layout);

    
    // ***** Build Gauge ******
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        type: "indicator",
        mode: "gauge+number",
        value: parseFloat(selectedMetaData.wfreq),
        title: {text: 'Belly Button Scrubs per Week', font: { size: 26 } },
        gauge: {
          axis: { range: [null, 9] },
          steps: [
            { range: [0, 1], color: "lightYellow"},
            { range: [1, 2], color: "lightGoldenRodYellow"},
            { range: [2, 3], color: "lemonChiffon"},
            { range: [3, 4], color: "khaki"},
            { range: [4, 5], color: "darkkhaki"},
            { range: [5, 6], color: "palegreen"},
            { range: [6,7], color: "lightgreen"},
            {range: [7,8], color: "mediumseagreen"},
            {range: [8,9], color: "darkgreen"}
          ],
        }
      }
    ];
    
    var gaugeLayout = {
      width: 600,
      height: 500,
      margin: { t: 0, b: 10, l: 10, r: 140 }
    };
    
    // Plot to div tag "gauge"
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);


    // ****** Build Demographic tabel ******
    // Set var  reference to sample-metadata 
    var panel = d3.select("#sample-metadata");

    // Clear table when new id is selected
    panel.html("");

    // Append metadate for selected ID 
    Object.entries(selectedMetaData)
      .forEach(([key]) => panel.append("h5").text(`${key}: ${selectedMetaData[key]}`))
    
  });
}

  // Read in JSON 
  d3.json("samples.json").then((data)=>{

    var dropdown = d3.select("#selDataset");

    data.names.forEach((dataobj) => {

      dropdown.append("option").text(dataobj).property("value", dataobj);
    })

    var id = data.names[0];
    // Call
    loadCharts(id);
})

function optionChanged(selectedID) {

  loadCharts(selectedID);
}