require 'sinatra/base'
require 'koala'

class App < Sinatra::Base
  include ERB::Util

  set :protection, :except => [:frame_options, :session_hijacking]
  enable :static

  get "/" do
    @app_id = app_id
    @redirect_url = url('/app/')
    erb :index
  end

  # used by Canvas apps - redirect the POST to be a regular GET
  post "/" do
    redirect "/"
  end

  get "/app/" do
    @app_id = app_id
    @ga_setup_string = ga_setup_string

    erb :app
  end

  # used by Canvas apps - redirect the POST to be a regular GET
  post "/app/" do
    redirect "/app"
  end

  helpers do
    def app_id
      ENV["FACEBOOK_APP_ID"] || '177298079073438'
    end

    def ga_setup_string
      ga_id = ENV["GA_ID"] || 'UA-43442670-1'
      ga_host = (host.match(/localhost/) ? "{'cookieDomain': 'none'}" : 'kleekapp.com')
      "ga('create', '#{ga_id}', #{ga_host});"
    end

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