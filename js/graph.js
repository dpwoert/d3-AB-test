window.graph = {
	zoomScale: 1,
	objects: [],
	mode: 'conversie'
};

graph.colors = {
	conversie: ['#2ecc71','#27ae60','#16a085','#c0392b','#e74c3c','#f36b5c','#2c3e50'  ,   '#2ecc71','#27ae60','#c0392b','#e74c3c','#f36b5c','#2c3e50']
}

graph.bars = {
	conversie: ['ConversiesTablet', 'ConversiesMobile', 'ConversieDesktop', 'VisitTablet', 'VisitMobile','VisitDesktop', 'notCounted'],
	returning: ['ConversiesNew','ConversiesReturn','VisitNew','VisitReturn']
}

graph.labels = {
	ConversiesTablet: 'Conversies tablet',
	ConversiesMobile: 'Conversies mobiel',
	ConversieDesktop: 'Conversies desktop',
	VisitTablet: 'Bezoekers tablet (rel)',
	VisitMobile: 'Bezoekers mobiel (rel)',
	VisitDesktop: 'Bezoekers desktop (rel)',
	notCounted: 'Afrondingsfoutje',
	ConversiesNew: 'Nieuwe conversie',
	ConversiesReturn: 'Terugkerende conversie',
	VisitNew: 'Aantal nieuwe bezoekers (rel)',
	VisitReturn: 'Aantal terugkerende bezoekers (rel)',
}

graph.bars.all = graph.bars.conversie.concat(graph.bars.returning);

graph.make = function(){

	graph.svg = d3.select('svg');
	graph.svg.append('g');

	graph.barWidth = Math.floor(window.innerWidth/data.rows.length);

	d3.select('svg g').selectAll('rect')
		.data(data.rows)
		.enter()
		.append('rect')
		.attr('x', graph.pos.x)
		.attr('y', 0)
		.attr('height', window.innerHeight)
		.attr('width',graph.barWidth )
		.each(graph.makeBar);

	$(window).mousemove(function(event){
		event = event || window.event; // IE-ism
		main.mouseY = event.pageY;
	});
};

graph.pos = {};

graph.pos.x = function(d, i){
	return Math.floor(graph.barWidth*i);
}

graph.pos.y = function(start, height){
	return window.innerHeight - start - height;
}

graph.makeBar = function(d,i){

	//add bars
	$.each(graph.bars.all, function(key, val){

		//save for later recalling
		graph.objects.push({
			'd': d,
			'i': i,
			'key': key,
			'val': val,
		});

		d3.select('svg g')
			.append('rect')
			.attr('height', 0)
			.attr('fill', graph.colors.conversie[key] )
			.attr('fill-opacity', function(){ if(d.Version == 'B') return 0.6; })
			.attr('chart',  graph.objects.length - 1)
			.attr('class', 'bars')
			.on('mousemove', graph.tooltip)
			.on('mouseoout', graph.hideTooltip);

	});

	//add label
	d3.select('svg g')
		.append('text')
		.text(d.Version)
		.attr('x', function(){ return graph.pos.x(d,i)+(graph.barWidth/2); })
		.attr('y', window.innerHeight-15 )
		.attr('fill', '#ffffff')
		.attr('class', 'labelBottom');

	//animate
	requestAnimFrame(graph.animate);
};

graph.animate = function(){

	requestAnimFrame(graph.animate);

	var start = 0;

	//add bars
	var rects = d3.selectAll('svg g rect.bars');

	rects.each(function(){

		//value
		var rect = d3.select(this);
		var obj = graph.objects[ rect.attr('chart') ];

		//target - devices
		if(graph.mode == 'conversie' && $.inArray(obj.val, graph.bars.conversie) > -1){
			var index = obj.key < 3 ? obj.d[obj.val] / obj.d.Visit : obj.d[obj.val] / (obj.d.Visit-obj.d.Conversies);
			index *= graph.zoomScale;
		}
		//target - returning
		else if (graph.mode == 'returning' && $.inArray(obj.val, graph.bars.returning) > -1){
			var index = obj.key < 2 ? obj.d[obj.val] / obj.d.Visit : obj.d[obj.val] / (obj.d.Visit-obj.d.Conversies);
			index *= graph.zoomScale;
		}
		else {
			var index = 0;
		}
		var target = Math.floor(window.innerHeight * index);

		//animate
		var current = +rect.attr('height');
		if(target > 0){
			var height = current + ( (target - current) * 0.007 );
		} else {
			var height = 0;
		}

		rect.attr('x', function(){ return graph.pos.x(obj.d,obj.i); })
			.attr('y', function(){ return graph.pos.y(start, height) })
			.attr('height', height )
			.attr('width', graph.barWidth)

		//itterate
		start += height;
		if(obj.key == graph.bars.conversie.length - 1){
			start = 0;
		}

	});

}

graph.tooltip = function(d,i){
	var rect = d3.select(this);
	var obj = graph.objects[ rect.attr('chart') ];

	$tooltip = $('.tooltip');
	$tooltip.find('span').text(graph.labels[obj.val]);
	$tooltip.css('left', +rect.attr('x') + graph.barWidth + 7);
	$tooltip.css('top', main.mouseY);

	$tooltip.addClass('show');
}

graph.hideTooltip = function(d,i){
	 //$('.tooltip').removeClass('show');
}