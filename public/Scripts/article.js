$(document).ready(function(){
	$('.delete_article').click(function(e){
		e.preventDefault();
		var container  = $(this);
		var url = container.attr('href');
		$.ajax({
			url : url,
			success: function(){
				container.parent().parent().remove();
			}
		});	
	});
});
