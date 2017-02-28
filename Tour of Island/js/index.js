//阻止浏览器默认行为
document.addEventListener("touchstart",function(ev){
	ev.preventDefault();
},{
	passive:false
})
//页面加载的时候
$("#nr").css({
	"background":"rgba(0,200,200,0.6)",
	"textAlign":"center",
	"lineHeight":$(this).height(),
}).html("页面加载中")


//页面初始化完成之后调用初始化页面
$(function(){
	defaults.init();
	//添加事件
	defaults.events()
})


var defaults={};
//初始化页面
defaults.init=function(){
	//显示页面的时候，将header隐藏,将nr的高度变成页面的高度,top变成0
	$("#header").css({
		"display":"none"
	})
	$("#nr").css({
		"top":0,
		"height":$(window).height()
	})
	
	//将所有屏都隐藏在屏幕下方,只显示第一屏
	var translateTop=-$(".main-page").height();
	$(".main-page").css("top",-translateTop);
	$(".main-page").eq(0).css("top",0)
	//音乐播放器始终旋转
	$("#audio_btn").addClass("rotateEle")
	//向上拖拽小尖头
	$(".arrows").addClass("animated fadeOutUp").css({
		"-webkit-animation-iteration-count":"infinite",
		"-webkit-animation-duration":"2s"
	})
	
	//第一屏动画效果
	firstScreen.init()
	//第三屏拆分文字
	thirdScreen.breakwords();	
	//第四屏拆分文字
	forthScreen.breakWord($(".main-page-4"));
	//第五屏拆分文字
	forthScreen.breakWord($(".main-page-5"));	
}
//给页面添加事件
defaults.events=function(){
	var nowScreen=0;
	var startY=null;
	var down=false;
	var up=false;
	var disY=0;
	var targetEle=null;
	var prevTop=parseInt($("#nr").css("height"));
	var moveEvent=false;
//	//在页面上按下的时候
	$(".main-page").on("touchstart",function(ev){		
		startY=ev.changedTouches[0].pageY;
		up=false;
		down=false;
		disY=0;
	})
	//在页面上移动时
	$(".main-page").on("touchmove",function(ev){
		disY=ev.changedTouches[0].pageY-startY;

		if(disY>30){
			down=true
		}else if(disY<-30){
			up=true
		}
		
		//如果下一屏存在,向上的
		if(disY<0 && nowScreen<$(".main-page").length-1){
			
			targetEle=$(".main-page").eq(nowScreen+1);
			$(".main-page").eq(nowScreen).css("z-index",25);
			$(".main-page").eq(nowScreen+1).css("z-index",30)
			targetEle.css("top",prevTop+disY);
			if(moveEvent===false){
				moveEvent=true;
				clearAnimation(nowScreen)
				switch(nowScreen){
					case 0://如果当前处于第一屏
						secondScreen.init();
						break;
					case 1:
						thirdScreen.init();
						break;
					case 2:
						forthScreen.init();
						break;
					case 3:
						fifthScreen.init();
						break;
					case 4:
						sixthScreen.init();
						break;						
				}
				
			}
		}
		//滑向上一屏的时候
		if(disY>0 && (nowScreen)>0){			
			targetEle=$(".main-page").eq(nowScreen-1)
			//将其他的页面层级降低
			$(".main-page").each(function(index,item){
				$(item).css("z-index",1)
			})
			//上一个层级上升为25
			$(".main-page").eq(nowScreen).css("z-index",25)
			//当前的页面层级为30，目标页面的top为-整个页面高度，目标top为0.
			targetEle.css("z-index",30)	
			targetEle.css("top",-prevTop)	
			targetEle.css("top",disY-prevTop)
			//页面滑向上一屏的时候重新执行动画代码
			if(moveEvent===false){
				moveEvent=true;
				clearAnimation(nowScreen)
				
				switch(nowScreen){
					case 1://如果当前处于第一屏
//						alert($(".bigBird").get(0).className)
						firstScreen.init();						
//						alert($(".bigBird").get(0).className)
						break;
					case 2:
						secondScreen.init();
						break;
					case 3:
						thirdScreen.init();
						break;
					case 4:
						forthScreen.init();
						break;
					case 5:
						fifthScreen.init();
						break;
					case 6:
						sixthScreen.init();
						break;					
				}
				
			}
			
		}
		
	})
	//鼠标抬起的时候
	$(".main-page").on("touchend",function(ev){	
		//或者进度条的宽度，和页面个数
		var progress=$(".progress").width();
		var num=$(".main-page").length;
		$(".page-tips").find(".totalPages").html(num)
		//向下一页滑动的时候
		if(up && nowScreen<$(".main-page").length-1){			
			MTween({
				el:targetEle.get(0),
				target:{
					"top":0
				},
				time:200,
				type:"linear",
				callIn:function(){

				},
				callBack:function(){
					//清除当前屏的动画效果
					clearAnimation(nowScreen)
					moveEvent=false
					//当前的页面页码＋1
					nowScreen++;
					//动画执行完成之后，进度条部分跟着变化
					$(".progress").find(".progressBan").width((progress/num)*(nowScreen+1))
					$(".page-tips").find(".currentPage").html(nowScreen+1)
				}
			})
		}
		//向上一页滑动的时候
		if(down && (nowScreen)>0){
			MTween({
				el:$(".main-page").eq(nowScreen-1).get(0),
				target:{
					top:0
				},
				time:200,
				type:"linear",
				callIn:function(){

				},
				callBack:function(){
					//清除当前屏的动画效果
					clearAnimation(nowScreen)
					moveEvent=false
					//当前的页码－1
					nowScreen--;
					//动画执行完成之后，进度条部分跟着变化
					$(".progress").find(".progressBan").width((progress/num)*(nowScreen+1))
					$(".page-tips").find(".currentPage").html(nowScreen+1)
				}
			})
		}				
	})
	
	document.querySelectorAll('input').forEach(function(obj){
	  obj.addEventListener('touchstart', function(ev) {
	    ev.stopPropagation();
	  }, false);
	});
	
	//表单部分
	var tips=$(".main-page-6").find(".tips")
	//输入姓名时,姓名栏得到焦点
	
	$(".inputBox1").find("input").get(0).addEventListener("touchend",function(ev){	
		ev.stopPropagation()
		this.focus();		
	})
//	//姓名栏失去焦点时，进行正则验证
	$(".main-page-6 .inputBox1>input").on("blur",function(){		
		let val=$(this).val().trim();
		//姓名不能为空且只能为2-5个的中文
		let re=/^[\u4e00-\u9fa5]{2,5}$/;
		let bl=re.test(val);		
		
		if(!bl){
			tips.html("姓名不能为空且只能为2-5个的中文")
			return
		}else{
			tips.html("")
		}		
	})
	//输入手机号码时
	$(".main-page-6 .inputBox2>input").get(0).addEventListener("touchend",function(ev){
		this.focus()
		ev.stopPropagation()
	})
	
	//失去焦点的时候格式化手机号码
	$(".main-page-6 .inputBox2>input").on("blur",function(){
		//去除数字之间的空格
		var re=/\s+/g;
		var value=$(this).val().trim();
		value=value.replace(re,"")		
		var reg = /^(\d{3})(\d{4})(\d{4})$/;
		var matches = reg.exec(value);
		//如果号码不是11位数字，提示错误并返回
		if(matches===null){
			tips.html("号码输入有误")
			return
		}else{
			tips.html("")
		}
		var newVal = matches[1] + ' ' + matches[2] + ' ' + matches[3];					
		$(this).val(newVal)		
	})
	
	//目的地获得焦点
	$(".main-page-6 .targetPlace>input").on("touchend",function(){
		$(this).focus();		
	})
	//邮箱获取焦点
	$(".main-page-6 .email>input").on("touchend",function(){
		$(this).focus();		
	})
	//验证邮箱
	$(".main-page-6 .email>input").on("blur",function(){
		var re=/^(\w|\-)+\@([a-zA-Z0-9]{2,5})(\.[a-z]{2,3})+$/;
		var value=$(this).val().trim();
		if(!re.test(value)){
			tips.html("邮箱输入有误")
			return
		}else{
			tips.html("")
		}		
	})
	//按下提交按钮
	$(".main-page-6 .btn>input").on("touchend",function(){
		let name=$(".main-page-6 .inputBox1").find("input")
		let tel=$(".main-page-6 .inputBox2").find("input")	
		let place=$(".main-page-6 .targetPlace").find("input")
		let email=$(".main-page-6 .email").find("input")
		
		if(name.val()===""){
			tips.html("姓名不能为空")
		}else if(tel.val()===""){
			tips.html("电话不能为空")
		}else if(place.val()===""){
			tips.html("目的地不能为空")
		}else if(email.val()===""){
			tips.html("邮箱不能为空")
		}else{
			tips.html("")
		}
	})
}
//清除动画
function clearAnimation(nowScreen){
	//执行完整屏切换动画，将当前屏的动画class清除。
	$(".main-page").eq(nowScreen).find("li").each(function(index,item){
		
		$(item).removeClass("animated slideInLeft pulse bounceInLeft bounceInDown fadeInLeftBig fadeInLeft fadeInRight bounceIn bounceInUp bounceInDown bounceInRight fadeInRightBig zoomIn zoomInDown wobble fadeIn")
		
		$(item).css({
			"-webkit-animation-delay":"0s"
		})
		
	})
	$(".main-page").eq(nowScreen).find("span").each(function(index,item){		
		$(item).removeClass("animated fadeIn")
		$(item).css({
			"-webkit-animation-delay":"0s"
		})
	})
	$(".main-page").eq(nowScreen).find("div").each(function(index,item){		
		$(item).removeClass("animated fadeInRight fadeIn")
		$(item).css({
			"-webkit-animation-delay":"0s"
		})
	})
}
//第一屏内容
var firstScreen={};
//第一屏动画效果
firstScreen.init=function(){
	//进度条部分
	let progress=$(".progress").width();
	let num=$(".main-page").length;
	$(".progress").find(".progressBan").width(progress/num)
	$(".page-tips").find(".currentPage").html("1")
	$(".page-tips").find(".totalPages").html(num)
	
	//以下为第一屏动画
	let sectionOne=$(".main-page-1");
	let flower=sectionOne.find(".item1");
	//给小花添加旋转效果
	flower.addClass("rotatefinity")
	//木盘
	let woodPan=sectionOne.find(".item2");
	woodPan.addClass("animated bounceInUp");
	//树下部分
	let hill=sectionOne.find(".item3");
	hill.addClass("animated bounceInUp");
	
	//右下角树叶
	let rightBotLeaf=sectionOne.find(".item8");
	rightBotLeaf.css({
		"-webkit-animation-delay":"0s"
	}).addClass("animated zoomIn").css({
		"-webkit-animation-delay":"2s"
	});
		
	//左下角
	let leftBotLeaf=sectionOne.find(".item9");
	leftBotLeaf.addClass("animated zoomIn").css(
		{"-webkit-animation-delay":"1.0s"
		}	
	)
	//上面两个圆叶子
	sectionOne.find(".item14").addClass("animated zoomIn").css(
		{"-webkit-animation-delay":"1.2s"
		}	
	)
	sectionOne.find(".item13").addClass("animated zoomIn").css(
		{"-webkit-animation-delay":"1.4s"
		}	
	)
	//四个角的叶子
	sectionOne.find(".item5").addClass("animated bounceInDown").css(
		{"-webkit-animation-delay":"1.5s"
		}	
	)
	sectionOne.find(".item12").addClass("animated bounceInDown").css(
		{"-webkit-animation-delay":"1.6s"
		}	
	)
	sectionOne.find(".item6").addClass("animated bounceInDown").css(
		{"-webkit-animation-delay":"1.7s"
		}	
	)
	sectionOne.find(".item10").addClass("animated bounceInDown").css(
		{"-webkit-animation-delay":"1.8s"
		}	
	)
	//三个细叶子
	sectionOne.find(".item4").addClass("animated bounceInDown").css(
		{"-webkit-animation-delay":"1.9s"
		}	
	)
	sectionOne.find(".item11").addClass("animated bounceInDown").css(
		{"-webkit-animation-delay":"2.0s"
		}	
	)
	sectionOne.find(".item7").addClass("animated bounceInDown").css(
		{"-webkit-animation-delay":"2.1s"
		}	
	)
	//文字部分
	sectionOne.find(".item15").addClass("animated zoomIn").css(
		{"-webkit-animation-delay":"2.2s"
		}	
	)
	sectionOne.find(".item16").addClass("animated zoomInDown").css(
		{"-webkit-animation-delay":"2.3s"
		}	
	)
	sectionOne.find(".item17").addClass("animated zoomInDown").css(
		{"-webkit-animation-delay":"2.4s"
		}	
	)
	//大鸟部分，在一个动画执行完成之后的函数中调用另外的动画
	sectionOne.find(".bigBird").addClass("animated bounceInRight").css(
		{
			//第一个大坑（大鸟部分）：因为在动画执行完成之后，里面的animation不能被清空还存在在样式中
			//他的执行次数始终是无限次循环，动画执行完成之后的清空不能将循环清除
			//在这个地方，也就是给元素添加显示的class的时候，将元素的执行次数手动的修改为0次，也就是只执行1次
			//当动画完成之后在清除掉class和添加晃动的class,并设置执行次数是无限次。
			"-webkit-animation-delay":"2.5s",
			"-webkit-animation-iteration-count":"1"
		}	
	).on("webkitAnimationEnd",function(){
		$(this).removeClass("bounceInRight")
		$(this).addClass("wobble").css(
			{	
				"-webkit-animation-delay":"0s",
				"-webkit-animation-duration":"1.6s",
				"-webkit-animation-iteration-count":"infinite"
			}	
		)
	})

}



