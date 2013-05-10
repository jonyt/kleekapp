(function () {
	var venueList = Backbone.View.extend({
		initialize: function(){
			this.listenTo(this.collection, 'reset', this.render);
		},	
		render: function(){
			for (var i = 0; i < this.collection.models.length; i+= 3){
				var frame = new App.Views.VenueListFrame({
					collection: new App.Collections.Venues(this.collection.slice(i, i + 3))
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