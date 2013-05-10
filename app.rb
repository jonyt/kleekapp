require 'sinatra/base'
require 'koala'

class App < Sinatra::Base
  include ERB::Util

  get "/" do
    @app_id = ENV["FACEBOOK_APP_ID"] || '177298079073438'
    
    erb :index
  end

  # used by Canvas apps - redirect the POST to be a regular GET
  post "/" do
    redirect "/"
  end

  helpers do
    def host
      request.env['HTTP_HOST']
    end

    def scheme
      request.scheme
    end

    def url_no_scheme(path = '')
      "//#{host}#{path}"
    end

    def url(path = '')
      "#{scheme}://#{host}#{path}"
    end

    def authenticator
      @authenticator ||= Koala::Facebook::OAuth.new(ENV["FACEBOOK_APP_ID"], ENV["FACEBOOK_SECRET"], url("/auth/facebook/callback"))
    end

    # allow for javascript authentication
    def access_token_from_cookie
      authenticator.get_user_info_from_cookies(request.cookies)['access_token']
    rescue => err
      warn err.message
    end

    def access_token
      session[:access_token] || access_token_from_cookie
    end

  end
end  