//第二屏内容
var secondScreen={};
//第二屏动画效果
secondScreen.init=function(){
	let sectionTwo=$(".main-page-2").eq(0);
	//星星部分
	sectionTwo.find(".itemstar5").addClass("animated fadeIn")
	sectionTwo.find(".itemstar2").addClass("animated fadeIn").css({
		"-webkit-animation-delay":"0.2s"
	})		
	sectionTwo.find(".itemstar3").addClass("animated fadeIn").css({
		"-webkit-animation-delay":"0.3s"
	})
	sectionTwo.find(".itemstar4").addClass("animated fadeIn").css({
		"-webkit-animation-delay":"0.4s"
	})
	sectionTwo.find(".itemstar6").addClass("animated fadeIn").css({
		"-webkit-animation-delay":"0.5s"
	})
	sectionTwo.find(".itemstar1").addClass("animated fadeIn").css({
		"-webkit-animation-delay":"0.6s"
	})
	sectionTwo.find(".itemstar7").addClass("animated fadeIn").css({
		"-webkit-animation-delay":"0.7s"
	})
	sectionTwo.find(".itemstar8").addClass("animated fadeIn").css({
		"-webkit-animation-delay":"0.8s"
	})
	//第二屏下方
	sectionTwo.find(".scene2-bottom").addClass("animated bounceInUp").css({
		"-webkit-animation-delay":"1.5s"
	})
	//三块木板
	sectionTwo.find(".woodBan1").addClass("animated bounceInDown").css({
		"-webkit-animation-delay":"2s"
	})
	sectionTwo.find(".woodBan2").addClass("animated bounceInDown").css({
		"-webkit-animation-delay":"2.2s"
	})
	sectionTwo.find(".woodBan3").addClass("animated bounceInDown").css({
		"-webkit-animation-delay":"2.4s"
	}).on("animationend",function(){
	})
	//木板里面的内容
	
	
	sectionTwo.find(".woodBanTop1").addClass("animated fadeIn").css({
		"-webkit-animation-delay":"3.0s"
	})
	sectionTwo.find(".woodBanBot1").addClass("animated fadeIn").css({
		"-webkit-animation-delay":"3.1s"
	})
	sectionTwo.find(".woodBanTop2").addClass("animated fadeIn").css({
		"-webkit-animation-delay":"3.2s"
	})
	sectionTwo.find(".woodBanBot2").addClass("animated fadeIn").css({
		"-webkit-animation-delay":"3.3s"
	})
	sectionTwo.find(".woodBanTop3").addClass("animated fadeIn").css({
		"-webkit-animation-delay":"3.4s"
	})
	sectionTwo.find(".woodBanBot3").addClass("animated fadeIn").css({
		"-webkit-animation-delay":"3.5s"
	})
}

