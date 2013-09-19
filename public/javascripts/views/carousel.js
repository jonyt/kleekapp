(function () {
	var carousel = Backbone.View.extend({		
		initialize: function(){
			this.listenTo(this.collection, 'reset', this.render);	
			this.listenTo(App.vent, 'carousel:scrollTo', function($element){
				this.$el.carousel('goToItem', $element);
			});			
			this.$el.carousel({
				pagination: false,
				continuous: true,
				insertPrevAction: function(){ return $('#prevBtn'); },
				insertNextAction: function(){ return $('#nextBtn'); },
				items: '.result_light'		
			});
		},
		render: function(){	
			var $el = this.$el,
				$dummyElement = $('<div class="result_light" />');
			$el.carousel('add', $dummyElement);

			$(this.collection.models).each(function(index, venue){
				var view = new App.Views.VenueListItem({model: venue}),
					li = view.render().el;
				$el.carousel('add', li);
			});

			$el.carousel('remove', $dummyElement);

			return this;
		}
	});

	App.Views.Carousel = carousel;
}());