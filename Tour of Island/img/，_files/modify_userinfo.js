var IMGPATH = 'http://img01.51jobcdn.com';
var MYPATH = 'http://my.51job.com';
var CSSPATH = "http://js.51jobcdn.com/in/css/";
var IPATH = "http://i.51job.com";

var LOGINPATH = "http://login.51job.com";


function Modify_Info( action,show )
{
	var isenglish = window.cfg.lang;
	var action_url = IPATH+"/resume/ajax/userinfo_edit.php?"+ Math.random() + '&jsoncallback=?';
	$.getJSON( action_url, { action: action, isenglish:isenglish,show:show} , function(result) {
		oLayerSettings = jQuery.FLayer.init();
		jQuery.FLayer.setContent(oLayerSettings,result.html);
		jQuery.FLayer.open(oLayerSettings);		
		$('#layer_back_drop').css({"filter":"Alpha(Opacity=70)"});
		if(typeof placeholder !='undefined' && placeholder instanceof Function)
		{
			$('#newusername').placeholder({customClass:'my-placeholder'});
			$('#userpwd').placeholder({customClass:'my-placeholder'});
			$('#newuserpwd').placeholder({customClass:'my-placeholder'});	
		}		

	} );
	
	return false;
}


function Change_CodeImage()
{
		var objDate = new Date();
	    var strTime = objDate.getTime();
	    url = $('#change_code').attr('src');
		var type = $('#change_code').attr('type');
		if(type == '' || type == undefined){
			type=3;
		}
	    if(url.indexOf('?') > 0)
	    {
	    	url = url.replace(/\?.*/g,'?');
	    }else
	    {
	    	url = url + '?';
	    }
	    url = url + 'type=' + type + '&from_domain='+window.location.host+'&t=' + strTime;
	    
	    $('#change_code').attr('src',url);
}


function EmailResend(emailurl,isenglish )
{
	var email = $("#this_success_email").html();
	var sUrl = IPATH + "/resume/ajax/userinfo_edit.php?" + Math.random() + '&jsoncallback=?';
	
	$.getJSON(sUrl, {action_type: "send_email", action: "user_email", emailurl: emailurl ,isenglish:isenglish} , function(result) {

	if (result.status !='0'){
		oLayerSettings = jQuery.FLayer.init();
		jQuery.FLayer.setContent(oLayerSettings,result.html);
		jQuery.FLayer.open(oLayerSettings);
	}else{
		self.location.href=MYPATH_MY+'/My_SignOut.php'
	}
	} );
}


function checkUserEmailFormat( str,language )
{
	var language = (arguments[1]!='')?arguments[1]:'c';
	
	if( str.length > 100 ){
		if(language == 'e')
		{
			window.alert( "Wrong email" );
		}
		else
		{
			window.alert( "邮箱错误" );
		}
		return false;
	}
	str = str.toLowerCase()
	var regu = "^(([0-9a-zA-Z]+)|([0-9a-zA-Z]+[_.0-9a-zA-Z-]*))@([a-zA-Z0-9-]+[.])+([a-zA-Z]{2}|net|com|gov|mil|org|edu|int|name|asia)$";
	var re = new RegExp( regu );
	if( str.search( re ) == -1 )
	{
		if(language == 'e')
		{
			window.alert( "Wrong email" );
		}
		else
		{
			window.alert ( "邮箱错误" );
		}
		return false;
	}
	else
	{
		return true;
	}
}

