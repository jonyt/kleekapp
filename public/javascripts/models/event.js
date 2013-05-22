// Allowed properties: name, description, location, privacy_type (OPEN, SECRET, FRIENDS)
// See http://developers.facebook.com/docs/reference/api/user/#events 
(function () {	
	var eventModel = Backbone.Model.extend({
                urlRoot: '/me/events',
		save: function(attributes, options){
			var params = {
        			name: this.get('eventName'),
        			description: this.get('description'),
        			location: this.get('name') + ', ' + this.get('address'),
        			privacy_type: this.get('privacy_type'),
        			start_time: this.get('start_time')
        		};
                        if (options.success) options.success();
                        
			/*FB.api(
        		'/me/events',
        		'post',
        		params,
        		function(response) {

        		}
        	);*/
		}
	});
	
	App.Models.Event = eventModel;	
}());