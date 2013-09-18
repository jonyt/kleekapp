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
				return this.formatAMPM(date).replace(/([AP]M)/i, "<span>$1</span>");
			},
			function(date){ // Really ugly hack here to conform to CSS rules in flyers.css
				return this.formatAMPM(date).replace(/([AP]M)/i, "</p><span>$1</span><p>");
			}
		],		
        dateFormatCallbacks: [
        	function(date){
        		return this.dayNames[date.getDay()].toLowerCase() + ' ' + 
        			this.monthNamesShort[date.getMonth()].toLowerCase() + '. ' + date.getDate();
        	},
        	function(date){
        		return this.dayNamesShort[date.getDay()].toLowerCase() + ' ' + date.getDate() + ' ' + 
        			this.monthNamesShort[date.getMonth()];
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
				  timeFormatCallback = this.timeFormatCallbacks[3];
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
				this.currentFlyerIndex = index;
				this.flyerContainer.html(flyerView.render());

				this.$('.chooseflyer').css({visibility: 'visible'});
			},
			'click .chooseflyer': function(e){
				ga('send', 'event', 'interaction', 'flyer-select', '', App.elapsedTime());									

				var flyerParams = {
					flyer_num: this.currentFlyerIndex + 1,
					title: this.model.get('eventName'),
					start_time: this.model.get('start_time'),
					venue: this.model.get('name'),
					address: this.model.get('address'),
					username: this.model.get('username'),
					user_first_name: this.model.get('userFirstName')
				},
				eventId = this.model.get('id'),
				flyerUrl = (window.location.host.indexOf('localhost') > -1 ?
                            "http://stormy-sands-3246.herokuapp.com/flyer?" + $.param(flyerParams):
                            'http://' + window.location.host + "/flyer?" + $.param(flyerParams)
                            ); 

				console.log(flyerUrl);
				// TODO change shorten to static method
				new Bitly().shorten(
					flyerUrl,
					function(shortUrl){
	                    Facebook.postLink(eventId, 
	                        "Here's a flyer for the event", 
	                        shortUrl, 
	                        undefined,
	                        function(){
	                        	ga('send', 'event', 'success', 'fb-post-flyer', '', App.elapsedTime());
	                        }, 
	                        function(error){
	                            ga('send', 'event', 'error', 'fb-post-flyer', '', App.elapsedTime());
	                        })
                    },
                    function(){
                    	ga('send', 'event', 'error', 'bitly-flyer', '', App.elapsedTime());
                    }
                );

				this.$('.flyertext').fadeOut();
				this.$('.flyerholder').fadeOut();
				$(e.target).fadeOut();
				this.flyerContainer.animate({left: 135});
				this.flyerContainer.wrap(
					$('<a />', {href: 'https://www.facebook.com/events/' + this.model.get('id')})
				);
				Facebook.inviteFriendsToApp();				
			}
		}
	});

	App.Views.FlyerContainer = flyerContainer;
}());