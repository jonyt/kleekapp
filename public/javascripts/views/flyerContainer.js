(function () {
	var flyerContainer = Backbone.View.extend({		
		initialize: function(options){
			this.flyerContainer = this.$('.mainflyer');
		},
		events: {
			'click .flyers': function(e){
				var index = this.$('.flyers').index(e.target),
					template = $('#flyer' + (index + 1) + '-template'),
					timeFormatCallback,
					dateFormatCallback = dateFormatCallbacks[index];
				switch(index){
				case 0:
				case 1:
				  timeFormatCallback = timeFormatCallbacks[0];
				  break;
				case 2:
				  timeFormatCallback = timeFormatCallbacks[1];
				  break;
				case 3:
				  timeFormatCallback = timeFormatCallbacks[2];
				  break;    
				default:
				  throw 'Unknown index: ' + index;
				}

				if (typeof this.currentFlyer != 'undefined'){
					this.currentFlyer.remove();
				}
				var flyerView = new App.Views.Flyer({
					template: template, 
					model: this.model,
					formatDate: dateFormatCallback,
					formatTime: timeFormatCallback
				});
				this.currentFlyer = flyerView;
				this.flyerContainer.html(flyerView.render());	
			}
		},
		timeFormatCallbacks: [ //TODO: probably adjust to timezone
			function(date){
				return this.formatAMPM(date).toUpperCase();
			},
			function(date){
				return this.formatAMPM(date);
			},
			function(date){
				return this.formatAMPM(date).replace(/([AP]M)/, "<span>$1</span>");
			}
		],
		formatAMPM: function(date) {
			var hours = date.getHours();
			var minutes = date.getMinutes();
			var ampm = hours >= 12 ? 'pm' : 'am';
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
        dateFormatCallbacks: [
        	function(date){
        		return this.dayNames[date.getDay()].toLowerCase() + ' ' + 
        			this.monthNamesShort[date.getMonth()].toLowerCase() + '. ' + date.getDate();
        	},
        	function(date){
        		return this.dayNames[date.getDay()].toLowerCase() + ' ' + date.getDate() + 
        			this.monthNames[date.getMonth()];
        	},
        	function(date){
        		return this.dayNames[date.getDay()].toLowerCase() + ' ' + 
        			this.monthNames[date.getMonth()].toLowerCase() + '. ' + date.getDate();
        	},
        	function(date){
        		return this.monthNamesShort[this.getMonth()].toLowerCase() + ' <span>' + 
        			date.getDate() + '</span><p>' + this.dayNamesShort[date.getDay()];
        	}
        ]
	});

	App.Views.FlyerContainer = flyerContainer;
}());