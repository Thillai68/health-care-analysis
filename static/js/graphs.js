queue()
    .defer(d3.json, "/data")
    .await(makeGraphs);

function makeGraphs(error, recordsJson) {

	//Clean data
	var records = recordsJson;
	var dateFormat = d3.time.format("%Y-%m-%d %H:%M:%S");

	records.forEach(function(d) {
		d["timestamp"] = dateFormat.parse(d["timestamp"]);
		d["timestamp"].setMinutes(0);
		d["timestamp"].setSeconds(0);
		d["longitude"] = +d["longitude"];
		d["latitude"] = +d["latitude"];
	});

	//Create a Crossfilter instance
	var ndx = crossfilter(records);

	//Define Dimensions
	var dateDim = ndx.dimension(function(d) { return d["timestamp"]; });
	var genderDim = ndx.dimension(function(d) { return d["gender"]; });
	var statusDim = ndx.dimension(function(d) { return d["status"]; });
	var ageSegmentDim = ndx.dimension(function(d) { return d["age_segment"]; });
	var bloodpressureDim = ndx.dimension(function(d) { return d["bloodpressure_segment"]; });
	var temperatureDim = ndx.dimension(function(d) { return d["temperature_segment"]; });
	var heartrateDim = ndx.dimension(function(d) { return d["heartrate_segment"]; });
	var bloodsugarDim = ndx.dimension(function(d) { return d["bloodsugar_segment"]; });
	var conditionDim = ndx.dimension(function(d) { return d["condition"]; });
	var locationDim = ndx.dimension(function(d) { return d["location"]; });
	var bmiDim = ndx.dimension(function(d) { return d["bmi_segment"]; });
	var patientDim = ndx.dimension(function(d) { return d["id"]; });
	var allDim = ndx.dimension(function(d) {return d;});

	//Group Data
	var numRecordsByDate = dateDim.group();
	var genderGroup = genderDim.group();
	var statusGroup = statusDim.group();
	var ageSegmentGroup = ageSegmentDim.group();
	var bloodpressureGroup = bloodpressureDim.group();
	var temperatureGroup = temperatureDim.group();
	var heartrateGroup = heartrateDim.group();
	var bloodsugarGroup = bloodsugarDim.group();
	var ConditionGroup = conditionDim.group();
	var locationGroup = locationDim.group();
	var bmiGroup = bmiDim.group();
	var all = ndx.groupAll();


	//Define values (to be used in charts)
	var minDate = dateDim.bottom(1)[0]["timestamp"];
	var maxDate = dateDim.top(1)[0]["timestamp"];

    //Charts
    var numberRecordsND = dc.numberDisplay("#number-records-nd");
	var timeChart = dc.barChart("#time-chart");
	var genderChart = dc.pieChart("#gender-row-chart");
	var statusChart = dc.pieChart("#status-row-chart");
	var bmiChart = dc.pieChart("#bmi-row-chart");
	var ageSegmentChart = dc.pieChart("#age-segment-row-chart");
	var bloodpressureChart = dc.pieChart("#bloodpressure-segment-row-chart");
	var temperatureChart = dc.pieChart("#temperature-segment-row-chart");
	var heartrateChart = dc.pieChart("#heartrate-segment-row-chart");
	var bloodsugarChart = dc.pieChart("#bloodsugar-segment-row-chart");
	var ConditionChart = dc.pieChart("#condition-row-chart");
	var locationChart = dc.rowChart("#location-row-chart");


	numberRecordsND
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(all);

	timeChart
		.width(650)
		.height(140)
		.margins({top: 10, right: 50, bottom: 20, left: 20})
		.dimension(dateDim)
		.group(numRecordsByDate)
		.transitionDuration(500)
		.x(d3.time.scale().domain([minDate, maxDate]))
		.elasticY(true)
		.yAxis().ticks(4);

	genderChart
        .width(300)
        .height(310)
        .slicesCap(4)
        .innerRadius(60)
        .dimension(genderDim)
        .group(genderGroup)
        .legend(dc.legend())
        .colors(['#52006A', '#4A47A3'])

    bloodpressureChart
        .width(300)
        .height(310)
        .slicesCap(4)
        .innerRadius(60)
        .dimension(bloodpressureDim)
        .group(bloodpressureGroup)
        .legend(dc.legend())
        .colors(['#1a2441', '#1b6145', '#697b30', '#c87b7c', '#cda2e0', '#c6e1f1'])

    temperatureChart
        .width(300)
        .height(310)
        .slicesCap(4)
        .innerRadius(60)
        .dimension(temperatureDim)
        .group( temperatureGroup)
        .legend(dc.legend())
        .colors(['#2e1e3b', '#413d7b', '#37659e', '#348fa7', '#40b7ad', '#8bdab2'])

    heartrateChart
        .width(300)
        .height(310)
        .slicesCap(4)
        .innerRadius(60)
        .dimension(heartrateDim)
        .group(heartrateGroup)
        .legend(dc.legend())
        .colors(['#2e1e3b', '#413d7b', '#37659e', '#348fa7', '#40b7ad', '#8bdab2'])


	bloodsugarChart
         .width(300)
         .height(310)
         .slicesCap(4)
         .innerRadius(60)
         .dimension(bloodsugarDim)
         .group(bloodsugarGroup)
         .legend(dc.legend())
         .colors(['#2e1e3b', '#413d7b', '#37659e', '#348fa7', '#40b7ad', '#8bdab2'])

	statusChart
        .width(300)
        .height(300)
        .slicesCap(4)
        .innerRadius(60)
        .dimension(statusDim)
        .group(statusGroup)
        .colors(['#221150', '#5f187f', '#982d80', '#d3436e', '#f8765c', '#febb81'])


	bmiChart
        .width(400)
        .height(300)
        .slicesCap(4)
        .innerRadius(60)
        .dimension(bmiDim)
        .group(bmiGroup)
        .colors(['#221150', '#5f187f', '#982d80', '#d3436e', '#f8765c', '#febb81'])

	ageSegmentChart
		 .width(300)
         .height(300)
         .slicesCap(4)
         .innerRadius(60)
         .dimension(ageSegmentDim)
         .group(ageSegmentGroup)
         .colors(['#221150', '#5f187f', '#982d80', '#d3436e', '#f8765c', '#febb81'])


	ConditionChart
		.width(300)
		.height(310)
		.slicesCap(4)
        .innerRadius(60)
        .dimension(conditionDim)
        .group(ConditionGroup)
        .legend(dc.legend())
        .colors(['#46327e', '#365c8d', '#277f8e', '#1fa187', '#4ac16d', '#a0da39'])

    locationChart
    	.width(200)
		.height(510)
        .dimension(locationDim)
        .group(locationGroup)
        .ordering(function(d) { return -d.value })
        .colors(['#facf73'])
        .elasticX(true)
        .labelOffsetY(10)
        .xAxis().ticks(4);

    var map = L.map('map');

	var drawMap = function(){
	    map.setView([53.35, -6.26], 13);
		mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
		L.tileLayer(
			'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
				attribution: '&copy; ' + mapLink + ' Contributors',
				maxZoom: 15,
			}).addTo(map);

		//HeatMap
		var geoData = [];
		_.each(allDim.top(Infinity), function (d) {
			geoData.push([d["latitude"], d["longitude"], 1]);
	      });
		var heat = L.heatLayer(geoData,{
			radius: 3,
			blur: 2,
			maxZoom: 1,
		}).addTo(map);

	};

	//Draw Map
	drawMap();

	//Update the heatmap if any dc chart get filtered
	dcCharts = [timeChart, genderChart, ageSegmentChart, ConditionChart, locationChart];

	_.each(dcCharts, function (dcChart) {
		dcChart.on("filtered", function (chart, filter) {
			map.eachLayer(function (layer) {
				map.removeLayer(layer)
			});
			drawMap();
		});
	});

	dc.renderAll();

};