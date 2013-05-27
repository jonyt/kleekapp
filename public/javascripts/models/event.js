// Allowed properties: name, description, location, privacy_type (OPEN, SECRET, FRIENDS)
// See http://developers.facebook.com/docs/reference/api/user/#events 
(function () {	
	var eventModel = Backbone.Model.extend({
		save: function(attributes, options){
                        var model = this,
                            onSuccess = function(eventId){
                                console.log(model.attributes);
                                model.set('id', eventId);
                                
                                var category = model.get('categories')[0].category_filter,
                                    startTime = new Date(model.get('start_time')),    
                                    encodedParams = $.param({
                                        title: model.get('name'),
                                        latitude: model.get('latitude'),
                                        longitude: model.get('longitude'),
                                        icon: window.location.host + App.MarkerIcons[category].url,
                                        address: address,
                                        year: startTime.getUTCFullYear(),
                                        month: startTime.getUTCMonth(),
                                        day: startTime.getUTCDate(),
                                        hour: startTime.getUTCHours(),
                                        minute: startTime.getUTCMinutes()           
                                    }),     
                                    mapUrl = "http://" + window.location.host + "/map?" + encodedParams;

                                var bitly = new Bitly();
                                bitly.shorten(mapUrl, function(shortUrl){
                                        Facebook.postLink(eventId, 'How to get there', shortUrl, function(){}, function(error){
                                                console.log(error);
                                        })
                                });                                        
                            };

                        Facebook.createEvent(
                                this.get('eventName'), 
                                this.get('description'),
                                this.get('name'),
                                this.get('address'),
                                this.get('privacy_type'),
                                this.get('start_time'),
                                onSuccess,
                                function(error){console.log(error)}
                        );
		}
	});
	
	App.Models.Event = eventModel;	
}());