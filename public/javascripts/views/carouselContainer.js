(function () {
	var carouselContainer = Backbone.View.extend({		
		initialize: function(){
			//this.listenTo(this.collection, 'reset', this.render);				
			this.render();
		},
		render: function(){						
			var view = this,
				carousel = new App.Views.VenueCarousel({
					collection: view.collection,
					dimensions: {
						width: view.$el.width() / 3,
						height: view.$el.height()
					}
				}),
				carouselElement = carousel.render();			

			if (carouselElement != undefined) 
				this.$('.cover2').after(carouselElement.el);
		}
	});

	App.Views.CarouselContainer = carouselContainer;
}());