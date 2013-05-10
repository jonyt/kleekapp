(function () {
	var venues = Backbone.Collection.extend({
		model: App.Models.Venue,
		url: 'http://api.yelp.com/business_review_search',
	    initialize: function(models, options){
	    },
	    fetch: function(options){
	    	var mapBounds = options.mapBounds,
	    		category = options.category,
	    		params = {
					category : category,
					tl_lat   : mapBounds.getNorthEast().lat(),
					tl_long  : mapBounds.getSouthWest().lng(),
					br_lat   : mapBounds.getSouthWest().lat(),
					br_long  : mapBounds.getNorthEast().lng(),
					ywsid	 : '3qfqul7yP4H-OS8eaN0Yiw',
					limit	 : 15
				},
				collection = this;

		    $.ajax({
		        url: this.url,
		        dataType: 'jsonp',
		        data: params,
		        success : function(data) {
		            collection.reset(data.businesses)
		        }
		    });	
	    }
	});

	App.Collections.Venues = venues;
}());