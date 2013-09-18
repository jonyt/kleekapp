require 'sinatra/base'
require 'koala'
require 'json'
require 'time'

class App < Sinatra::Base
  include ERB::Util

  FB_SCOPE = 'create_event,publish_stream'
  
  MAP_WIDTH  = 597
  MAP_HEIGHT = 419
  
  map_param_names   = ['title', 'address', 'icon', 'latitude', 'longitude', 'start_time'].freeze
  flyer_param_names = ['title', 'address', 'flyer_num', 'venue', 'username', 'user_first_name', 'start_time'].freeze

  set :protection, :except => [:frame_options, :session_hijacking]
  enable :static

  get "/" do
    @app_id = app_id
    if params.has_key?('code')
      token = authenticator.get_access_token(params['code'])
      return (permissions_ok?(token) ? (erb :app) : (erb :index))
    else
      @redirect_url = url('/')
      erb :index
    end        
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
    
    return (permissions_ok?(token) ? (erb :app) : (erb :index))
  end

  get '/map' do
    if (!has_all_params?(params, map_param_names))
        raise Sinatra::NotFound
    else
        @map_url = "http://maps.googleapis.com/maps/api/staticmap?size=#{MAP_WIDTH}x#{MAP_HEIGHT}&markers=icon:#{params[:icon]}|#{params[:latitude]},#{params[:longitude]}&sensor=false"
        @title = params[:title]
        @address = params[:address]
        @time = Time.parse(params[:start_time])
        erb :map, :layout => 'flyers/layout'.to_sym
    end
  end


  get '/flyer' do
    @ga_setup_string = ga_setup_string
    if (!has_all_params?(params, flyer_param_names))
      puts "!!!!!!!!!!!! #{(params.keys - flyer_param_names).inspect}, #{(flyer_param_names - params.keys).inspect}"
      raise Sinatra::NotFound
    else
      flyer_num = params[:flyer_num]
      @name = params[:username]
      @first_name = params[:user_first_name]
      @title = params[:title]
      @time = Time.parse(params[:start_time])
      @address = params[:address]
      @venue = params[:venue]

      puts "flyers/flyer#{flyer_num}".to_sym

      erb "flyers/flyer#{flyer_num}".to_sym, :layout => 'flyers/layout'.to_sym
    end
  end

  not_found do
    send_file File.join('public', '404.html')
  end

  error do
    send_file File.join('public', '500.html')
  end

  helpers do    
    def has_all_params?(params, param_names)
      param_names.each do |param_name|
        return false if !params.has_key?(param_name)
      end

      return true
    end

    def permissions_ok?(token)
      begin
        graph = Koala::Facebook::API.new(token)
        permissions = graph.get_connections('me','permissions')
        if !permissions.nil? && permissions.is_a?(Array)
          permission_hash = permissions.first      
          if permission_hash.size >= 2 && permission_hash.has_key?('create_event') && permission_hash.has_key?('publish_stream')
            return true
          end
        end  
      rescue Exception => e
        return false  
      end
      
      return false
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

  end
end  