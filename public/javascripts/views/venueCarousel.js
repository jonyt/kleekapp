(function () {
	var venueCarousel = Backbone.View.extend({	
		tagName: 'div',
		initialize: function(options){
			this.dimensions = options.dimensions;
			this.listenTo(this.collection, 'reset', this.remove);			
		},
		render: function(){
			var view = this;
			$(this.collection.models).each(function(index, venue){				
				new App.Views.VenueMarker({model: venue});
				var li = new App.Views.VenueListItem({model: venue});
				view.$el.append(li.render().el);
			});
			this.$el.rcarousel({
				width: this.dimensions.width, 
				height: this.dimensions.height,
				navigation: {next: "#nextBtn", prev: "#prevBtn"}
			});

			return this;
		},
		remove: function(options){
			this.$el.unbind();
			this.$el.removeData();

			App.vent.trigger('carousel:removed'); 

			return Backbone.View.prototype.remove.call(this, options);
		}
	});

	App.Views.VenueCarousel = venueCarousel;
}());