function Save_Email( language )
{
	var email = $.trim($("#newemail")[0].value).toLowerCase();
	var vldcode = $.trim($("#validatecode")[0].value);
	var action_url = IPATH+"/resume/ajax/userinfo_edit.php?" + Math.random() + '&jsoncallback=?';

	if( email == '' ){
		if(language == 'e')
		{
			window.alert( "Please enter the correct email" );
		}
		else
		{
			window.alert( "邮箱错误" );
		}
		$("#newemail")[0].focus();
		return false;
	}
	if(vldcode == '')
	{
		if(language == 'e')
		{
			window.alert( "Wrong graphic code" );
		}
		else
		{
			window.alert( '图形验证码错误' );
		}
		$("#validatecode")[0].focus();
		return false;
	}

	if( checkUserEmailFormat( email,language ) )
	{
		$("#this_email_had").hide();
		$('body').css('zoom','');
		$("#this_alert_err").hide();
		$.getJSON( action_url, {action_type: "save", action: "user_email", newemail: email, vldcode:vldcode,isenglish: language} , function(result) {
			
		if(result.status == 1)
		{
			$("#this_success_email").html(email);
			var html = $("#this_success").html();		
			oLayerSettings = jQuery.FLayer.init();
			jQuery.FLayer.setContent(oLayerSettings,html);
			jQuery.FLayer.open(oLayerSettings);	
			if($("#email").is('input'))
			{
				$("#email").val(email);	
                if(language == 'e'){
                    $("#emailpointer").html("Edit");
                }else{
                    $("#emailpointer").html("修改");
                }
			}
			else
			{
				$("#email").html(email.substring(0,22));	
			}
		}
		else if(result.result =="email已存在")
		{
			$("#this_email_had").show();			
			$('body').css('zoom','1');
			$("#forget_url").attr("href",$("#forget_url").attr("href")+$("#newemail").val()) ;
			Change_CodeImage();
		}
		else
		{
			$("#this_alert_err").show();
			$("#this_alert_content").html(result.result);
			Change_CodeImage();
		}
			
		} );
	}
    return false;
}

function chk_UserName( str,language )
{
	if( str == '' ){
		if(language == 'e')
		{
			window.alert( "Please enter your member ID" );
		}
		else
		{
			window.alert( "请填写用户名" );
		}
		return false;
	}
	if( str.length < 4 ){
		if(language == 'e')
		{
			window.alert( "At least 4 digits" );
		}
		else
		{
			window.alert( "用户名需要至少4位数字或字母" );
		}
		return false;
	}
	if( str.length > 100 ){
		if(language == 'e')
		{
			window.alert( "Your member ID should not have more than 50 characters" );
		}
		else
		{
			window.alert( "您的用户名不能超过50位 " );
		}
		return false;
	}
	
	var regu = "^([0-9a-zA-Z]+[_0-9a-zA-Z@.-]*)$"
	var re = new RegExp(regu);
	if( str.search( re ) != -1 ){
		var sReg = /^(1[34578]{1,1}[0-9]{9,9})$/;
		if(sReg.test(str))
		{
			if(language == 'e')
			{
				window.alert( "Please use correct member ID" );
			}
			else
			{
				window.alert( "用户名不能为手机号" );
			}
			return false;
		}
		else
		{
			return true;
		}
	}else{
		if(language == 'e')
		{
			window.alert( "Please use correct member ID" );
		}
		else
		{
			window.alert( "用户名须以字母或数字开头，至少4位" );
		}
		return false;
	}	
 }

