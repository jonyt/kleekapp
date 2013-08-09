(function () {
	var flyer = Backbone.View.extend({		
		initialize: function(options){	
			this.formatDate = options.formatDate;
			this.formatTime = options.formatTime;
			this.compiledTemplate = _.template(options.template.html());					
		},
		formatAMPM: function(date) {
			var hours = date.getHours(),
				minutes = date.getMinutes(),
			    ampm = hours >= 12 ? 'pm' : 'am';
			hours = hours % 12;
			hours = hours ? hours : 12; // the hour '0' should be '12'
			minutes = minutes < 10 ? '0'+minutes : minutes;
			var strTime = hours + ':' + minutes + ' ' + ampm;
			return strTime;
		},
		monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        dayNames: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
        dayNamesShort: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
		render: function(){
			var html = this.compiledTemplate({
				owner: this.model.get('userFirstName'),
				title: this.model.get('eventName'),
				venue: this.model.get('name'),
				address: this.model.get('address'),
				formattedTime: this.formatTime.call(this, new Date(this.model.get('start_time'))),
				formattedDate: this.formatDate.call(this, new Date(this.model.get('start_time')))
			});

			return html;
		}
	});

	App.Views.Flyer = flyer;
}());