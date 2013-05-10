(function () {
	var venueFrame = Backbone.View.extend({	
		tagName: 'li',	
		initialize: function(){
			this.listenTo(this.collection, 'destroy', this.remove);
		},
		render: function(){
			var view = this;
			$(this.collection.models).each(function(index, venue){
				var listItem = new App.Views.VenueListItem({model: venue});
				view.$el.append(listItem.render().el);
			});

			return this;
		}
	});

	App.Views.VenueListFrame = venueFrame;
}());