var thirdScreen={};
//给第一个文字框的每个文字包一层span
thirdScreen.breakwords=function(){
	$(".main-page-3").find(".itemWords1>div").each(function(index,item){	
		let strArray=Array.from($(item).html())
		var newstr=strArray.map(function(item){
			return "<span>"+item+"</span>"
		}).join("");
		$(this).html(newstr)
	})
}
thirdScreen.init=function(){
	
	let sectionThree=$(".main-page-3");
	//白色条形区域
	sectionThree.find(".item5").addClass("animated fadeIn");
	sectionThree.find(".itemBird").addClass("animated bounceInRight").css({
		"-webkit-animation-delay":"0.2s"
	})
	sectionThree.find(".item2").addClass("animated fadeInUp").css({
		"-webkit-animation-delay":"0.2s"
	})
	sectionThree.find(".item3").addClass("animated fadeIn").css({
		"-webkit-animation-delay":"0.2s"
	})
	sectionThree.find(".item1").addClass("animated fadeIn").css({
		"-webkit-animation-delay":"0.2s"
	})
	sectionThree.find(".item4").addClass("animated fadeIn").css({
		"-webkit-animation-delay":"0.2s"
	})
	sectionThree.find(".itemflower").addClass("rotateEle").css({
		"-webkit-animation-delay":"0.2s"
	})
	sectionThree.find(".itemPic").addClass("animated fadeInLeftBig").css({
		"-webkit-animation-delay":"0.2s"
	})
	sectionThree.find(".itemLeaf").addClass("animated slideInLeft").css({
		"-webkit-animation-delay":"0.3s"
	})
	sectionThree.find(".itemRLeaf").addClass("animated bounceInRight").css({
		"-webkit-animation-delay":"0.4s"
	})
	sectionThree.find(".woodBan").addClass("animated bounceInDown").css({
		"-webkit-animation-delay":"1s"
	})
	sectionThree.find(".woodBanTop").addClass("animated fadeIn").css({
		"-webkit-animation-delay":"1.8s"
	})
	sectionThree.find(".woodPanWord1").addClass("animated fadeIn").css({
		"-webkit-animation-delay":"2s"
	})
	
	sectionThree.find(".woodPan1").addClass("animated bounceInLeft").css({
		"-webkit-animation-delay":"2.2s"
	})
	sectionThree.find(".woodPanWord2").addClass("animated fadeIn").css({
		"-webkit-animation-delay":"2.2s"
	})
	sectionThree.find(".woodPan2").addClass("animated bounceInRight").css({
		"-webkit-animation-delay":"2.5s"
	})	
	var time=2.5;
	sectionThree.find(".itemWords1 span").each(function(index,item){
		time+=0.1;
		$(this).addClass("animated fadeIn").css({"-webkit-animation-delay":(time)+"s"})
	})
	
	time-=0.5;
	sectionThree.find(".itemWords2>div").each(function(index,item){
		time+=0.1
		$(this).addClass("animated fadeInRight").css({
			"-webkit-animation-delay":time+"s"
		})
	})	
}
//第四屏动画
var forthScreen={};
//将forthScreen中的文字部分，包一层span
forthScreen.breakWord=function(sectionFour){
	if(sectionFour.find(".itemWords1")){
		sectionFour.find(".itemWords1>div").each(function(index,item){	
			let str=Array.from($(item).html()).map(function(item){
				return "<span>"+item+"</span>"
			}).join("");
		
			$(this).html(str)
		})
	}
	
	if(sectionFour.find(".itemWords2")){
		sectionFour.find(".itemWords2>div").each(function(index,item){	
			let str=Array.from($(item).html()).map(function(item){
				return "<span>"+item+"</span>"
			}).join("");
			$(this).html(str)
		})
	}
	
}
forthScreen.init=function(){
	
	let sectionFour=$(".main-page-4");
	sectionFour.find(".itemPic").addClass("animated fadeIn");
	sectionFour.find(".redBird").addClass("animated fadeInRightBig").css({
		"-webkit-animation-delay":"0.2s"
	});
	sectionFour.find(".thinLeafLB1").addClass("animated bounceInDown").css({
		"-webkit-animation-delay":"0.3s"
	});
	sectionFour.find(".thinLeafLB3").addClass("animated bounceInDown").css({
		"-webkit-animation-delay":"0.4s"
	});
	sectionFour.find(".thinLeafL2").addClass("animated bounceInDown").css({
		"-webkit-animation-delay":"0.5s"
	});
	sectionFour.find(".thinLeafLB2").addClass("animated bounceInDown").css({
		"-webkit-animation-delay":"0.6s"
	});
	sectionFour.find(".thinLeafL1").addClass("animated bounceInDown").css({
		"-webkit-animation-delay":"0.7s"
	});
	sectionFour.find(".woodBan").addClass("animated bounceInDown").css({
		"-webkit-animation-delay":"0.8s"
	});
	sectionFour.find(".woodBan").addClass("animated bounceInDown").css({
		"-webkit-animation-delay":"0.8s"
	});
	sectionFour.find(".woodBanTop").addClass("animated fadeIn").css({
		"-webkit-animation-delay":"1.5s"
	});
	sectionFour.find(".itemLongLeaf1").addClass("animated bounceInLeft").css({
		"-webkit-animation-delay":"1.7s"
	})
	sectionFour.find(".itemLongLeaf2").addClass("animated bounceInLeft").css({
		"-webkit-animation-delay":"1.8s"
	})
	sectionFour.find(".flower1").addClass("animated fadeIn").css({
		"-webkit-animation-delay":"2s"
	})
	sectionFour.find(".flower2").addClass("animated fadeIn").css({
		"-webkit-animation-delay":"2.2s"
	})
	sectionFour.find(".itemBird2").addClass("animated fadeInLeft").css({
		"-webkit-animation-delay":"2.3s"
	})
	sectionFour.find(".itemBird1").addClass("animated fadeInLeft").css({
		"-webkit-animation-delay":"2.4s"
	})
	sectionFour.find(".itemBirdL1").addClass("animated fadeInRight").css({
		"-webkit-animation-delay":"2.6s"
	})
	sectionFour.find(".woodPan2").addClass("animated bounceInLeft").css({
		"-webkit-animation-delay":"2.8s"
	})
	sectionFour.find(".woodPan1").addClass("animated bounceInRight").css({
		"-webkit-animation-delay":"3s"
	})
	sectionFour.find(".woodPanWord2").addClass("animated bounceInLeft").css({
		"-webkit-animation-delay":"3.2s"
	})
	sectionFour.find(".woodPanWord1").addClass("animated bounceInRight").css({
		"-webkit-animation-delay":"3.4s"
	})
	var time=3.4;
	sectionFour.find(".itemWords2 span").each(function(index,item){
		time+=0.1;
		$(item).addClass("animated fadeIn").css({
			"-webkit-animation-delay":time+"s",
			"-webkit-animation-duration":"0.1s"
		})
	})
	time=3.4;
	sectionFour.find(".itemWords1 span").each(function(index,item){
		time+=0.1;
		$(item).addClass("animated fadeIn").css({
			"-webkit-animation-delay":time+"s",
			"-webkit-animation-duration":"0.1s"
		})
	})
	
	
}

