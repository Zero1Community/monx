
$('.scan').click(function(){
	var domain = $('.domain').val();
	console.log(domain);
	$.post('/services/mx', {domain: domain}, function(data){
		$('.results-panel').removeClass('hide');;
		$('.results-body').empty().removeClass('hide');;
		if(data['success'] == 0) {
			$('.results-body').append("Ska tdhona");	
		} else {
			$.each(data, function(index, val){
				$('.results-body').append('<li class="list-group-item"><span class="mx-server">' + val['exchange'] + '</span> ' + val['priority'] + '<button type="button" class="btn pull-right btn-default  btn-sm blacklist-scan" onClick="buttonClick();">Scan</button></li>');
			});
		}
	});
});

function buttonClick() {
	console.log(this);
	/*$.post('/services/mx', {domain: domain}, function(data){
		$('.results-panel').removeClass('hide');;
		$('.results-body').empty().removeClass('hide');;
		if(data['success'] == 0) {
			$('.results-body').append("Ska tdhona");	
		} else {
			$.each(data, function(index, val){
				$('.results-body').append('<li class="list-group-item">' + val['exchange'] + ' ' + val['priority'] + '<button type="button" class="btn pull-right btn-default  btn-sm blacklist-scan" onClick="buttonClick();">Scan</button></li>');
			});
		}
	});*/
}