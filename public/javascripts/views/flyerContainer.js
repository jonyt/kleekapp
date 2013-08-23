(function () {
	var flyerContainer = Backbone.View.extend({		
		initialize: function(options){
			this.flyerContainer = this.$('.mainflyer');
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
        		return this.monthNamesShort[date.getMonth()].toLowerCase() + ' <span>' + 
        			date.getDate() + '</span><p>' + this.dayNamesShort[date.getDay()];
        	}
        ],
        events: {
			'click .flyers': function(e){
				var $target = ($(e.target).prop('tagName') == 'div' ? $(e.target) : $(e.target).parents('.flyers').eq(0)),
					index = this.$('.flyers').index($target),
					template = $('#flyer' + (index + 1) + '-template'),
					timeFormatCallback,
					dateFormatCallback = this.dateFormatCallbacks[index];

				ga('send', 'event', 'interaction', 'flyer-thumbnail-select', '' + index, App.elapsedTime());						
					
				switch(index){
				case 0:
				case 1:
				  timeFormatCallback = this.timeFormatCallbacks[0];
				  break;
				case 2:
				  timeFormatCallback = this.timeFormatCallbacks[1];
				  break;
				case 3:
				  timeFormatCallback = this.timeFormatCallbacks[2];
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
			},
			'click .chooseflyer': function(e){
				ga('send', 'event', 'interaction', 'flyer-select', '', App.elapsedTime());					

				this.$('.flyertext').fadeOut();
				this.$('.flyerholder').fadeOut();
				$(e.target).fadeOut();
				this.flyerContainer.animate({left: 135});
				Facebook.inviteFriendsToApp();				
			}
		}
	});

	App.Views.FlyerContainer = flyerContainer;
}());