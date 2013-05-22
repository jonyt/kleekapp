// Allowed properties: name, description, location, privacy_type (OPEN, SECRET, FRIENDS)
// See http://developers.facebook.com/docs/reference/api/user/#events 
(function () {	
	var eventModel = Backbone.Model.extend({
		sync: function(method, model, options){
			var params = {
        			name: this.get('eventName'),
        			description: this.get('description'),
        			location: this.get('name') + ', ' + this.get('address'),
        			privacy_type: this.get('privacy_type'),
        			start_time: this.get('start_time')
        		};
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