function Save_UserName( language )
{
	var userpwd_v = $.trim($("#userpwd")[0].value);
	var newusername_v =  $.trim($("#newusername")[0].value).toLowerCase();
	var vldcode_v = $.trim($("#validatecode").val());
	if(newusername_v == '')
	{
		if(language == 'e')
		{
			window.alert( "Please enter username" );
		}
		else
		{
			window.alert( "请填写用户名" );
		}
		$("#newusername")[0].focus();
		return false;
	}
	
	if( userpwd_v == '' ){
		if(language == 'e')
		{
			window.alert( "Wrong password,please enter your login password to verify your account" );
		}
		else
		{
			window.alert( '密码错误，请填写该账号的登录密码来验证身份' );
		}
		$("#userpwd")[0].focus();
		return false;
	}
	if(vldcode_v == '')
	{
		if(language == 'e')
		{
			window.alert( "Wrong graphic code" );
		}
		else
		{
			window.alert( '图形验证码错误' );
		}
		$("#validatecode")[0].focus();
		return false;
	}
	
	if( chk_UserName( newusername_v,language ) )
	{
		var action_url = IPATH+"/resume/ajax/userinfo_edit.php?" + Math.random() + '&jsoncallback=?';
		$.getJSON( action_url, { isenglish:language,action: "user_name", action_type: "save",userpwd: userpwd_v, newusername: newusername_v, vldcode: vldcode_v} , function(result) {
		
		if(language == "e")
		{
			var html = '<div class="panel_lnp panel_py"><h2><p>Advice</p><a class="layer_close" href="javascript:;"><i></i></a></h2><div class="pannel_con"><div class="gp3"><strong class="wd f16 center c_orange">Congratulations! Username updated.</strong></div></div></div>';
		}
		else
		{
			var html = '<div class="panel_lnp panel_py"><h2><p>资料修改</p><a class="layer_close" href="javascript:;"><i></i></a></h2><div class="pannel_con"><div class="gp3"><strong class="wd f16 center c_orange">恭喜你，修改成功！</strong></div></div></div>';
		}
		
		if(result.status == 1)
		{
			oLayerSettings = jQuery.FLayer.init();
			jQuery.FLayer.setContent(oLayerSettings,html);
			jQuery.FLayer.open(oLayerSettings);
			$("#top_username").html(newusername_v.substring(0,22));
			setTimeoutClose();
		}
		else
		{			
			$("#this_alert_err").show();
			$("#this_alert_content").html(result.result);
			Change_CodeImage();
		}


		} );
	}else{
		$("#newusername")[0].focus();
		return false;
	}
}

function chkUpwdIsCorrect()
{
	var chkResult = 0;
	var str = $.trim($("#newuserpwd")[0].value);
	if(str.length == '')
	{
		chkResult = 1;

	}else if(str.length < 6 || str.length > 16)
	{
		chkResult = 2;
	}else
	{
		//检查密码中是否输入ascii码在[0,32],[127-255]之间的字符，这2个区间的字符非法
		var i,as_code;
		for(i = 0; i < str.length; i++)
		{
			as_code = str.charCodeAt(i);
			if(as_code < 33 || as_code > 126 )
			{
				chkResult = 3;
				return chkResult;
			}
		}

		//检查密码与用户名或者邮箱是否重复
		var user_email = $.trim($("#my_email").val());
		var user_name  = $.trim($("#my_username").val());
		if(str == user_email.toLowerCase() || str == user_name.toLowerCase())
		{
			chkResult = 4;
		}else //检查密码是否单一类型
		{
			//单一数字，字母，特殊符号
			var re_num    = /^[0-9]+$/g;
			var re_char	  = /^[a-zA-Z]+$/gi;
			var re_spchar = /^[^0-9a-zA-Z]+$/gi;
			if( re_num.test(str) || re_char.test(str) || re_spchar.test(str))
			{
				chkResult = 3;
			}
		}
	}
	return chkResult;
}

