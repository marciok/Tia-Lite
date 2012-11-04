var TiaLite = {
  init : function(){
    this.logout('.logout');
    this.login('.login-form');
    this.refreshBt('.refresh');
    this.gradesWeight('.grades-weight');

    $('refresh-date').html(localStorage.getItem('time'));

    $('.save-infos').attr('checked',true) 
    if (localStorage.getItem('login')) {
      $('.navbar').slideDown();

      $('#grades').html(localStorage.getItem('grades'));
      $('#absences').html(localStorage.getItem('absences'));
      $('#schedule').html(localStorage.getItem('schedule'));

      $('.container').css({ width : 900 })

      $('#content-area').show();
      
      $('#tia').val(localStorage.getItem('tia'))
      $('#pass').val(localStorage.getItem('pass'))


      $('.login-form').submit();

    } else {
      $('#login-area').fadeIn();
    }
  },

  helpers : {
    clearTableAttrs : function(table,attrs){
      $.each(attrs,function(i){
        $(table+' *, '+table).removeAttr(attrs[i]);
      })
    },

    validate : function(fields){
      $.each(fields,function(i){
          _this = $(fields[i]);
        if (_this.val() == ""){
          _this.addClass('empty').attr('data-content','O campo '+_this.attr('placeholder')+' precisa ser preenchido').attr('data-title','Validação!');
          _this.popover('show');
        } else {
          _this.removeClass('empty')
        }
      })
    }

  },


  gradesWeight : function(bt){
    $(bt).click(function(e){
      e.preventDefault();
      $('#grades table:nth-child(2)').slideToggle();
    })
  },

  refreshBt : function(bt){
    $(bt).click(function(e){
      $(this).button('loading');
      e.preventDefault();
      $('.login-form').submit();
    })
  },

  logout : function(bt){
    $(bt).click(function(e){
      e.preventDefault();
      localStorage.clear();
      location.reload();
    })
  },


  login : function(form){
    $(form).ajaxForm({
      beforeSubmit : function(){

        TiaLite.helpers.validate(['#tia','#pass']);
        if ($(form+' input').hasClass('empty')) {
          return false;
        }

        $('#login-area').fadeOut(function(){
          $('#loader').fadeIn();
        })

        if ($('.save-infos').is(':checked')){
          localStorage.setItem('login',true)
        }

      },
      success : function(data){
        if (data.status == "OK") {
          
          $('.refresh-date').html(data.time)
          $('.refresh').button('reset')
          // TODO: make this on server side
          if (data.grades == undefined) {
            $('.alert p').text('Ops não foi possível achar as suas Notas :( ');
            $('.alert').slideDown();
          } else if (data.absences == undefined){
            $('.alert p').text('Ops não foi possível achar as suas Faltas :( ');
            $('.alert').slideDown();
          }

          $('.navbar').slideDown();
          

        
          //Just a draft
          $('#loader').fadeOut(function(){
            $('#content-area').fadeIn(function(){
            $('refresh-date').html(data.time);
              
              $('.container').animate({
                width : 900
              },function(){
                $('#grades').html(data.grades);
                $('#absences').html(data.absences);
                $('#schedule').html(data.schedule);

                //Removing tables atributes;
                var notWanted = ['id','width','cellpadding','cellspacing','align','colspan','width','class','bgcolor','height','tabelaemgeral']
                //Absences
                TiaLite.helpers.clearTableAttrs('#absences table',notWanted);
                
                //Grades
                TiaLite.helpers.clearTableAttrs('#grades table',notWanted);

                //Schedule
                TiaLite.helpers.clearTableAttrs('#schedule table',notWanted);

                $('#schedule table').prepend('<tr class="period"><th colspan="7">');

                $('#schedule table:first .period th').text('Manhã');
                $('#schedule table:nth-child(2) .period th').text('Tarde');
                $('#schedule table:nth-child(3) .period th').text('Noite');

                $('#grades, #absences, #schedule').slideDown('slow');
                $('#grades, #absences, #schedule').children('table').addClass('table table-striped')
                

                  //LocalStorage Setting
                if (localStorage.getItem('login')) {

                  localStorage.setItem('time',data.time)
                  localStorage.setItem('tia',$('#tia').val())
                  localStorage.setItem('pass',$('#pass').val())

                  localStorage.setItem('grades',$('#grades').html())
                  localStorage.setItem('absences',$('#absences').html())
                  localStorage.setItem('schedule',$('#schedule').html())

                }

                

              })
            });
          });
        } else {
          $('#loader').hide();
          $('#login-area').fadeIn();
          $('.alert p').html(data.status);
          $('.alert').fadeIn();
        }
      },

      error : function(){
        $('#login-area').fadeIn();
        $('.alert p').html("Ocorreu algum erro com o sistema em todo em caso existe a <a href='www.mackenzie.com.br'>maneira tradicional</a>");
        $('.alert').fadeIn();
        
      }
    })
  }
}


$(function(){
  TiaLite.init();
})
