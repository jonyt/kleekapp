(function () {
	var venue = Backbone.View.extend({		
		initialize: function(options){
			var markerPosition = new google.maps.LatLng(this.model.get('latitude'), this.model.get('longitude'));		
			
			this.marker = new google.maps.Marker({
			        map: options.map,
			        position: markerPosition,
					icon: App.MarkerIcons[options.category]
			    });

			var divOverlay = new DivOverlay(this.model.get('name'), options.map, this.marker.getPosition());
			divOverlay.hide();

			this.listenTo(this.model, 'listVenueItem:mouseover', function(){
				divOverlay.show();
			});
			this.listenTo(this.model, 'listVenueItem:mouseout', function(){
				divOverlay.hide();
			});

			this.listenTo(this.model, 'destroy', this.remove);

			var model = this.model;
			this.mouseoverListener = google.maps.event.addListener(this.marker, 'mouseover', function() {
			    this.timer = setTimeout(function(){
			        divOverlay.show();
			        App.vent.trigger('marker:mouseover', model);
				}, 150);
			});
			this.mouseoutListener = google.maps.event.addListener(this.marker, 'mouseout', function() {
			    if (this.timer){
			    	clearTimeout(this.timer);
			    }			    
			    divOverlay.hide();
		    });
		},
		remove: function(options){
			this.marker.setMap(null);
			this.marker = null;

			google.maps.event.removeListener(this.mouseoverListener);
			google.maps.event.removeListener(this.mouseoutListener);

			return Backbone.View.prototype.remove.call(this, options);
		}
	});

	App.Views.VenueMarker = venue;
}());