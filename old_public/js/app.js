$(function(){
    var ajaxingTia = {};

	 //Ajaxing Method;
	 var params = {};
	 ajaxingTia = {
		init : function(){
		   return this.posting();
		},

		getParams : function(){
			$.each($('form input[type=text],form input[type=password]'),function(){
				params[$(this).attr('name')] = $(this).val();
			})
			return params;
		},

		posting : function(){
			$.post($('form').attr('action'),this.getParams(),
			//Ajax callback
			function(data){
				$('.info-container').html(data);
				// $('.info-container').show();
		
				localStorage.setItem('tia_data',data);
		
				$('.loader').hide();

				//Switching view;
				$('.dashboard').show();
				$('#login-area').hide()

				freezeRefresh('.refresh');

				//Removing attributes from the table
        $('table tr td').removeAttr('height')
        $('table tr td').removeAttr('width')
        $('table tr td div').removeAttr('align')

			})
		}
	}

  var SwitchView = function(el){
    if (el.is(':visible')) {
      el.hide();
    } else {
      el.show();
    }
    
  }
	

    if (localStorage.getItem('login_flag') == 'true') {
        $('.info-container').html(localStorage.getItem('tia_data'));


        //Switching view;
        // $('input[type=submit]').hide();
		$('#login-area').hide();
        $('.dashboard').show();

    }

    //Clicking
    $('input[type=submit]').click(function(e){
        e.preventDefault();
        
        localStorage.setItem('login_flag','true');
            
        ajaxingTia.init();
        $('.loader').show();
        $('input[type=submit]').hide();

        return false;
     });
    
    
    //Dashboar Actions :
        //Pausing the refresh button;
        var freezeRefresh = function(el){

            $(el).addClass('freezed');

            setTimeout(function(){
                $(el).removeClass('freezed');
            },5000);

        } 
        
        //Refresh buton;      
        $('.refresh').click(function(){
            ajaxingTia.init();

            //Switching views;
            $('.loader').show();
            freezeRefresh(this);


            return false;
        })
        
        // Logout click
        $('.logout').live('click',function(){
            $('.info-container').html('');
            localStorage.clear();        
			$('#login-area').show()

            //Switching view;
            // $('input[type=submit]').show();
            $('.dashboard').hide();
            
            return false;
        });

        $('body').ajaxError(function(){
            $('.alert-holder').show();
            $('.loader').hide();
            localStorage.setItem('login_flag','false');
        })
        
        

        
            //When loads the page the ajax is called;    
            // ajaxingTia.init();
   
})
