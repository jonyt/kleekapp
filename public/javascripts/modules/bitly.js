window.Bitly = (function () {
	var bitlyConstructor = function Bitly(){
		if(false === (this instanceof Bitly)) {
	        return new Bitly();
	    }	

		var bitlyUrl = (window.location.protocol == 'http:' ? 
			'http://api.bitly.com/v3/shorten' : 
			'https://api-ssl.bitly.com/v3/shorten'
		);

		bitlyConstructor.prototype.shorten = function(url, onSuccess, onError){
			$.ajax({
				url: bitlyUrl,
				dataType: 'jsonp',
				data: { 
					longUrl: url, 
					login: 'johnny1941',
					apiKey: 'R_560232685a3e47ab91307b917b0990a8',
					format: 'json'
				},
				success: function(response){ 
					onSuccess(response.data.url); 
				},
				error: function(error){ 
					ga('send', 'event', 'bitly', 'shorten', 'error', error);
				}
			}); 
		}
	}	   

	return bitlyConstructor;
}());