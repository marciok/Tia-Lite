var TiaLite = {
  init : function(){
    this.login('.login-form');
  },

  helpers : {
    clearTableAttrs : function(table,attrs){
      $.each(attrs,function(i){
        $(table).removeAttr(attrs[i]);
      })
    },

    validate : function(){
    }

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
        // TODO: make this on server side
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

              //Removing tables atributes;
              var notWanted = ['id','width','cellpadding','cellspacing','align','colspan','width','class','bgcolor','height','tabelaemgeral']
              //Absences
              TiaLite.helpers.clearTableAttrs('#absences table',notWanted)
              TiaLite.helpers.clearTableAttrs('#absences table tr td',notWanted)
              TiaLite.helpers.clearTableAttrs('#absences table tr th',notWanted)
              TiaLite.helpers.clearTableAttrs('#absences table tr td div',notWanted)
              
              //Grades
              TiaLite.helpers.clearTableAttrs('#grades table',notWanted)
              TiaLite.helpers.clearTableAttrs('#grades table tr td',notWanted)
              TiaLite.helpers.clearTableAttrs('#grades table tr td div',notWanted)

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
