window.Facebook = (function () {
	var facebookConstructor = function Facebook(appId, channelFile){
		if(false === (this instanceof Facebook)) {
	        return new Facebook();
	    }	    		

		window.fbAsyncInit = function() {
	      FB.init({
	            appId      : appId,                     // App ID
	            channelUrl : channelFile, // Channel File
	            status     : true,                                    // check login status
	            cookie     : true,                                    // enable cookies to allow the server to access the session
	            xfbml      : true                                     // parse XFBML
	          });        
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
	      js.src = "//connect.facebook.net/en_US/all.js";
	      fjs.parentNode.insertBefore(js, fjs);
	    }(document, 'script', 'facebook-jssdk'));
	}

	var permsNeeded = ['create_event', 'publish_stream'];
    	
	function handleBadLoginState(permissions){

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
        }
      });
    };

	function postToFacebook(url, params, onSuccess, onError){
		console.log('Post to ' + url);
		FB.api(
	        url,
	        'post',
	        params,
	        function(response) {
	            if (response.id != null) {
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

		postToFacebook(eventId + '/feed', params, onSuccess, onError);
	}

	return facebookConstructor;
}());