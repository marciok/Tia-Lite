var TiaLite = {
  init : function(){
    this.login('.login-form');
  },

  helpers : function(){

  },

  LSmanager : function(data){
    // localStorage(data)

  },


  login : function(form){
    $(form).ajaxForm({
      beforeSubmit : function(){
        // TODO: Make a validate funciton
        var validate = true
        if (validate) {
          $('#login-area').fadeOut(function(){
            $('#loader').fadeIn();
          })
        }
      },
      success : function(data){
        if (data.grades == undefined) {
          $('.alert p').text('Ops não foi possível achar as suas Notas :( ');
          $('.alert').slideDown();
        } else if (data.absences == undefined){
          $('.alert p').text('Ops não foi possível achar as suas Faltas :( ');
          $('.alert').slideDown();
        }
        //Just a draft
        $('#loader').fadeOut(function(){
          $('#content-area').fadeIn(function(){
            $('.container').animate({
              width : 900
            },function(){
              $('#grades').html(data.grades);
              $('#absences').html(data.absences);
              $('#grades, #absences').slideDown('slow');
              $('#grades, #absences').children('table').addClass('table table-striped')
            })
          });
        })
      },

      error : function(){
        alert('error')
      }
    })
  }
}


$(function(){
  TiaLite.init();
})
