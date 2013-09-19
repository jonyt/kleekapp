window.Facebook = (function () {

	var permsNeeded = ['create_event', 'publish_stream'];
    	
	function handleBadLoginState(permissions){
		ga('send', 'event', 'error', 'handleBadLoginState', 'handleBadLoginState', App.elapsedTime());
	}

    // Function that checks needed user permissions
    function checkPermissions() {
      FB.api('/me/permissions', function(response) {
        var permsArray = response.data[0];

        var permsToPrompt = [];
        for (var i in permsNeeded) {
          if (permsArray[permsNeeded[i]] == null) {
            permsToPrompt.push(permsNeeded[i]);
          }
        }
        
        if (permsToPrompt.length > 0) {
          handleBadLoginState(permsToPrompt);
        } else {
        	var counter = 0,
	      	    timer = setInterval(function(){
			      	if (typeof App != 'undefined'){
			      		clearInterval(timer);
			      		App.vent.trigger('facebook:initialized');           
			      	} else if (counter > 1000){
			      		clearInterval(timer);
			      		ga('send', 'event', 'fb-module', 'init', 'error', 'too many attempts');
			        } else {
			      		counter++;
			      	}
			    }, 20);
        }
      });
    };

	var facebookConstructor = function Facebook(appId, channelFile){
		if(false === (this instanceof Facebook)) {
	        return new Facebook();
	    }	    		

		window.fbAsyncInit = function() {
	      /*FB.init({
	            appId      : appId,                     // App ID
	            channelUrl : channelFile, // Channel File
	            status     : true,                                    // check login status
	            cookie     : true,                                    // enable cookies to allow the server to access the session
	            xfbml      : true                                     // parse XFBML
	          });*/ 	      

	      FB.getLoginStatus(function(response) {
	        if (response.status === 'connected') {
	          checkPermissions();
	        } else if (response.status === 'not_authorized') {
	          handleBadLoginState(permsNeeded);
	        } else {
	          handleBadLoginState(permsNeeded);
	        }
	      });
			
	      FB.Canvas.setAutoGrow();
	    };

	    // Load the SDK Asynchronously
	    (function(d, s, id) {
	      var js, fjs = d.getElementsByTagName(s)[0];
	      if (d.getElementById(id)) return;
	      js = d.createElement(s); js.id = id;
	      js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&status=0&appId=" + appId;
	      fjs.parentNode.insertBefore(js, fjs);
	    }(document, 'script', 'facebook-jssdk'));
	}	

	function postToFacebook(url, params, onSuccess, onError){
		FB.api(
	        url,
	        'post',
	        params,
	        function(response) {
	            if (response.id != null || response === true) {
	                onSuccess(response.id);
	            }
	            if (response.error != null) {
	                onError(response.error);
	            }
	        }
	    );
	}

	facebookConstructor.prototype.createEvent = function(eventName, description, venueName, address, privacy_type, start_time, onSuccess, onError){
		var params = {
			name: eventName,
			description: description,
			location: venueName + ', ' + address,
			privacy_type: privacy_type,
			start_time: start_time
		};

		postToFacebook('/me/events', params, onSuccess, onError);
	}

	facebookConstructor.prototype.postLink = function(eventId, message, link, picture, onSuccess, onError){
		var params = {
			message: message,
			link: link,
			picture: picture
		};

		postToFacebook('/' + eventId + '/feed', params, onSuccess, onError);
	}

	facebookConstructor.prototype.inviteFriends = function(eventId, friendIds, onSuccess, onError){		
		postToFacebook(eventId + '/invited?users=' + friendIds.join(','), {}, onSuccess, onError);
	}

	facebookConstructor.prototype.getUsername = function(onSuccess, onError){
		FB.api('/me', function(response){
			if (typeof response != 'undefined' && typeof response.name != undefined){
				onSuccess.call(this, response);
			} else {
				onError.call(this);
			}
		});
	}

	facebookConstructor.prototype.inviteFriendsToApp = function(){
		FB.ui({ 
			method: 'apprequests', 
			title: 'If you like Kleek, please invite your friends.',
			message: 'Kleek is free to use, we would really appreciate it if you could invite your friends.',
			filters: ['app_non_users']
		}, function(response){
			if (response == null){
				ga('send', 'event', 'fb-invite_dialog', 'cancel');
			} else {
				// report to GA, response.to.join() is a comma separated string of invitee IDs
				ga('send', 'event', 'fb-invite_dialog', 'send', '', response.to.join(', '));
			}			
		});
	}

	return facebookConstructor;
}());