//第五屏动画
var fifthScreen={};

fifthScreen.init=function(){
	
	let sectionFive=$(".main-page-5");
	sectionFive.find(".band").addClass("animated fadeIn").css({
		"-webkit-animation-duration":"1s"
	})
	sectionFive.find(".itemPic").addClass("animated bounceIn").css({
		"-webkit-animation-delay":"0.6s"
	})
	sectionFive.find(".banana5").addClass("animated fadeIn").css({
		"-webkit-animation-delay":"0.8s"
	})
	sectionFive.find(".banana3").addClass("animated fadeIn").css({
		"-webkit-animation-delay":"1.0s"
	})
	sectionFive.find(".banana2").addClass("animated fadeIn").css({
		"-webkit-animation-delay":"1.2s"
	})
	sectionFive.find(".banana1").addClass("animated fadeIn").css({
		"-webkit-animation-delay":"1.4s"
	})
	sectionFive.find(".whitebird2").addClass("animated fadeIn").css({
		"-webkit-animation-delay":"1.7s"
	})
	sectionFive.find(".whitebird1").addClass("animated fadeIn").css({
		"-webkit-animation-delay":"1.9s"
	})
	sectionFive.find(".whitebird3").addClass("animated fadeIn").css({
		"-webkit-animation-delay":"2.1s"
	})
	sectionFive.find(".woodBan1").addClass("animated bounceInDown").css({
		"-webkit-animation-delay":"1.8s"
	})
	sectionFive.find(".woodBanTop").addClass("animated fadeIn").css({
		"-webkit-animation-delay":"2.3s"
	})
	sectionFive.find(".woodPan2").addClass("animated bounceInLeft").css({
		"-webkit-animation-delay":"2.5s"
	})
	sectionFive.find(".woodPanWord2").addClass("animated bounceInLeft").css({
		"-webkit-animation-delay":"2.8s"
	})
	sectionFive.find(".woodPan1").addClass("animated bounceInRight").css({
		"-webkit-animation-delay":"2.8s"
	})
	sectionFive.find(".woodPanWord1").addClass("animated bounceInRight").css({
		"-webkit-animation-delay":"3.2s"
	})
	var time=4;
	sectionFive.find(".itemWords1 span").each(function(index,item){
		time+=0.1
		$(item).addClass("animated fadeIn").css({
			"-webkit-animation-delay":time+"s",
			"-webkit-animation-duration":"0.1s"
		})
	})
	time=4;
	sectionFive.find(".itemWords2 span").each(function(index,item){
		time+=0.1
		$(item).addClass("animated fadeIn").css({
			"-webkit-animation-delay":time+"s",
			"-webkit-animation-duration":"0.1s"
		})
	})	
}

