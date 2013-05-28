(function () {
	$.ajaxSetup({cache: false}); // Prevent stupid IE caching AJAX requests
	
	// Switch to mustache.js style delimiters otherwise there's a conflict with erb
    _.templateSettings = {
        interpolate: /\{\{\=(.+?)\}\}/g,
        evaluate: /\{\{(.+?)\}\}/g
    };

    var vent = {};
    $.extend(vent, Backbone.Events);

	window.App = {
		vent: vent,
		Models: {},
		Collections: {},
		Views: {},
		MarkerIcons: {
			bars: new google.maps.MarkerImage("images/marker_icons/bar.png"),
	        coffee: new google.maps.MarkerImage("images/marker_icons/coffee.png"),
	        danceclubs: new google.maps.MarkerImage("images/marker_icons/dancinghall.png"),
	        movietheaters: new google.maps.MarkerImage("images/marker_icons/cinema.png"),
	        museums: new google.maps.MarkerImage("images/marker_icons/museum.png"),
	        parks: new google.maps.MarkerImage("images/marker_icons/park.png"),
	        poolhalls: new google.maps.MarkerImage("images/marker_icons/billiard-2.png"),
	        restaurants: new google.maps.MarkerImage("images/marker_icons/restaurant.png"),
	        shopping: new google.maps.MarkerImage("images/marker_icons/shopping.png")
		}
	};

	$(document).ready(function(){
		var venueCollection = new App.Collections.Venues();
		new App.Views.VenueSearch({el: $('#content1'), collection: venueCollection});	
		new App.Views.VenueList({el: $('#slider ul'), collection: venueCollection});
		new App.Views.SearchLoading({el: $('#map-loading img'), collection: venueCollection});	
		new App.Views.AddressSearch({el: $('#addressForm')});	
		new App.Views.PageController({el: $('#maincontainer')});
		new App.Views.PageNumber({el: $('.stepscontainer')});

		App.vent.on('facebook:initialized', function(){
			new App.Views.InviteFriends({el: $('#page3')});
		});
	});	
}());