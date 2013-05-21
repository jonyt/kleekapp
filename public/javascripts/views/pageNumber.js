(function () {
	var pageNumber = Backbone.View.extend({		
		initialize: function(options){		
			this.listenTo(App.vent, 'page:transition', function(numPage){
				this.$('.steps').each(function(index, element){
					var $element = $(element),
						$img = $element.find('img');
					if (numPage == (index + 1)){
						$element.removeClass('off');
						$element.addClass('on');
						$img.removeClass('off');
						$img.addClass('on');
					} else {
						$element.removeClass('on');
						$element.addClass('off');
						$img.removeClass('on');						
						$img.addClass('off');						
					}
				});
			});
		}
	});

	App.Views.PageNumber = pageNumber;
}());	    