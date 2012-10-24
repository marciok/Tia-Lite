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
        alert('validate')
      },
      success : function(data){
        //Just a draft
        $('#login-area').fadeOut(function(){
          $('#content-area').fadeIn(function(){
            $('.container').animate({
              width : 900
            },function(){
              $('#grades').html(data.grades);
              $('#absences').html(data.absences);
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
