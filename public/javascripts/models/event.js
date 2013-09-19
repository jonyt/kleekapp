// Allowed properties: name, description, location, privacy_type (OPEN, SECRET, FRIENDS)
// See http://developers.facebook.com/docs/reference/api/user/#events 
(function () {	
	var eventModel = Backbone.Model.extend({
        initialize: function(){
            var model = this;
            Facebook.getUsername(function(response){
                model.set('userFirstName', response.first_name);
                model.set('username', response.name);
            }, function(){
                ga('send', 'event', 'event-model', 'get-fb-username', 'error');
                //TODO: report and throw error
            });
        },
		save: function(attributes, options){
                        var model = this,
                            onSuccess = function(eventId){
                                model.set('id', eventId);
                                
                                App.vent.trigger('event:created', model);;

                                var category = model.get('category'),
                                    startTime = new Date(model.get('start_time')),
                                    venue = model.get('name'),    
                                    encodedParams = $.param({
                                        title: model.get('name'),
                                        latitude: model.get('latitude'),
                                        longitude: model.get('longitude'),
                                        icon: window.location.host + App.MarkerIcons[category].url,
                                        address: address,
                                        start_time: model.get('start_time'),           
                                    }),     
                                    mapUrl = (window.location.host.indexOf('localhost') > -1 ?
                                        "http://kleekapp.herokuapp.com/map?" + encodedParams:
                                        'http://' + window.location.host + "/map?" + encodedParams
                                        );                                
                                    
                                //TODO: load picture from kleekapp.com
                                var bitly = new Bitly(),
                                    mapIcon = 'http://icons.iconarchive.com/icons/double-j-design/apple-festival/72/app-map-icon.png';    
                                bitly.shorten(mapUrl, function(shortUrl){
                                        Facebook.postLink(eventId, 
                                            "Here's how to get to " + venue, 
                                            shortUrl, 
                                            mapIcon,
                                            function(){
                                                ga('send', 'event', 'success', 'fb-post-map', '', App.elapsedTime());
                                            }, 
                                            function(error){
                                                ga('send', 'event', 'error', 'fb-post-map', '', App.elapsedTime());
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
                                function(error){
                                    ga('send', 'event', 'fb-module', 'create-event', 'error', error);
                                }
                        );
		},
        inviteFriends: function(friendIds, options){
            var onSuccess = function(){
                    ga('send', 'event', 'fb-invite-friends', 'success', '', friendIds);
                    if (typeof options.success == 'function'){
                        options.success.call(this);
                    }
                },
                onError = function(){
                    ga('send', 'event', 'fb-invite-friends', 'error');
                    if (typeof options.error == 'function'){
                        options.error.call(this);
                    }
                };
            Facebook.inviteFriends(this.get('id'), friendIds, onSuccess, onError);
        }
	});
	
	App.Models.Event = eventModel;	
}());