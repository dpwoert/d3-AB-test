window.menu = {};

menu.init = function(){

	$('#mouseover').mouseover(function(){
		$('#barchart').addClass('hide');
		$('#topmenu').addClass('active');
	});

	$('#topmenu').mouseleave(function(){
		$('#barchart').removeClass('hide');
		$('#topmenu').removeClass('active');
	});

	$('#topmenu li').click(function(){
		console.log($(this).attr('rel'));
		switch( $(this).attr('rel') ){

			case 'zoom':
				menu.zoom(this);
			break;

			case 'devices':
				menu.mode('devices');
			break;

			case 'returning':
				menu.mode('returning');
			break;
		}
	});

}

menu.zoom = function(e){
	$this = $(e);

	if(!$this.hasClass('active')){
		graph.zoomScale = 15;
		$this.addClass('active');
	} else {
		graph.zoomScale = 1;
		$this.removeClass('active');
	}
}

menu.mode = function(mode){

	if(mode == 'devices'){
		graph.mode = 'conversie';
		$('#topmenu li').removeClass('active');
		$('#topmenu li.devices').addClass('active');
	} else {
		graph.mode = 'returning';
		$('#topmenu li').removeClass('active');
		$('#topmenu li.returning').addClass('active');
	}

}