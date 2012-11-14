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
      $('.refresh-date').html(localStorage.getItem('time'));

      $('.container').css({ width : 900 });

      $('#content-area').show();
      
      $('#tia').val(localStorage.getItem('tia'));
      $('#pass').val(localStorage.getItem('pass'));


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
    },

    weekDay : function(){
      var d = new Date();
        
      switch (d.getDay()) {
        case 0:
          $('.monday a').click();
        case 1:
          $('.tuesday a').click();
        case 2:
          $('.wenesday a').click();
        case 3:
          $('.thursday a').click();
        case 4:
          $('.friday a').click();
        case 5:
          $('.saturday a').click();
        default:
          $('.monday a').click();
      }
    },

    tabsAction : function(el){
       $(el+' a').click(function(event){
         event.preventDefault();
         $(el+' a i').removeClass('icon-minus').addClass('icon-plus');
         $(this).children().removeClass('icon-plus').addClass('icon-minus');
         $(el+' ul').hide();
         $(this).tab('show').parent().children('ul').show();
       })
    },

  transSchedule : function(table){

    var time = $(table+' tr:not(:nth-child(1)) td:first-child')

    //Cleaning tables
     $('.week li ul').html('')

     var removeTrace = function(el){
       if (el == '--') {
         return false
       } else {
         return el
       }
     }

    $.each(time,function(){

        var _this = $(this)

        var monday_class   = _this.next();
        var tuesday_class  = monday_class.next();
        var wenesday_class = tuesday_class.next();
        var thursday_class = wenesday_class.next();
        var friday_class   = thursday_class.next();
        var saturday_class = friday_class.next();


        if (removeTrace(monday_class.text())) {
          $('.week li:first-child  ul').append('<li>'+_this.text()+' - '+monday_class.text())
        }

        if (removeTrace(tuesday_class.text())) {
          $('.week li:nth-child(2) ul').append('<li>'+_this.text()+' - '+tuesday_class.text())
        }

        if (removeTrace(wenesday_class.text())) {
          $('.week li:nth-child(3) ul').append('<li>'+_this.text()+' - '+wenesday_class.text())
        }

        if (removeTrace(thursday_class.text())) {
          $('.week li:nth-child(4) ul').append('<li>'+_this.text()+' - '+thursday_class.text())
        }

        if (removeTrace(friday_class.text())) {
          $('.week li:nth-child(5) ul').append('<li>'+_this.text()+' - '+friday_class.text())
        }

        if (removeTrace(saturday_class.text())) {
          $('.week li:nth-child(6) ul').append('<li>'+_this.text()+' - '+saturday_class.text())
        }
        
      });
    }

  },


  gradesWeight : function(bt){
    $(bt).click(function(e){
      e.preventDefault();

      var icon = $(this).children('i')

      if ( icon.hasClass('icon-plus') ){
        icon.removeClass('icon-plus').addClass('icon-minus')
      }    
      else {
        icon.removeClass('icon-minus').addClass('icon-plus')
      }
      
      $('#grades table:nth-child(2)').slideToggle();
    });

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
          $('#loader').fadeIn().children('.tia-number').html($('#tia').val());
        })

        if ($('.save-infos').is(':checked')){
          localStorage.setItem('tia',$('#tia').val())
          localStorage.setItem('pass',$('#pass').val())
        }

      },
      success : function(data){

        if (data.status == "OK") {
          localStorage.setItem('login',true)
          
          $('.refresh-date').html(data.time)
          $('.refresh').button('reset')

          if (data.grades == undefined) {
            $('.alert p').text('Ops não foi possível achar as suas Notas :( ');
            $('.alert').slideDown();
          } else if (data.absences == undefined){
            $('.alert p').text('Ops não foi possível achar as suas Faltas :( ');
            $('.alert').slideDown();
          }

          $('.navbar').slideDown();
          

        
          //Success animation
          $('#loader').fadeOut(function(){
            $('#content-area').fadeIn(function(){
            $('refresh-date').html(data.time);
              
              $('.container').animate({
                width : 900
              },function(){
                $('#grades').html(data.grades);
                $('#absences').html(data.absences);

                $('.schedule-holder .temp').html(data.schedule);
                TiaLite.helpers.weekDay();

                TiaLite.helpers.transSchedule('.schedule-holder .temp');
                $('.week').addClass('nav nav-pills nav-stacked')
                TiaLite.helpers.tabsAction('.week li');
                $('.temp').remove()
                

                //Removing tables atributes;
                var notWanted = ['id','width','cellpadding','cellspacing','align','colspan','width','class','bgcolor','height','tabelaemgeral']

                //Absences
                TiaLite.helpers.clearTableAttrs('#absences table',notWanted);
                
                //Grades
                TiaLite.helpers.clearTableAttrs('#grades table',notWanted);

                //Schedule
                TiaLite.helpers.clearTableAttrs('#schedule table',notWanted);
                $('#grades table, #absences table').addClass('table table-striped')


                //LocalStorage Setting
                localStorage.setItem('time',data.time)

                localStorage.setItem('grades',$('#grades').html())
                localStorage.setItem('absences',$('#absences').html())
                localStorage.setItem('schedule',$('#schedule').html())


                

              })
            });
          });
        } else {
          $('#loader').hide();
          if (!localStorage.getItem('login')) {
            $('#login-area').fadeIn();
          }
          $('.alert p').html(data.status);
          $('.alert').fadeIn();
        }
      },

      error : function(){
        $('#loader').fadeOut();
        if (!localStorage.getItem('login')) {
          $('#login-area').fadeIn();
        }

        $('.alert p').html("Ocorreu algum erro com o T.I.A em todo em caso existe a <a href='http://www.mackenzie.com.br' target='_blank'>maneira tradicional</a> <strong>:(</strong>");
        $('.alert').fadeIn();
      }
    })
  }
}


$(function(){
  TiaLite.init();
})
