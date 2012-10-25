
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

    a = Mechanize.new
    a.agent.http.verify_mode = OpenSSL::SSL::VERIFY_NONE
    a.get(settings.urls[:login]) do |page|

      # Submit the login form
      @tia_main_p = page.form_with(:action => 'verifica.php') do |f|
        f.alumat  = params[:tia]
        f.pass    = params[:pass]
      end.click_button

      @absence_p = @tia_main_p.link_with(:href => settings.urls[:absences]).click
      @grades_p = @tia_main_p.link_with(:href => settings.urls[:grades]).click

      #geting all the infos:
      @abs = @absence_p.search(".#{settings.targets[:absences]}")
      @grds = @grades_p.search("##{settings.targets[:grades]}")

    end


    return {:abcenses => @abs, :grades => @grds}.to_json

  end

end
