var IPATH = "http://i.51job.com";
var MYPATH = "http://my.51job.com";
var LOGINPATH = "https://login.51job.com";
function openMobileOriginal(sType)
{
    var oPreSettings = arguments[1] ? arguments[1] : null;
    switch(sType)
    {
        case 'register':
            var isenglish = $("#lang").length > 0 ? $("#lang").val() : "c";
            var oldphonenum = "";
            var newphonenum = $("#phone").val();
            if(!checkPhone('phone','phone_err'))
            {
                $("#phone").focus();
                return;
            }
            if(!checkUserPwd('userpwd','pwd_err'))
            {
                $("#userpwd").focus();
                return;
            }
            if(!checkUserPwdCfm('cfmpwd','userpwd','pwdcfm_err'))
            {
                $("#cfmpwd").focus();
                return;
            }
            if(!checkVerifyCode())
            {
                $("#verifycode").focus();
                return;
            }
            if(!checkIsRead())
            {
                return;
            }
            break;
        case 'modify':
            var isenglish = typeof(window.cfg.lang) == "undefined" ? "c" : window.cfg.lang;
            var oldphonenum = $("#oldPhone").val();
            var newphonenum = $("#newphonenum").val();
            if(!(chk_phone_num(isenglish, 'mobile') == 1 && chk_phone_num(isenglish) == 1))
            {
                return;
            }
            break;
    }
    if(oldphonenum == newphonenum)
    {
        return;
    }
    if(oPreSettings != null)
    {
        jQuery.FLayer.close(oPreSettings);
    }
	var action_url = LOGINPATH + "/ajax/mobile_original.php?"+ Math.random() + '&jsoncallback=?';
	$.getJSON( action_url, {isenglish:isenglish,oldphonenum:oldphonenum,newphonenum:newphonenum,type:sType} , function(result) {
        if(result.status == "1")
        {
            if(isenglish == "e")
            {
                var sHtml = '<div class="panel_lnp panel_py panel_ct3">'
                    +'<h2>'
                    +'<p>Bind Mobile Phone</p>'
                    +'<a  class="layer_close" href="javascript:void(0);"><i></i></a>'
                    +'</h2>'
                    +'<div class="pannel_con">'
                    +'<p class="stage center">'
                    +'Send message "<strong class="c_yellow">' + result.verifycode + '</strong>" to <strong class="c_yellow">' + result.originalnum + '</strong> for binding mobile phone number. Then, click the "confirm" button.'
                    +'</p>'
                    +'</div>'
                    +'<input type="hidden" id="moverifycode" value="' + result.verifycode + '" />'
                    +'<input type="hidden" id="oldphone" value="' + oldphonenum + '" />'
                    +'<input type="hidden" id="newphone" name="newPhone" value="' + newphonenum + '" />'
                    +'<div class="but_box b2">'
                    +'<span class="panel_btn_s" id="mobile_confirm_button" >Confirm</span>'
                    +'</div>'
                    +'<p class="btm_note">Tips: don\'t close before successfully certificated</p>'
                    +'</div>';
            }
            else
            {
                var sHtml = '<div class="panel_lnp panel_py panel_ct3">'
                    +'<h2>'
                    +'<p>���ֻ�����</p>'
                    +'<a  class="layer_close" href="javascript:void(0);"><i></i></a>'
                    +'</h2>'
                    +'<div class="pannel_con">'
                    +'<p class="stage center">'
                    +'��ʹ���ֻ����� <strong class="c_333">' + newphonenum + '</strong><br>���� <strong class="c_yellow">' + result.verifycode + '</strong> �� <strong class="c_yellow">' + result.originalnum + '</strong> �����ֻ������<br>���ŷ��ͳɹ���������ҳ��ġ�ȷ�Ϸ��͡���ť'
                    +'</p>'
                    +'</div>'
                    +'<input type="hidden" id="moverifycode" value="' + result.verifycode + '" />'
                    +'<input type="hidden" id="oldphone" value="' + oldphonenum + '" />'
                    +'<input type="hidden" id="newphone" name="newPhone" value="' + newphonenum + '" />'
                    +'<div class="but_box b2">'
                    +'<span class="panel_btn_s" id="mobile_confirm_button" >ȷ�Ϸ���</span>'
                    +'</div>'
                    +'<p class="btm_note">��ܰ��ʾ������رո�ҳ�棬ϵͳ��֤�ɹ����ҳ����Զ���ʾ���رգ������ĵȴ���</p>'
                    +'</div>';
            }
            oLayerSettings = jQuery.FLayer.init();
            jQuery.FLayer.setContent(oLayerSettings,sHtml);
            jQuery.FLayer.open(oLayerSettings);
            $('#mobile_confirm_button').click(function(){
                moConfirm(sType, isenglish, oLayerSettings);
            });
        }
	});
	
	return;
}