function Save_PassWord( language )
{
	var olduserpwd_v = $.trim($("#olduserpwd")[0].value);
	var newuserpwd_v = $.trim($("#newuserpwd")[0].value);
	var newuserpwdcfm_v = $.trim($("#newuserpwdcfm")[0].value);
	var vldcode_v       = $.trim($("#validatecode")[0].value);

	if( olduserpwd_v == '' ){
		if(language == 'e')
		{
			window.alert( "Wrong password" );
		}
		else
		{
			window.alert( "密码错误" );
		}
		$("#olduserpwd")[0].focus();
		return false;
	}

	var chkResult = chkUpwdIsCorrect();
	var error_msg='';
	switch(chkResult)
	{
		case 1:
			error_msg = language == 'e' ? 'Please enter new password' : '请填写新密码';
			break;
		case 2:
			error_msg = language == 'e' ? 'Password does not meet requirements' : '不符合密码格式要求';
			break;
		case 3:
			error_msg = language == 'e' ? 'Space is not supported. Please combine 2 of the follows: numbers,alphabets or symbols' : '密码不支持空格符号，需包含数字、字母或常用符号任意两种组合';
			break;
		case 4:
			error_msg = language == 'e' ? 'Cannot be the same as the user name or email' : '新密码不能和用户名或邮箱一样';
			break;
	}
	if(error_msg != '')
	{
		window.alert( error_msg );
		$("#newuserpwd")[0].focus();
		return false;
	}

	if( newuserpwdcfm_v == '' || newuserpwd_v != newuserpwdcfm_v ){
		if(language == 'e')
		{
			window.alert( "New passwords are not consistent" );
		}
		else
		{
			window.alert( "与新密码不一致" );
		}
		$("#newuserpwdcfm")[0].focus();
		return false;
	}

	if(vldcode_v == '')
	{
		if(language == 'e')
		{
			window.alert( "Wrong graphic code" );
		}
		else
		{
			window.alert( '图形验证码错误' );
		}
		$("#validatecode")[0].focus();
		return false;
	}

	var action_url = IPATH+"/resume/ajax/userinfo_edit.php?" + Math.random() + '&jsoncallback=?';
	$.getJSON( action_url, { isenglish:language,action:"user_password" ,action_type: "save", olduserpwd: olduserpwd_v, newuserpwd: newuserpwd_v, newuserpwdcfm: newuserpwdcfm_v, vldcode:vldcode_v} , function(result) {
		if(language == "e")
		{
			var html = '<div class="panel_lnp panel_py"><h2><p>Advice</p><a class="layer_close" href="javascript:;"><i></i></a></h2><div class="pannel_con"><div class="gp3"><strong class="wd f16 center c_orange">Congratulations! Password updated.</strong></div></div></div>';
		}
		else
		{
			var html = '<div class="panel_lnp panel_py"><h2><p>资料修改</p><a class="layer_close" href="javascript:;"><i></i></a></h2><div class="pannel_con"><div class="gp3"><strong class="wd f16 center c_orange">恭喜你，修改成功！</strong></div></div></div>';
		}
		
		if(result.status == 1)
		{
			oLayerSettings = jQuery.FLayer.init();
			jQuery.FLayer.setContent(oLayerSettings,html);
			jQuery.FLayer.open(oLayerSettings);
			setTimeoutClose();
		}
		else
		{
			$("#this_alert_err").show();
			$("#this_alert_content").html(result.result);
			Change_CodeImage();
		}

	} );
    return false;
}


//返回强度级别
function checkStrong(password){
	var chkResult = chkUpwdIsCorrect();
	var pwdLevel = '0';
	if( chkResult == 0 ) //chkResult=0说明密码中数字，字母，特殊符号至少包含2种且长度在6-16
	{
		var re_num    = /[0-9]+/g;	    //包含数字
		var re_char	  = /[a-zA-Z]+/gi; //包含字母
		var re_spchar = /[^0-9a-zA-Z]+/gi; //包含特殊字符
		if(password.length > 5 && password.length < 11) //6-10 中或者低
		{
			if(re_num.test(password) && re_char.test(password) && re_spchar.test(password))
			{
				pwdLevel = '2';
			}else
			{
				pwdLevel = '1';
			}
		}else if(password.length > 10 && password.length < 17) //11-16 中或者高
		{
			if(re_num.test(password) && re_char.test(password) && re_spchar.test(password))
			{
				pwdLevel = '3';
			}else
			{
				pwdLevel = '2';
			}
		}
	}
	return pwdLevel;
}

