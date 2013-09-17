(function () {
	var venueCarousel = Backbone.View.extend({	
		tagName: 'div',
		initialize: function(options){
			this.dimensions = options.dimensions;			
			this.isCarouselInitialized = false; 		
			this.listenTo(this.collection, 'reset', this.render);				
		},
		render: function(){
			if (this.collection.models.length == 0) return;

			var view = this,
				$newLIs = $('');

			$(this.collection.models).each(function(index, venue){				
				new App.Views.VenueMarker({model: venue});
				var li = new App.Views.VenueListItem({model: venue});
				$newLIs = $newLIs.add(li.render().$el);				
			});

			this.$el.html($newLIs);

			if (!this.isCarouselInitialized){
				this.$el.rcarousel({
					width: this.dimensions.width, 
					height: this.dimensions.height,
					navigation: {next: "#nextBtn", prev: "#prevBtn"}
				});		
				this.isCarouselInitialized = true;
			} else {
				this.$el.rcarousel('removeAll');
				this.$el.rcarousel('append', $newLIs);
			}										

			return this;
		},
		remove: function(options){
			/*this.$el.rcarousel('removeAll');
			this.$el.empty();
			this.$el.unbind();
			this.$el.removeData();

			App.vent.trigger('carousel:removed'); */

			return Backbone.View.prototype.remove.call(this, options);
		}
	});

	App.Views.VenueCarousel = venueCarousel;
}());