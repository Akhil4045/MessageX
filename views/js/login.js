const login = {
   signin: function() {
        let user_name = $('.log-username').val(), password = $('.log-password').val();
        if (user_name == '' || password == '') {
            $('.login-failed').html('User name & password is required!').show(); 
            return false; 
        }

        let data = JSON.stringify({ user_name: user_name, password: password });
        $$$login('/signin', data, (res) => {
            if (res.status == 'success') {
                let resData = res.data;
                if (resData.status) {
                    document.cookie = `token=${ resData.accessToken }`;
                    window.location.href = "/message";
                }
                else {
                    $('.login-failed').html('Invalid login!').show();     
                }
            }
            else {
                alert('An error occured when login!');
            }
        });       
   },
   hideSpan: function() {
        $('.login-failed').hide();
   },
   showLogin: function() {
       $('.create-div').hide(); $('.forgot-div').hide(); $('.log-in').removeClass('empty');  $('.log-in').val(''); $('.log-check').attr('checked', false); $('.login-div').show(); 
   },
   showCreateAccount: function() {
        $('.login-div').hide(); $('.log-in').removeClass('empty'); $('.log-in').val(''); $('.log-check').attr('checked', false); $('.create-div').show();
   },
   showForgotPassword: function() {
        $('.login-div').hide(); $('.log-in').removeClass('empty'); $('.log-in').val(''); $('.forgot-div').show();
   },
   textBoxChange: function(el) {
        $(el).removeClass('empty');
   },
   sendRecoveryMail: function() {

   },
   signup: function() {
        let data = {}, valid = true;
        $('.create-box input[type="text"], input[type="password"]').each((i, el) => {
            let v = $(el).val();
            data[$(el).attr('name')] = v;
            if (v.trim() == '') {
                valid =  false; $(el).addClass('empty');
            }
        });

        if (!valid || !$('.create-box.log-check').attr('checked') == 'checked') return false;
        data = JSON.stringify(data);

        $$$login('/addUser', data, (res) => {
            if (res.status == 'success') {
                let resData = res.data;
                if (resData.status) {
                   login.showLogin();
                }
                else 
                   $('.signup-failed').show();
            }
            else {
                alert('Account creation failed!');
            }
        }); 

   }
}

const $$$login = function(path, data, callback) {
   $.ajax({
        type: "POST",
        url: path,
        contentType: 'application/json',
        data: data,
        success: function(res) {
            if(callback)  callback({ data: res, status: 'success' });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            if(callback)  callback({ status: 'failed' });
        },
   }); 
}