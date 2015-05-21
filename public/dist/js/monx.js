
$('.scan').click(function(){
	var domain = $('.domain').val();
	console.log(domain);
	$.post('/services/mx', {domain: domain}, function(data){
		$('.results').empty();
		if(data['success'] == 0) {
			$('.results').append("Ska tdhona");	
		} else {
			$.each(data, function(index, val){
				$('.results').append(val['exchange'] + " " + val['priority'] + "<br>");

			});
		}
	});
});
