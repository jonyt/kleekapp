(function () {
	var venueSearch = Backbone.View.extend({		
		initialize: function(){
			this.map = new google.maps.Map(this.$('#map').get(0), {
					zoom: 13,
					disableDefaultUI : true,
					center: new google.maps.LatLng(40.71533862964688, -73.93952650219734), // New York's coordinates
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					zoomControlOptions : { style : google.maps.ZoomControlStyle.SMALL}
				}
			);

			this.venueType = this.$('#select1');
			this.venueType.yaselect();
			this.markers = [];

			var view = this;
			google.maps.event.addListener(this.map, 'tilesloaded', function(){
				$('#map-loading').hide();
				view.collection.fetch({mapBounds: this.getBounds(), category: view.venueType.val()});
		    });

		    this.listenTo(this.collection, 'reset', this.render);			
		},
		events: {
			'click #venueSearchButton': function(e){
				google.maps.event.trigger(this.map, 'tilesloaded');
			}
		},
		render: function(){
			var view = this;
			$(this.markers).each(function(index, markerView){
				markerView.remove();
			});
			$(this.collection.models).each(function(index, venue){				
			    view.markers.push(new App.Views.VenueMarker({
			    	model: venue, 
			    	map: view.map, 
			    	category: view.venueType.val()
			    }));
			});			
		}
	});

	App.Views.VenueSearch = venueSearch;
}());