//显示颜色
function pwStrength(pwd)
{
	$("#userpwd_strength").show();
	var O_color="#eeeeee";
	var L_color="#eb0027";
	var M_color="#ffc200";
	var H_color="#11b100";

	var Lcolor,Mcolor,Hcolor,O_color;

	$("#strength_L")[0].style.color = "#000000";
	$("#strength_M")[0].style.color = "#000000";
	$("#strength_H")[0].style.color = "#000000";

	if (pwd==null||pwd=='')
	{
		Lcolor=Mcolor=Hcolor=O_color;
	}
	else
	{
		S_level=checkStrong(pwd);
		switch(S_level) {
			case '0':
				Lcolor=Mcolor=Hcolor=O_color;
				break;
			case '1': //低
				Lcolor=L_color;
				Mcolor=Hcolor=O_color;
				$("#strength_L")[0].style.color = "#ffffff";
				break;
			case '2': //中
				Lcolor=Mcolor=M_color;
				Hcolor=O_color;
				$("#strength_L")[0].style.color = "#ffffff";
				$("#strength_M")[0].style.color = "#ffffff";
				break;
			case '3': //高
				Lcolor=Mcolor=Hcolor=H_color;
				$("#strength_L")[0].style.color = "#ffffff";
				$("#strength_M")[0].style.color = "#ffffff";
				$("#strength_H")[0].style.color = "#ffffff";
			break;
		}
	}
	$("#strength_L")[0].style.background = Lcolor;
	$("#strength_M")[0].style.background = Mcolor;
	$("#strength_H")[0].style.background = Hcolor;
	return;
}

var mobileComponent = function() {
    return {
	        sMobileErrorMessage_CHINA_CN: '手机号错误',
	        sMobileErrorMessage_CHINA_EN: 'Wrong mobile',
	        sMobileEmptyErrorMessage_CN: '请填写手机号',
	        sMobileEmptyErrorMessage_EN: 'Please enter mobile',
	        sMobileErrorMessage_CN: '请填写大陆手机号',
	        sMobileErrorMessage_EN: 'Please enter mobile registered in China mainland',
	        sBindMobileErrorMessage_MOBILE_SAME_CN: '请填写新手机号',
	        sBindMobileErrorMessage_MOBILE_SAME_EN: 'Please enter new mobile',
	        sBindMobileErrorMessage_foreign_EN:'You can save mobile directly as it is not registered in China mainland. (This might cause security risk in your account)',
			sBindMobileErrorMessage_foreign_CN:'该号码为非大陆手机号，确认使用该号码请直接点击“保存”（注意：未验证手机号码的账号会存在严重安全隐患）',
	        checkMobile: function(iMobile, sMpCountry) {
	        if ('' == sMpCountry || undefined == sMpCountry) {
	            var sReg = /^(1[34578]{1,1}[0-9]{9,9})$/;
	        } else {
	            var sReg = /^[0-9]{1,20}$/;
	        }
			return sReg.test(iMobile);
    	}
	}
}

//定时器
var wait=60;
var id_set_timeout = null;
function sendPhoneCodetime(isEnglish)
{
	var obj = $('#btn7');
	if(document.getElementById("btn7")){
		if(wait <= 0){
            $('#modify_phone_err_tr').hide();
            $('#mobiletips').show();
            $('#btn7').removeClass('gain_grey');
            $('#btn7').addClass('gain');
			id_set_timeout = null
			$("#btn7").attr('disabled',false);
            if (isEnglish == 'e') {
                obj.attr('value',"Send Code");
            } else {
                obj.attr('value',"发送验证码");
            }
            $('#newphonenum').attr('disabled',false);
            $('#newphonenum').css('background','');
	    	document.getElementById("btn7").onclick=function(){sendPhoneCode(isEnglish);}
	        wait = 60;
		}else{
            $("#btn7").attr('disabled',true);
	    	document.getElementById("btn7").onclick=function(){return false;};
            if (isEnglish == 'e') {
                obj.attr('value',"Resend(" + wait + ")");
            } else {
                obj.attr('value',"重新发送(" + wait + ")");
            }
	    	wait--;
	        id_set_timeout = setTimeout(function() {
	        	sendPhoneCodetime(isEnglish);
	        },
	        1000);
		}
	}else{
		clearTimeout(id_set_timeout);
		id_set_timeout = null
		wait = 60;
	}
}