//第六屏动画
var sixthScreen={};
sixthScreen.init=function(){
	let sectionSix=$(".main-page-6");
	sectionSix.find(".woodBan").addClass("animated bounceInDown")
	sectionSix.find(".woodBanTop").addClass("animated fadeIn").css({
		"-webkit-animation-delay":"1s"
	})
	sectionSix.find(".inputBox1").addClass("animated fadeIn").css({
		"-webkit-animation-delay":"1.3s"
	})
	sectionSix.find(".inputBox2").addClass("animated fadeIn").css({
		"-webkit-animation-delay":"1.6s"
	})
	sectionSix.find(".targetPlace").addClass("animated fadeIn").css({
		"-webkit-animation-delay":"1.9s"
	})
	sectionSix.find(".email").addClass("animated fadeIn").css({
		"-webkit-animation-delay":"2.2s"
	})
	sectionSix.find(".btn").addClass("animated fadeIn").css({
		"-webkit-animation-delay":"2.5s"
	})
	sectionSix.find(".itemsmallLeaf").addClass("animated fadeInRight").css({
		"-webkit-animation-delay":"2.7s"
	})
	sectionSix.find(".itemBird2").addClass("animated bounceInUp").css({
		"-webkit-animation-delay":"2.9s",
		"-webkit-animation-duration":"1s",
	})
	sectionSix.find(".itemLeaf").addClass("animated fadeInLeft").css({
		"-webkit-animation-delay":"2.7s"
	})
	sectionSix.find(".itemLongLeaf").addClass("animated fadeInLeft").css({
		"-webkit-animation-delay":"2.9s"
	})
	sectionSix.find(".itemBirdR").addClass("animated fadeInLeft").css({
		"-webkit-animation-delay":"3.1s"
	})	
}

