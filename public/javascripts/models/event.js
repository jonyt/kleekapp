// Allowed properties: name, description, location, privacy_type (OPEN, SECRET, FRIENDS)
(function () {	
	var eventModel = Backbone.Model.extend({
	});
	
	App.Models.Event = eventModel;	
}());