(function () {
	var flyer = Backbone.View.extend({		
		initialize: function(options){	
			this.formatDate = options.formatDate;
			this.formatTime = options.formatTime;
			this.compiledTemplate = _.template(this.template.html());					
		},
		render: function(){
			var html = this.compiledTemplate({
				owner: this.model.get('userFirstName'),
				title: this.model.get('eventName'),
				venue: this.model.get('name'),
				address: this.model.get('address'),
				formattedTime: this.formatTime.call(this, new Date(this.model.get('start_time'))),
				formattedDate: this.formatDate.call(this, new Date(this.model.get('start_time')))
			});
		}
	});

	App.Views.Flyer = flyer;
}());