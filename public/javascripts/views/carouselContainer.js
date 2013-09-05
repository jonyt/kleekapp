(function () {
	var carouselContainer = Backbone.View.extend({		
		initialize: function(){
			this.listenTo(this.collection, 'reset', this.render);	

			var carousel = new App.Views.VenueCarousel({
					collection: this.collection,
					dimensions: {
						width: this.$el.width() / 3,
						height: this.$el.height()
					}
				});
			this.$('.cover2').after(carousel.render().el);
		},
		render: function(){			
			var view = this;

			this.listenToOnce(App.vent, 'carousel:removed', function(){
				var carousel = new App.Views.VenueCarousel({
					collection: view.collection,
					dimensions: {
						width: view.$el.width() / 3,
						height: view.$el.height()
					}
				});
				view.$('.cover2').after(carousel.render().el);
			}); 
		}
	});

	App.Views.CarouselContainer = carouselContainer;
}());