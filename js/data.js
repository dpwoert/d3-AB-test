window.data = {};
data.rows = false;

data.init = function(){
	
	d3.csv("dataset.csv")
		.row(function(row){
			row.notCounted = row.Visit - (row.Conversies - row.VisitTablet - row.VisitDesktop - row.VisitMobile);
			row.notCounted = row.notCounted < 0 ? 0 : row.notCounted;
			return row;
		})
		.get(function(error, rows) { 
			console.log(rows); 
			data.rows = rows;
			data.loaded();
		});

}

data.loaded = function(){

	//get maximal value
	//data.max = d3.max(data.rows, function(d) { return +d.Conversies; } );

	graph.make();
}