//修改手机号 提交修改
function Save_Phone(isEnglish)
{
	var phone_num = $('#newphonenum').val();
	var oldphone = $('#oldPhone').val();

	var phoneVerifyCode = $('#validatecode').attr('value');
	if(chk_phone_num(isEnglish,"mobile") == 1 && $.trim(phoneVerifyCode) == ''){
          if(isEnglish == 'e')
  		{
              $('#modify_phone_err_notice').html('Wrong SMS code');
              $('#modify_phone_err_tr').show();
  		}
  		else
  		{
              $('#modify_phone_err_notice').html('短信验证码错误');
              $('#modify_phone_err_tr').show();
  		}
		$('#validatecode').focus();
		return false;
	} else if((chk_phone_num(isEnglish,"mobile") == 1 && $.trim(phoneVerifyCode) != '') || chk_phone_num(isEnglish,"mobile") == 2) {
		$("#modify_phone_err_tr").hide();
		//ajax 提交修改
		var action_url = IPATH+"/resume/ajax/userinfo_edit.php?" + Math.random() + '&jsoncallback=?';
		$.getJSON( action_url, {action_type: "save", action: "user_phone",phone:oldphone,newphone: phone_num, isenglish: isEnglish, phonecode:phoneVerifyCode } , function(result) {
			
		if(result.status == 1)
		{
			if(isEnglish == "e")
			{
				var html = '<div class="panel_lnp panel_py"><h2><p>Advice</p><a class="layer_close" href="javascript:;"><i></i></a></h2><div class="pannel_con"><div class="gp3"><strong class="wd f16 center c_orange">Congratulations! Phone updated.</strong></div></div></div>';
			}
			else
			{
				var html = '<div class="panel_lnp panel_py"><h2><p>资料修改</p><a class="layer_close" href="javascript:;"><i></i></a></h2><div class="pannel_con"><div class="gp3"><strong class="wd f16 center c_orange">恭喜你，修改成功！</strong></div></div></div>';
			}
			
			oLayerSettings = jQuery.FLayer.init();
			jQuery.FLayer.setContent(oLayerSettings,html);
			jQuery.FLayer.open(oLayerSettings);
			if($("#tele").is('input'))
			{
				$("#tele").val(phone_num);
                if(isEnglish == 'e'){
                    $("#mobilepointer").html("Edit");
                }else{
                    $("#mobilepointer").html("修改");
                }
			}
			else
			{
				$("#tele").html(phone_num);					
			}
			$("#mobile_confirm_verifystatus").val("1");
			$("#tri_mobilepointer").parent().removeClass("pointer").attr("onclick", "");
            $("#tri_mobilepointer").remove();   
			setTimeoutClose();	
		}
		else
		{
			$("#modify_phone_err_tr").show();
			$("#modify_phone_err_notice").html(result.result);
		}
		
		});//end save phone post
		
	}
	return false;
}

