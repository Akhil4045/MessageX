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
       $('.create-div').hide(); $('.forgot-div').hide(); $('.reset-div').hide(); $('.log-in').removeClass('empty');  $('.log-in').val(''); $('.log-check').attr('checked', false); $('.login-div').show(); 
   },
   showCreateAccount: function() {
        $('.login-div').hide(); $('.log-in').removeClass('empty'); $('.log-in').val(''); $('.log-check').attr('checked', false); $('.create-div').show();
   },
   showForgotPassword: function() {
        $('.login-div').hide(); $('.log-in').removeClass('empty'); $('.log-in').val(''); $('.forgot-div').show();
   },
   showReset: function() {
        $('.log-in').removeClass('empty'); $('.log-in').val(''); $('.forgot-div').hide(); $('.reset-div').show();
   },
   textBoxChange: function(el) {
        $(el).removeClass('empty');
   },
   updateHtml: function(el, val) {
        $(el).html(val);
        $(el).show();
   },
   sendRecoveryMail: function() {
        let email = $('.forgot-mail').val(), random = Math.floor(100000 + Math.random() * 900000), data = {};

        if (email.trim() == '') {
            login.updateHtml('.recovery-failed', 'Email required!');
            return false;
        }

        login.updateHtml('.recovery-failed', 'Plese wait...');
        let html = `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
            <div style="border-bottom:1px solid #eee">
                <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">MessageX</a>
            </div>
            <p style="font-size:1.1em">Hi,</p>
            <p>Thank you for choosing MessageX. Use the following OTP to complete your reset procedures. OTP is valid for 30 minutes</p>
            <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">`+ random +`</h2>
            <p style="font-size:0.9em;">Regards,<br />MessageX</p>
            <hr style="border:none;border-top:1px solid #eee" />
            <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                <p>MessageX</p>
            </div>
            </div>
        </div>`
        data = JSON.stringify({ to: email, subject: 'MessageX - Password recovery', text: '', html: html, pin: random });

        $$$login('/forgotPassword', data, (res) => {
            if (res.status == 'success') {
                let resData = res.data;
                if (resData.status) {
                   login.updateHtml('.recovery-failed', 'Recovery instructions mailed!');
                   setTimeout(login.showReset, 3000);
                }
                else 
                    login.updateHtml('.recovery-failed', resData.message);             
            }
            else {
                alert('Recovery failed!');
            }
        }); 
   },
   recover: function() {
        let data = {}, valid = true;
        $('.reset-box input[type="text"], .reset-box input[type="password"]').each((i, el) => {
            let v = $(el).val();
            data[$(el).attr('name')] = v;
            if (v.trim() == '') {
                valid =  false; $(el).addClass('empty');
            }
        });

        if (!valid) return false;       
        login.updateHtml('.reset-failed', 'Plese wait...');
        data = JSON.stringify(data);

        $$$login('/reset', data, (res) => {
            if (res.status == 'success') {
                let resData = res.data;
                if (resData.status) {
                   login.updateHtml('.reset-failed', resData.message);
                   setTimeout(login.showLogin, 5000);
                }
                else 
                    login.updateHtml('.reset-failed', resData.message);           
            }
            else {
                login.updateHtml('.reset-failed', resData.message);  
            }
        }); 
   },
   signup: function() {
        let data = {}, valid = true;
        $('.create-box input[type="text"], .create-box input[type="password"]').each((i, el) => {
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