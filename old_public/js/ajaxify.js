(function($){
    // $('form').ajaxFy({
    //     appendNode : '.inner-post'
    //     method : 'post'
    // });

    jQuery.fn.ajaxiFy = function(){
        var settings = $.extend({
            appendNode : 'inner',
            method     : 'post',
            loader     : 'image/loader.gif'
        });

        var methods = {
            init : function( options ){
           
                return this.each(function(){
                    $(this).bind('',methods.submitting) 
                })     
            },
            
            getParams : function(){
                $.each(this.children('input[type=text],input[type=password]'),function(){
                    params[this.attr('name')] = this.val();
                })
                return params;
            },

            formAction : function(){
                $.post(this.attr('action'),methods.getParams(),
                function(data){
                    $('.info-container').html(data);
                    localStorage.setItem('tia_data',data);
                })

            },

            loader : function(){
            },

            submitting : function(){
                this.children('input[type=submit]').click(function(){
                    
                })
            }
    
        }
    }
    
})(jQuery);

