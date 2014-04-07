var margin = {top: 40, right: 40, bottom: 40, left:40},
    width = 1000,
    height = 120;
	
		var intervalAnalysis=10;
		
		
var myTimeINtervalFunction = function(date) {
    var hours = 24;
		
    var timezone = date.getTimezoneOffset() / 60;
    return new Date((Math.floor(date / 36e5 / hours/intervalAnalysis - timezone) + timezone) * 36e5 * hours/intervalAnalysis);
}

coffelogdata.forEach(function(d){
	var createnewdate=new Date(d.date); 
	
	d.date=createnewdate;
	
	var minutes=createnewdate.getMinutes();	
	d.interval=Math.round(minutes/intervalAnalysis);
	
	var simpleDay=new Date(d.date);
	simpleDay.setSeconds(0);
	simpleDay.setMilliseconds(0);
	simpleDay.setHours(0);
	simpleDay.setMinutes(0);
	//simpleDay.setMonth(0);
	d.simpleDay=simpleDay;
	
	var simpleTime=new Date(d.date);
	simpleTime.setMinutes(d.interval*intervalAnalysis);
	simpleTime.setSeconds(0);
	simpleTime.setMilliseconds(0);
	d.simpleTime=simpleTime;
	

		
	//console.log(createnewdate,simpleTime);	
	d.quantity=1;
});




var crossData=crossfilter(coffelogdata); //buffer my data in to crossfilter object
//var CoffeLog = ndx.dimension(function (d) { return d.date; })//add a new dimension

//prepare data per daily view chart
var todaysData = crossData.dimension(function(d) {return d.simpleTime;});
//var CoffeLogIntervalDimension = crossData.dimension(function(d) {return d.simpledate;});

var groupToday=todaysData.group()//create a group
								.reduceSum(function(d) {return d.quantity;});  //function(d) {return d.quantity;}
														
//prepare data for weekly view chart	

var weeksData = crossData.dimension(function(d) {return d.simpleDay;});
								//var CoffeLogIntervalDimension = crossData.dimension(function(d) {return d.simpledate;});
var groupWeek=weeksData.group()//create a group
								.reduceSum(function(d) {return d.quantity;});  //function(d) {return d.quantity;}
													
							
	
											
var filterAll=todaysData.filterAll();											
//print_filter("filterAll");  

var d = new Date();
d.setMinutes(0);
//d.setDate(d.getDate()-1); //comment to display today's data
var minDate=d.setHours(8);
minDate=d.setDate(d.getDate());
var maxDate=d.setHours(22);

//console.log(d3.time.minutes);
//console.log(d3.time.minute.range(minDate,maxDate,20));


var CoffeLogChart = dc.barChart("#chart"); //use dc to define the div of the chart
CoffeLogChart.width(1000)
						.height(200)
 					 .brushOn(false)
					.dimension(todaysData)
					.group(groupToday)
					
					.x(d3.time.scale().domain([minDate, maxDate]))
					//.y(d3.time.scale().domain([minDate, maxDate]))
	         .renderHorizontalGridLines(true) // (optional) render horizontal grid lines, :default=false
	         //.renderVerticalGridLines(true) // (optional) render vertical grid lines, :default=false
	         .xAxisLabel('time') // (optional) render an axis label below the x axis
	         .yAxisLabel('Coffe amount') // (optional) render a vertical axis lable left of the y axis
					 .title("Coffe today")
					.colors(["#a60000","#ff0000", "#ff4040","#ff7373","#67e667","#39e639","#00cc00"])
	         //#### Labels and  Titles
	         //Labels are displaed on the chart for each bubble. Titles displayed on mouseover.
	         .renderLabel(true) // (optional) whether chart should render labels, :default = true
	         .renderTitle(true) // (optional) whether chart should render titles, :default = false

	         //#### Customize Axis
	         //Set a custom tick format. Note `.yAxis()` returns an axis object, so any additional method chaining applies to the axis, not the chart.
 					//.round(d3.time.minute, intervalAnalysis)
 					.xUnits(d3.time.minutes)
					.xAxis().ticks(d3.time.minute, 20)
					
					// .tickFormat(function(v) {return (" " + v) });
					
					 ;
							  
					 var d = new Date();
					 d.setMinutes(0);
				   var day = d.getDay();
				   var diff = d.getDate() - day +1 ;
					var minDateMonth=new Date(d.setDate(diff));
//					console.log(minDateMonth);
	       				diff = minDateMonth.getDate() +6 
					 var maxDateMonth=new Date(d.setDate(diff));
					 //minDate.setDay(Date.today().next().sunday());
					 
			
 var CoffeLogWeekChart = dc.barChart("#chart2"); //use dc to define the div of the chart
CoffeLogWeekChart.width(1000)
 					.height(200)
  				.brushOn(false)
 					.dimension(weeksData)
 					.group(groupWeek)
					
					.x(d3.time.scale().domain([minDateMonth, maxDateMonth]))
 	        .renderHorizontalGridLines(true) // (optional) render horizontal grid lines, :default=false
					//.renderVerticalGridLines(true) // (optional) render vertical grid lines, :default=false
					.xAxisLabel('time') // (optional) render an axis label below the x axis
					.yAxisLabel('Coffe amount') // (optional) render a vertical axis lable left of the y axis
					.title("Coffe today")
					.colors(["#a60000","#ff0000", "#ff4040","#ff7373","#67e667","#39e639","#00cc00"])
					//#### Labels and  Titles
					//Labels are displaed on the chart for each bubble. Titles displayed on mouseover.
					.renderLabel(true) // (optional) whether chart should render labels, :default = true
					.renderTitle(true) // (optional) whether chart should render titles, :default = false

					//#### Customize Axis
					//Set a custom tick format. Note `.yAxis()` returns an axis object, so any additional method chaining applies to the axis, not the chart.
					.round(d3.time.day)
					.xUnits(d3.time.days)
					.xAxis().ticks(d3.time.day)
					;
					 					// .tickFormat(function(v) {return (" " + v) });
					
								 
dc.renderAll();
//console.log(groupToday.all())
//console.log(groupWeek.all())


/* visualize data "the d3 way""
var x = d3.time.scale()
		.domain([minDate, maxDate])
    .rangeRound([0, width - margin.left - margin.right])		

var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .ticks(d3.time.minute, 60)
    .tickFormat(d3.time.format('%H:%M'))
    .tickSize(3)
    .tickPadding(10);
		
var svg = d3.select('#chart1').append('svg')
    .attr('class', 'chart')
    .attr('width', width)
    .attr('height', height)
	  .append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
	
var circle= svg.selectAll('circle')
    .data(coffelogdata)
			.enter().append('circle')
		    .attr('cx', function(d) { return x(new Date(d.date)); })
				.attr("cy", function(d,i) { return (10)})
				.attr('r', 2)
				.attr("stroke", "red")
				;
svg.append('g')
	.attr('class', 'x axis')
	.attr('transform', 'translate(0, ' + (height - margin.top - margin.bottom) + ')')
	.call(xAxis);
				
*/


		function print_filter(filter){
			var f=eval(filter);
			if (typeof(f.length) != "undefined") {}else{}
			if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
			if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
			//console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
		} 