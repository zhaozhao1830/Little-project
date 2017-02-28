function Refreshresume(ReSumeID,Lang,DOMAIN_MY)
{
	if(ReSumeID == "")
	{
		if(Lang == "e")
			alert("You have no resume to refresh!");
		else
			alert("没有简历可供刷新！");
		return;
	}

	if(Lang == "e")
	{
		var html = '<div class="panel_lnp panel_py"><h2><p>Adivce</p><a class="layer_close" href="#"><i></i></a></h2><div class="pannel_con"><div class="gp3"><strong class="wd f16 center c_orange">Congratulations! Resume updated.</strong></div></div></div>';
	}
	else
	{
		var html = '<div class="panel_lnp panel_py"><h2><p>提示</p><a class="layer_close" href="#"><i></i></a></h2><div class="pannel_con"><div class="gp3"><strong class="wd f16 center c_orange">恭喜你，简历刷新成功！</strong></div></div></div>';
	}
		
	var request_url = DOMAIN_MY + '/ajax/refresh_resume.php?'+ Math.random() + '&jsoncallback=?';
	$.getJSON(request_url,{ReSumeID:ReSumeID,Lang:Lang}, function(result) {
		
            oLayerSettings = jQuery.FLayer.init();
            jQuery.FLayer.setContent(oLayerSettings,html);
            jQuery.FLayer.open(oLayerSettings);
            if($("#resume_lastupdate").length > 0)
            {
               $("#resume_lastupdate").text(result.lastupdate);	
            }            
            
            if($("#LastUpdate_"+ReSumeID).length > 0)
            {
            	 $("#LastUpdate_"+ReSumeID).text(result.lastupdate);	
            }

	});
    
}



function RefreshresumeAll(ReSumeID,Lang,DOMAIN_MY)
{
	if(ReSumeID == "")
	{
		if(Lang == "e")
			alert("You have no resume to refresh!");
		else
			alert("没有简历可供刷新！");
		return;
	}

	if(Lang == "e")
	{
		var html = '<div class="panel_lnp panel_py"><h2><p>Adivce</p><a class="layer_close" href="#"><i></i></a></h2><div class="pannel_con"><div class="gp3"><strong class="wd f16 center c_orange">Congratulations! Resume updated.</strong></div></div></div>';
	}
	else
	{
		var html = '<div class="panel_lnp panel_py"><h2><p>提示</p><a class="layer_close" href="#"><i></i></a></h2><div class="pannel_con"><div class="gp3"><strong class="wd f16 center c_orange">恭喜你，简历刷新成功！</strong></div></div></div>';
	}
	
	var all = 'all';	
	var request_url = DOMAIN_MY + '/ajax/refresh_resume.php?'+ Math.random() + '&jsoncallback=?';
	$.getJSON(request_url,{ReSumeID:ReSumeID,Lang:Lang,all:all}, function(result) {
		
            oLayerSettings = jQuery.FLayer.init();
            jQuery.FLayer.setContent(oLayerSettings,html);
            jQuery.FLayer.open(oLayerSettings);
            if($("#resume_lastupdate").length > 0)
            {
               $("#resume_lastupdate").text(result.lastupdate);	
            }            
            
            if($("#LastUpdate_"+ReSumeID).length > 0)
            {
            	 $("#LastUpdate_"+ReSumeID).text(result.lastupdate);	
            }

	});
    
}