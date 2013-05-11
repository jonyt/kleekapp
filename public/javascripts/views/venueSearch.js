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
			this.geocoder = new google.maps.Geocoder();

			var view = this;
			google.maps.event.addListener(this.map, 'tilesloaded', function(){
				App.vent.trigger('search:started');
				view.collection.fetch({mapBounds: this.getBounds(), category: view.venueType.val()});
		    });

		    this.listenTo(this.collection, 'reset', this.render);			
		},
		events: {
			'click #venueSearchButton': function(e){
				google.maps.event.trigger(this.map, 'tilesloaded');
			},
			'submit #addressForm': function(){
				var view = this,
					addressField = this.$('#search'),
					address = addressField.val();

				addressField.val('');	

				if ($.trim(address).length == 0){
					return false;
				}	

				this.geocoder.geocode( { 
			        'address': address
			    }, function(results, status) {		
			        if (status == google.maps.GeocoderStatus.OK) {
						view.map.setCenter(results[0].geometry.location);		
			        } else {
						/*$('#map-loading').fadeOut();
						$().toastmessage('showToast', {
							text     : "Couldn't find this address, please try again",
							position : 'top-center',
							type     : 'error'           
						});*/
			        // All possible codes are given in http://code.google.com/apis/maps/documentation/javascript/reference.html
			        // under google.maps.GeocoderStatus class
			        }
			    });

			    return false;
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

			App.vent.trigger('map:rendered');		
		}
	});

	App.Views.VenueSearch = venueSearch;
}());