function chk_phone_num(isEnglish,ismobile){
	var phone_num = $.trim($('input[name="newPhone"]').attr('value'));
	var oldPhone = $('#oldPhone').attr('value');
    var verifystatus = $('#verifystatus').attr('value');
	var errMsg = '';
    var objPhoneCheck =  new mobileComponent();//使用的是本文件的mobileComponent
	if ($.trim(phone_num) == '') {
        if (isEnglish == 'e') {
            errMsg = objPhoneCheck.sMobileEmptyErrorMessage_EN;
        } else {
            errMsg = objPhoneCheck.sMobileEmptyErrorMessage_CN;
        }
	} else {
        if (phone_num.length == 11 && ismobile == undefined) {
            if (!objPhoneCheck.checkMobile(phone_num)) {
                if (isEnglish == 'e') {
                    errMsg = objPhoneCheck.sMobileErrorMessage_CHINA_EN;
                } else {
                    errMsg = objPhoneCheck.sMobileErrorMessage_CHINA_CN;
                }
    		}
            if (phone_num == oldPhone && verifystatus == 3) {
                if (isEnglish == 'e') {
                    errMsg = objPhoneCheck.sBindMobileErrorMessage_MOBILE_SAME_EN;
                } else {
                    errMsg = objPhoneCheck.sBindMobileErrorMessage_MOBILE_SAME_CN;
                }
            }
        }else if (phone_num.length > 0 && phone_num.length <=20 && objPhoneCheck.checkMobile(phone_num,'000') && ismobile ) {      
        	
        	if (phone_num.length == 11 && objPhoneCheck.checkMobile(phone_num)) {
 				return 1;
    		}
        	  	
         if (verifystatus == 3) {//
                if (isEnglish == 'e') {
                    errMsg = objPhoneCheck.sMobileErrorMessage_CHINA_EN;
                } else {
                    errMsg = objPhoneCheck.sMobileErrorMessage_CHINA_CN;
                }
                $('#modify_phone_err_notice').html(errMsg);
                $('#modify_phone_err_tr').show();
               
            } else {
                if (isEnglish == 'e') {
                    errMsg = objPhoneCheck.sBindMobileErrorMessage_foreign_EN;
                } else {
                    errMsg = objPhoneCheck.sBindMobileErrorMessage_foreign_CN;
                }
                $('#modify_phone_err_notice').html(errMsg);
                $('#modify_phone_err_tr').show();
                return 2;//2-外国号码
            }      
            
        }else {//有问题号码
            if (isEnglish == 'e') {
                errMsg = objPhoneCheck.sMobileErrorMessage_EN;
            } else {
                errMsg = objPhoneCheck.sMobileErrorMessage_CN;
            }
        }
	}
	if(errMsg != '')
	{
		$("#modify_phone_err_notice").html(errMsg);
		$("#modify_phone_err_tr").show();
		return 0;
	}
	else{
		$('#modify_phone_err_notice').html('');
		$('#modify_phone_err_tr').hide();
		if(id_set_timeout == null){
			$("#btn7").attr('disabled',false);
		}
		return 1;
	}
}


function sendPhoneCode(isEnglish){
	var phoneNum = $.trim($('input[name="newPhone"]').attr('value'));
	var oldPhone = $('#oldPhone').attr('value');
	if(chk_phone_num(isEnglish, 'mobile') == 1 && chk_phone_num(isEnglish) == 1){

		var url = LOGINPATH+"/ajax/sendphonecode.php?rand="+new Date().getTime()+"&jsoncallback=?&";
		var data = { mobile: phoneNum, isEnglish:isEnglish, type:10 };
		//ajax 发送手机验证码短信
		$.getJSON(url, data , function(result) {
			if(result.status != 1)
			{
					$("#modify_phone_err_tr").show();
					$("#modify_phone_err_notice").html(result.result);				
			}
			else
			{
				//定时器
				sendPhoneCodetime(isEnglish);
				//发送成功
				if(isEnglish == 'c')
				{
					$("#modify_phone_err_tr").show();
					$("#modify_phone_err_notice").html("验证码已发送，请查看手机。");
				}
				else
				{
					$("#modify_phone_err_tr").show();
					$("#modify_phone_err_notice").html('We have sended the code to your phone，please check your SMS');
				}
			}
		})// end getJSON

	}
}

function setTimeoutClose()
{
	//2秒自动隐藏处理
	if ( this.showMemoTimtout ) {
		clearTimeout( this.showMemoTimtout );
	}
	this.showMemoTimtout = setTimeout( function() {
		$("#layer_id").fadeOut(300);
		$("#layer_back_drop").fadeOut(300);
	} , 2000 );
}

