(function () {
	var venueList = Backbone.View.extend({
		numItemsPerLI: 3,
		initialize: function(){
			this.listenTo(this.collection, 'reset', this.render);
			this.listenTo(App.vent, 'marker:mouseover', function(model){
				var index = this.collection.indexOf(model),
					listItemIndex = Math.floor(index / this.numItemsPerLI),
					listItem = this.$('li'),
					listItemWidth = listItem.width();
				this.$el.animate({ marginLeft: -1 * listItemIndex * listItemWidth }, 1600);
			});
		},	
		render: function(){
			this.$el.empty();
			for (var i = 0; i < this.collection.models.length; i+= this.numItemsPerLI){
				var from = i,
					to = i + this.numItemsPerLI,
					subCollection = new App.Collections.Venues(this.collection.slice(from, to)),
					frame = new App.Views.VenueListFrame({
						collection: subCollection
					});
				this.$el.append(frame.render().el);
			}
			
			this.$el.parent().easySlider({
				continuous: true
			});
			return this;
		}
	});

	App.Views.VenueList = venueList;
}());