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
			this.venueType.css('visibility', 'visible');
			this.markers = [];			

			var view = this;
			
			google.maps.event.addListenerOnce(this.map, 'tilesloaded', function(){				
				view.resetCollection(view);
		    });

		    this.listenTo(this.collection, 'reset', this.render);	
		    this.listenTo(App.vent, 'map:changeLocation', function(newCenter){
		    	this.map.setCenter(newCenter);
		    	view.resetCollection(view);
		    });			
		},
		events: {
			'click #venueSearchButton': function(e){
				ga('send', 'event', 'venue-search', 'click', 'venue-type', this.venueType.val());
				ga('send', 'event', 'venue-search', 'click', 'center', this.map.getCenter().toString());					
				this.resetCollection(this);
			},
			'keydown #search': function(e){
				var $input = $(e.target);
				if ($.trim($input.val()).length == 0){
					if (!$input.hasClass('blurred')){
						$input.addClass('blurred');
					}
				} else {
					$input.removeClass('blurred');
				}
			}
		},
		render: function(){
			var view = this;			
			$(this.collection.models).each(function(index, venue){				
			    view.markers.push(new App.Views.VenueMarker({
			    	model: venue, 
			    	map: view.map, 
			    	category: view.venueType.val()
			    }));
			});	

			App.vent.trigger('map:rendered');		
		},
		resetCollection: function(view){
			view.collection.fetch({
				mapBounds: view.map.getBounds(), 
				category: view.venueType.val()
			});
		}
	});

	App.Views.VenueSearch = venueSearch;
}());