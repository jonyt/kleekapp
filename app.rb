require 'sinatra/base'
require 'koala'
require 'json'

class App < Sinatra::Base
  include ERB::Util

  FB_SCOPE = 'create_event,publish_stream'

  set :protection, :except => [:frame_options, :session_hijacking]
  enable :static

  get "/" do
    puts "********** PARAMS #{params.inspect}"
    if params.has_key?('code')
      puts "GOT ITTTTTTTTTT"
      token = authenticator.get_access_token(params['code'])
      puts "^^^^ TOKEN #{token.inspect}"
    else
      puts "REDIRECTTTTTTTTTTT"
      redirect authenticator.url_for_oauth_code(:permissions => FB_SCOPE)
    end
    # if access_token_from_cookie.nil? 
    #   puts "()()))))))))))))((((((((((( #{CGI.escape(url('/'))}"               
    #   redirect authenticator.url_for_oauth_code(:permissions => FB_SCOPE)
    # end
    # puts authenticator.url_for_oauth_code(:permissions => FB_SCOPE, :callback => url)
    @app_id = app_id
    @redirect_url = url('/app/')
    erb :index
  end

  # used by Canvas apps - redirect the POST to be a regular GET
  post "/" do
    signed_request = params['signed_request']    
    token = ''
    begin
      parsed_request = authenticator.parse_signed_request(signed_request)
      token = parsed_request['oauth_token']      
    rescue 
      begin
        split_signed_request = signed_request.split(/\./)
        json_string = split_signed_request[1].tr('-_','+/').unpack('m')[0]
        json = JSON.parse(json_string)
        token = json['oauth_token']    
      rescue 
        token = json_string.scan(/\"oauth_token\":\"(.+?)\"/)[0][0]  
      end
    end
    
    graph = Koala::Facebook::API.new(token)
    permissions = graph.get_connections('me','permissions')
    puts permissions.inspect
    if !permissions.nil? && permissions.is_a?(Array)
      puts "1111111"
      permission_hash = permissions.first
      puts permission_hash.inspect
      if permission_hash.size >= 2 && permission_hash.has_key?('create_event') && permission_hash.has_key?('publish_stream')
        erb :app
      end
    end
    # REPLY: [{"installed"=>1, "basic_info"=>1, "status_update"=>1, "photo_upload"=>1, "video_upload"=>1, "create_event"=>1, "create_note"=>1, "share_item"=>1, "publish_stream"=>1, "publish_actions"=>1, "bookmarked"=>1}]
    # TODO: verify all permissions OK, if not render index.erb (with message?), if yes render app.erb
    erb :index
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

    def got_permissions?
      puts graph.get_connections('me','permissions').inspect
    end

    def graph
      @graph ||= Koala::Facebook::API.new
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

    def app_id
      ENV["FACEBOOK_APP_ID"] || '177298079073438'
    end

    def app_secret
      ENV["FACEBOOK_SECRET"] || '42de211dcb6c66c7bf57442420bc22ef'
    end

    def authenticator
      @authenticator ||= Koala::Facebook::OAuth.new(app_id, app_secret, 'http://localhost:9292/')
    end

    # allow for javascript authentication
    def access_token_from_cookie
      puts "!!!!!!!! AUTHENTICATOR #{authenticator.inspect}"
      puts "$$$$$$$$ COOKIES       #{request.cookies.inspect}"
      puts "@@@@@@@@ INFO          #{authenticator.get_user_info_from_cookies(request.cookies).inspect}"
      authenticator.get_user_info_from_cookies(request.cookies)['access_token']
    rescue => err
      puts err.inspect
    end

    def access_token
      session[:access_token] || access_token_from_cookie
    end

  end
end  