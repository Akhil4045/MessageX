
const messages = {
  data: [],
  checkBoxChange: function(el) {
    $(el)[0].checked? $(el).parents('tr').addClass('selected'): $(el).parents('tr').removeClass();
  },
  convertTime: function(v, dt) {
    return (moment(v).isSame(moment(), 'day')? moment(v).format('LT'): (dt? moment(v).format('LLL'): moment(v).format("MMM D")));
  },
  showMessage: function(el) {
    if (event.target.type !== 'checkbox') {
      let msg_id = $(el).attr('msg_id'),
        d = messages.data.filter((x) => { return x._id == msg_id })[0];

      $('.subject, .user-name, .user-email, .user-phone, .msg-time, .msg-content').each((i, em) => {
        let v = d[$(em).attr('name')];
        if ($(em).attr('name') == 'send_date')
          v = messages.convertTime(v, true);
        $(em).html(v);
      });
      messages.hideTextArea();
      $('.popup-mask,.popup-div').show();
    }   
  },
  popupClose: function() {
    $('.popup-mask,.popup-div').hide();
  },
  bind: function(msgs) {
    let td = ['name', 'message', 'send_date'], html = '';
    
    for (i = 0; i < msgs.length; i++) {
      let m = msgs[i];         
      html += '<tr onclick="messages.showMessage(this);" msg_id="'+ m._id +'">';
      html += '<td><input onchange="messages.checkBoxChange(this);" type="checkbox" class="select-row"></td>'
      td.forEach((t) => {
        let v = m[t];
        if (t == 'send_date')
          v = messages.convertTime(v);
        html += '<td style="text-align: center;"><span class="span-td">'+ v +'</span></td>'
      });
      html += '</tr>';
    }

    $('.message-tbl tbody').html(html);
  },
  showTextArea: function() {
    let isAdmin = true;
    if (!isAdmin) {
      let link = document.createElement('a');
      link.href = "mailto:someone@example.com";
      document.body.appendChild(link);
      link.click(); 
    }
    else {
      $('.msg-reply-content').val(''); $('.msg-reply-content').removeClass('empty');
      $('.reply-btn-div').hide(); $('.reply-div').show();
    }
  },
  hideTextArea: function() {
    $('.reply-btn-div').show(); $('.reply-div').hide();
  }
}


$(function() {
  $.ajax({
      type: "POST",
      url: "/getMessages",
      contentType: 'application/json',
      data: {},
      success: function(res) {
        let ms = res.messages.slice(0, 50);
        messages.data = res.messages;
        messages.bind(ms);
      },
      error: function(jqXHR, textStatus, errorThrown) {
          alert("error");
      },
  });
});