
class TiaLite < Sinatra::Application
  register Sinatra::ConfigFile
  config_file 'targets.yml'

  # Routes:

  # Index
  get "/" do
    erb :index
  end

  # Posting all the infos
  post "/fetch-my-tia" do
    content_type :json
    if params[:tia].empty? || params[:pass].empty?
      return {:message => "Tia e Senha obrigatorios"}.to_json
    end

    a = Mechanize.new
    a.agent.http.verify_mode = OpenSSL::SSL::VERIFY_NONE
    begin
      a.get(settings.urls[:login]) do |page|

        # Submit the login form
        @tia_main_p = page.form_with(:action => 'verifica.php') do |f|
          f.alumat  = params[:tia]
          f.pass    = params[:pass]
        end.click_button

        if @tia_main_p.uri.to_s == settings.urls[:error]
          return {:status => "Confira o seu usuario e senha"}.to_json
        end

        @absence_p = @tia_main_p.link_with(:href => settings.urls[:absences]).click
        @grades_p = @tia_main_p.link_with(:href => settings.urls[:grades]).click
        @schedule_p = @tia_main_p.link_with(:href => settings.urls[:schedule]).click

        # Getting all the infos:
        @abs = @absence_p.search(".#{settings.targets[:absences]}")
        @grds = @grades_p.search("##{settings.targets[:grades]}")
        @sch = @schedule_p.search("##{settings.targets[:grades]}")

      end
    rescue Net::HTTP::Persistent::Error
      return {:status => "Aguarde um tempo o sistema esta sendo recarregado"}.to_json
    end  
    t = DateTime.now

    return {:status => "OK",:absences => @abs, :grades => @grds, :schedule => @sch, :time => t.strftime('%a, %d %b %Y %H:%M:%S')}.to_json

  end

end
