jQuery( document ).ready(function($) {

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
					$('.results-body').append('<li class="list-group-item"><span class="mx-server">' + val['exchange'] + '</span> ' + val['priority'] + '<a href="#" class="pull-right blacklist-scan">Scan</a></li>');
				});
			}
		});
	});

    $(document).on('click', '.blacklist-scan', function(){

    	var domain = $(this).parent().find('.mx-server').text();

		$.post('/services/blacklist', {domain: domain}, function(data){
			$('.blacklist-results-panel').removeClass('hide');;
			$('.blacklist-results-body').empty().removeClass('hide');;
			if(data['success'] == 0) {
				$('.results-body').append("Ska tdhona");	
			} else {
				$.each(data, function(index, val){

					var listed;
					if(val['status'] === 1) {
						listed = 'Listed';
					} else if(val['status'] === 2) {
						listed = 'Timeout'
					} else {
						listed = 'Clean';
					}


					$('.blacklist-results-body').append('<li class="list-group-item"><span class="rbl-server">' + val['server'] + '</span> <span class="badge pull-right">' + listed + '</span></li>');
				});
			}
		});
    });

});