function countDown(sec, slang){
    $('#mobile_confirm_button').text(slang == "e" ? ("awaiting(" + sec + ")") : ("�ȴ�(" + sec + ")")).addClass("off");
    
    if(sec == 0)
    {
        $('#mobile_confirm_button').text(slang == "e" ? "confirm" : "ȷ�Ϸ���").removeClass("off");
        return;
    }else{
        setTimeout(function(){countDown(sec - 1, slang)}, 1000); 
    }
    
}

function moConfirm(type, isEnglish,oLayerSettings)
{
    if($('#mobile_confirm_button').hasClass("off"))
    {
        return;
    }
    
    var successHtml = isEnglish == "e" ? '<div class="panel_lnp panel_py"><h2><p>Bind Mobile Phone</p><a class="layer_close" href="javascript:void(0);"><i></i></a></h2><div class="pannel_con"><div class="gp3"><strong class="wd f16 center c_orange">Congratulation! Bound successfully</strong></div></div></div>' : '<div class="panel_lnp panel_py"><h2><p>���ֻ�����</p><a class="layer_close" href="javascript:void(0);"><i></i></a></h2><div class="pannel_con"><div class="gp3"><strong class="wd f16 center c_orange">��ϲ�㣬�ѳɹ����ֻ����룡</strong></div></div></div>';
    
    var failedHtml = '<div class="panel_lnp panel_py panel_ct3"><h2><p>' + (isEnglish == "e" ? 'Bind Mobile Phone' : '���ֻ�����')  + '</p><a href="javascript:void(0)" class="layer_close"><i></i></a></h2><div class="pannel_con"><p class="stage center">' + (isEnglish == "e" ? 'Failed to complete!' : 'δ������ֻ�����󶨣�')  + '</p><div class="jmsg f12 c_999">' + (isEnglish == "e" ? 'Possible reasons that lead to failure:<br>1 Verification code is not correct<br>2 Text message is not sent by binding mobile phone <br>3 Failed to send the message' : '��ʧ��ԭ������У�<br>1����֤�뷢�ʹ���<br>2��δʹ�ð󶨵��ֻ����뷢�Ͷ���<br>3�����ŷ���ʧ��') + '</div></div><div class="but_box b2"><span class="panel_btn_s" onclick="openMobileOriginal(\'' + type + '\', oLayerSettings)">' + (isEnglish == "e" ? 'Try it again' : '���°�')  + '</span></div><input type="hidden" name="newPhone" id="' + (type == 'register' ? 'userPhone' : 'newphonenum') + '" value="' + $.trim($("#newphone").val()) + '"><input type="hidden" id="oldPhone" value="' + $.trim($("#oldphone").val()) + '"></div>';
    
    var overLimitHtml = '<div class="panel_lnp panel_py panel_ct3"><h2><p>' + (isEnglish == "e" ? 'Bind Mobile Phone' : '���ֻ�����')  + '</p><a href="javascript:void(0)" class="layer_close"><i></i></a></h2><div class="pannel_con"><p class="stage center">' + (isEnglish == "e" ? 'Maximum 3 times per day!' : '���Ѵﵽ�����ֻ��������������')  + '</p></div></div>';
    
    switch(type)
    {
        case 'register':
            if(!checkPhone('phone','phone_err') || !checkUserPwd('userpwd','pwd_err') || !checkUserPwdCfm('cfmpwd','userpwd','pwdcfm_err') || !checkVerifyCode() || !checkIsRead())
            {
                jQuery.FLayer.close(oLayerSettings);
                return;        
            }
            var phone = $.trim($("#phone").val());
            var verifycode = $.trim($("#verifycode").val());
            var password = $.trim($("#userpwd").val());
            var cfmpwd = $.trim($("#cfmpwd").val());
            var from_domain = 'my.51job.com';
            var fromurl = $.trim($("#url").val());
            var phonecode = $.trim($("#moverifycode").val());
            var isread = checkIsRead();
            $.post(window.cfg.domain.login + "/ajax/mo_register.php", {phone:phone, verifycode:verifycode, password:password, cfmpwd:cfmpwd, isread:isread, phonecode:phonecode, from_domain:from_domain, url:fromurl} , function(result) {
                if(result.result == "1")
                {
                    window.clearInterval(timer);
                    jQuery.FLayer.close(oLayerSettings);
                    
                    oLayerSettings = jQuery.FLayer.init();
                    jQuery.FLayer.setContent(oLayerSettings,successHtml);
                    jQuery.FLayer.open(oLayerSettings);
                    
                    setTimeout( function() {
                        $("#layer_id").fadeOut(300);
                        $("#layer_back_drop").fadeOut(300);
                        if(fromurl != "")
                        {
                            window.location.href = fromurl;
                        }
                        else
                        {
                            window.location.href = "http://my.51job.com/my/My_reg_trace.php";
                        }
                    } , 2000 );
                }
                else
                {
                    if(result.scode == "20")
                    {
                        window.clearInterval(timer);
                        jQuery.FLayer.close(oLayerSettings);
                        
                        oLayerSettings = jQuery.FLayer.init();
                    
                        jQuery.FLayer.setContent(oLayerSettings,overLimitHtml);
                        jQuery.FLayer.open(oLayerSettings);
                    }
                }
            }, 'json');
            break;
        case 'modify':
            var oldPhoneNum = $("#oldphone").val();
            var newPhoneNum = $("#newphone").val();
            var moVerifyCode = $("#moverifycode").val();
            if(chk_phone_num(isEnglish,"mobile") != 1 || $.trim(moVerifyCode) == '')
            {
                return;
            }
            var action_url = IPATH+"/resume/ajax/userinfo_edit.php?" + Math.random() + '&jsoncallback=?';
            $.getJSON( action_url, {action_type: "save", action: "user_phone",phone:oldPhoneNum,newphone: newPhoneNum, isenglish: isEnglish, phonecode:"", smscode:moVerifyCode } , function(result) {
                if(result.status == 1)
                {
                    window.clearInterval(timer);
                    jQuery.FLayer.close(oLayerSettings);
                    
                    oLayerSettings = jQuery.FLayer.init();
                    jQuery.FLayer.setContent(oLayerSettings,successHtml);
                    jQuery.FLayer.open(oLayerSettings);
                    
                    setTimeout( function() {
                        $("#layer_id").fadeOut(300);
                        $("#layer_back_drop").fadeOut(300);
                    } , 2000 );
                    
                    if($("#tele").is('input'))
                    {
                        $("#tele").val(newPhoneNum);
                        if(isEnglish == 'e'){
                            $("#mobilepointer").html("Edit");
                        }else{
                            $("#mobilepointer").html("�޸�");
                        }
                    }
                    else
                    {
                        $("#tele").html(newPhoneNum);
                    }
                    $("#mobile_confirm_verifystatus").val("1");
                    $("#tri_mobilepointer").parent().removeClass("pointer").attr("onclick", "");
                    $("#tri_mobilepointer").remove();	
                }
                else
                {
                    if(result.result == "20")
                    {
                        window.clearInterval(timer);
                        jQuery.FLayer.close(oLayerSettings);
                        
                        oLayerSettings = jQuery.FLayer.init();
                    
                        jQuery.FLayer.setContent(oLayerSettings,overLimitHtml);
                        jQuery.FLayer.open(oLayerSettings);
                    }
                }
            })
    }
    
    $('#mobile_confirm_button').addClass("off");
    
    var sec = 30;
    timer = setInterval(function(){
        if(sec > 0)
        {
            $('#mobile_confirm_button').text((isEnglish == "e" || isEnglish == "EN") ? ("awaiting(" + sec + ")") : ("�ȴ�(" + sec + ")")).addClass("off");
            sec--;
        }
        else
        {
            window.clearInterval(timer);
            jQuery.FLayer.close(oLayerSettings);
                    
            oLayerSettings = jQuery.FLayer.init();
            jQuery.FLayer.setContent(oLayerSettings,failedHtml);
            jQuery.FLayer.open(oLayerSettings);
        }
    }, 1000)
    
}