var main={};
main.timeScroll=null;//主体动画实例
main.currentStep="step1";//默认当前的状态为step1
//初始化页面
main.init=function(){	
	
	main.events();//配制初始事件
	main.initAnimation();//首屏的动画效果
	$("body").height(8500);
	main.resize();//设置每一屏的高度和top值
	main.mainAnimation();//配制主体动画和每屏小动画
	//第二屏里面的小动画执行
	scene2Animation.init();//第二屏动画初始化
	scene3Animation.init();//第三屏动画初始化
	scene5Animation.init();//第五屏动画初始化
}

//页面加载完成之后
$(function(){
	main.init()
})
//配制初始事件
main.events=function(){
	
	this.navMouse();//设置导航的鼠标事件动画
	this.button3D(".start",".state1",".state2",0.2);//按钮3D翻转效果
	this.button3D(".button1",".state1",".state2",0.2);//第五瓶按钮翻转
	this.button3D(".button2",".state1",".state2",0.2);//第五瓶按钮翻转
	
	//清除掉浏览器默认的滚轮行为
	$(".wrapper").on("mousewheel",function(ev){
		ev.preventDefault();
	})
	$(".wrapper").one("mousewheel",mouseWheelFn)
	//滚轮函数
	let timer=null;
	function mouseWheelFn(ev,delta){
		if(delta<0){		//向下
			main.stepScroll("next")
		}else{//向上
			main.stepScroll("pre")
		}		
		//鼠标滚轮事件每次滚动的时候只执行一次，用延时定时器，每次执行的时候都要等1200毫秒之后执行，
		//如果没有等1200，那么下次再滚动的时候就会把之前的定时器清除，重新执行本次的定时器
		clearTimeout(timer)
		timer=setTimeout(function(){
			if($(window).width()>780){
				$(".wrapper").one("mousewheel",mouseWheelFn)
			}
		},1200)
	}
	
	//在滚轮上滚动的时候，主动画随着滚轮滚动
	$(window).on("scroll",main.scrollFn);
	//当鼠标在滚动条上抬起的时候，判断停留在哪一屏上面
	$(window).on("mouseup",main.scrollMouseUp)
	$(window).on("resize",this.resize);//调整屏幕大小时。重新计算每一屏的高度和top值
	
}
//当鼠标在滚动条上抬起的时候，判断停留在哪一屏上面
main.scrollMouseUp=function(){
	let prop=main.proportion();
	let currentTime=prop*main.timeScroll.totalDuration();
	//获取上一个状态和上一个状态的时间
	let prevStep=main.timeScroll.getLabelBefore(currentTime);
	let prevTime=main.timeScroll.getLabelTime(prevStep)
	//获取下一个状态和下一个状态的时间
	let nextStep=main.timeScroll.getLabelAfter(currentTime);
	let nextTime=main.timeScroll.getLabelTime(nextStep)
	
	let prevdiffer=Math.abs(prevTime-currentTime);
	let nextdiffer=Math.abs(nextTime-currentTime);
	
	let step="";
	//1.当prop=0时，step="step1"
	//2.当prop=1时，step="step5"
	//3.currentTime-prevTime<nextTime-currentTime,step=prevStep
	//4.currentTime-prevTime>nextTime-currentTime,step=nextStep
	if(prop===0){
		step="step1"
	}else if(prop===1){
		step="footer"
	}else if(nextdiffer>prevdiffer){
		step=prevStep
	}else if(nextdiffer<prevdiffer){
		step=nextStep
	}
	
	main.timeScroll.tweenTo(step);
	main.currentStep=step;
	//设置滚动条的滚动距离
	let totalTime=main.timeScroll.totalDuration();
	let steptime=main.timeScroll.getLabelTime(step);
	let maxH=$(document).height()-$(window).height();
	let positionY=steptime/totalTime*maxH;
	let animation=new TimelineMax();
	//设置滚动条滚动的时间
	let d=Math.abs(main.timeScroll.time()-steptime);
	//配制滚动条滚动的动画
	animation.to("document,body",d,{"scrollTop":positionY})
	
}
//计算在滚轮上滚动时，滚动的比例
main.proportion=function(){
	let scrollT=$(window).scrollTop();
	let maxH=$(document).height()-$(window).height();
	let s=scrollT/maxH;
	return s
}
//在滚轮上滚动的时候，主动画随着滚轮滚动
main.scrollFn=function(){
	//获取到动画执行的时间点
	var t=main.proportion()*main.timeScroll.totalDuration();
	//让主动画直接执行到对应的时间点
	main.timeScroll.seek(t,false)	
}
//配制滚轮滚动的时候的动画
main.stepScroll=function(value){
	if(value==="next"){//向下滚动
		//获取当前的状态的时间
		let currentT=main.timeScroll.getLabelTime(main.currentStep);
		//获取下一个状态的字符串		
		let nextStep=main.timeScroll.getLabelAfter(currentT);
		if(!nextStep) return;
		//配制滚动条的滚动距离
		let totalTime=main.timeScroll.totalDuration();
		let nexttime=main.timeScroll.getLabelTime(nextStep);
		let maxH=$(document).height()-$(window).height();
		let positionY=nexttime/totalTime*maxH;
		let animation=new TimelineMax();
		//设置滚动条滚动的时间
		let d=Math.abs(main.timeScroll.time()-nexttime);
		//配制滚动条滚动的动画
		animation.to("html,body",d,{"scrollTop":positionY})
		
		//运动到下一个状态
		//main.timeScroll.tweenTo(nextStep);
		main.currentStep=nextStep;
		
	}else{//向上滚动
		
		//获取当前的状态的时间
		let currentT=main.timeScroll.getLabelTime(main.currentStep);
		//获取上一个状态的字符串
		let prevStep=main.timeScroll.getLabelBefore(currentT);
		if(!prevStep) return;
		//配制滚动条的滚动距离
		let totalTime=main.timeScroll.totalDuration();
		let prevtime=main.timeScroll.getLabelTime(prevStep);
		let maxH=$(document).height()-$(window).height();
		let positionY=prevtime/totalTime*maxH;
		let animation=new TimelineMax();
		//设置滚动条滚动的时间
		let d=Math.abs(main.timeScroll.time()-prevtime);
		//配制滚动条滚动的动画
		animation.to("html,body",d,{"scrollTop":positionY})
		
		//运动到上一个状态
		//main.timeScroll.tweenTo(prevStep);
		main.currentStep=prevStep;
	}
	
}
//首屏的动画效果
main.initAnimation=function(){
	var initAni=new TimelineMax();
	//导航条的动画
	initAni.to(".menu",0.5,{opacity:1})
	initAni.to(".menu",0.5,{left:22},"-=0.3")
	initAni.to(".nav",0.3,{opacity:1})
	//首屏内容动画
	initAni.to(".scene1_logo",0.3,{opacity:1})
	initAni.staggerTo(".scene1_1 img",1,{opacity:1,rotationX:0,ease:Elastic.easeout},0.5)	
	initAni.to(".light_left",0.5,{rotationZ:0,ease:Cubic.easeOut},"-=1")
	initAni.to(".light_right",0.5,{rotationZ:0,ease:Cubic.easeOut},"-=1")
	initAni.to(".controls",0.5,{opacity:1},"-=0.5")
	//body的滚动条
	initAni.to("body",0.5,{"overflow-y":"scroll"})	
}
//设置导航的鼠标事件动画
main.navMouse=function(){
	//导航区
	var navAnimate=new TimelineMax();
	$(".nav").on("mouseenter","a",function(){
		let w=$(this).width();
		let l=$(this).offset().left;
		navAnimate.to(".line",0.3,{opacity:1,left:l,width:w})
	})
	$(".nav").on("mouseleave","a",function(){
		navAnimate.to(".line",0.3,{opacity:0})
	})
	//语言栏
	var enAnimate=new TimelineMax();
	$(".language").on("mouseenter",function(){
		enAnimate.to(".dropdown",0.3,{opacity:1,display:"block"})
	})
	$(".language").on("mouseleave",function(){
		enAnimate.to(".dropdown",0.3,{opacity:0,display:"none"})
	})
	//左侧小导航
	$(".btn_mobile").on("click",function(){
		let animate=new TimelineMax();
		animate.to($(".left_nav"),0.3,{left:0,display:"block"})
	})
	$(".l_close").on("click",function(){
		let animate=new TimelineMax();
		animate.to($(".left_nav"),0.3,{left:-300,display:"none"})
	})
}
//按钮3D翻转效果
main.button3D=function(obj,element1,element2,d){
	var button3DAnimate = new TimelineMax();
	
	//初始化两个面
	button3DAnimate.to($(obj).find(element1),0,{rotationX:0,transformPerspective:600,transformOrigin:"center bottom"})
	button3DAnimate.to($(obj).find(element2),0,{rotationX:-90,transformPerspective:600,transformOrigin:"top center"})
	//注意：移入和移出不能用同一个动画实例，会互相冲突
	$(obj).on("mouseenter",function(){
		let animate=new TimelineMax();
		let ele1=$(this).find(element1);
		let ele2=$(this).find(element2);
		animate.to(ele1,d,{rotationX:90,top:-ele1.height(),ease:Cubic.easeInOut},0)//延迟时间设置为0，两个动画同时运动
		animate.to(ele2,d,{rotationX:0,top:0,ease:Cubic.easeInOut},0)
	})
	$(obj).on("mouseleave",function(){
		let animate=new TimelineMax();
		let ele1=$(this).find(element1);
		let ele2=$(this).find(element2);
		animate.to(ele1,d,{rotationX:0,top:0,ease:Cubic.easeInOut},0)//延迟时间设置为0，两个动画同时运动
		animate.to(ele2,d,{rotationX:-90,top:ele2.height(),ease:Cubic.easeInOut},0)
	})
}
//设置每一屏的高度和top值
main.resize=function(){
	$(".scene").css("height",$(window).height());
	$(".scene:not(':first')").css("top",$(window).height());
	//当屏幕大小改变的时候，再次执行主动画到对应的时间点
	main.mainAnimation();
	//当页面宽度小于950的时候
	if($(window).width()<780){
		$("body").addClass("r780 r950")
		$("body").css("height","auto")//为了防止页面下方出现空白
		$(".wrapper").off();
		$(window).off("mouseup")
		$(window).off("scroll")
		$(".menu").css("top",0)		
	}else if($(window).width()<950){
		$("body").remove("r780")
		$("body").addClass("r950");
		$(".menu").css("top",0)
	}else{
		$("body").removeClass("r950")
		$(".menu").css("top",22)
	}
	
}
//配制主体动画和每屏中的小动画
main.mainAnimation=function(){
	//保存当前动画执行的时间，如果动画还未执行返回0
	let time1=main.timeScroll?main.timeScroll.time():0;
	if(main.timeScroll){//如果存在，就清除掉
		main.timeScroll.clear()
	}
	main.timeScroll=new TimelineMax();
	//当主动画处于第一屏的时候，将第二屏动画重置为最初始状态
	main.timeScroll.to({},0,{onReverseComplete:function(){
		scene2Animation.timeline.seek(0,false)
	}},0)
	//主动画一开始，将footer的高度设置为屏幕的高度隐藏
	main.timeScroll.to(".footer",0,{top:$(window).height()})
		main.timeScroll.add("step1")
	main.timeScroll.to(".scene2",0.8,{top:0,ease:Cubic.easeInOut});
	//导航3D翻转效果
	main.timeScroll.to({},0,{onComplete:function(){
		menu.changeMenu("menu_state2")
	},onReverseComplete:function(){
		menu.changeMenu("menu_state1")
	}},"-=0.4")

	//当翻转到第二屏的时候执行第二屏的第一个动画
	main.timeScroll.to({},0,{onComplete:function(){
		scene2Animation.timeline.tweenTo("state1")
	}},"-=0.2")
		main.timeScroll.add("step2")
			//----------第二屏小动画-start--
		
	main.timeScroll.to({},0,{onComplete:function(){
		scene2Animation.timeline.tweenTo("state2")
	},onReverseComplete:function(){
		scene2Animation.timeline.tweenTo("state1")
	}})
	//使第二个里面的小动画有执行的时间
	main.timeScroll.to({},0.4,{})
		main.timeScroll.add("point1")
		
	main.timeScroll.to({},0,{onComplete:function(){
		scene2Animation.timeline.tweenTo("state3")
	},onReverseComplete:function(){
		scene2Animation.timeline.tweenTo("state2")
	}})
	main.timeScroll.to({},0.4,{})
		main.timeScroll.add("point2")
		
	main.timeScroll.to({},0,{onComplete:function(){
		scene2Animation.timeline.tweenTo("state4")
	},onReverseComplete:function(){
		scene2Animation.timeline.tweenTo("state3")
	}})
	main.timeScroll.to({},0.4,{})
		main.timeScroll.add("point3")
	
	//----------第二屏小动画-end--
	main.timeScroll.to(".scene3",0.8,{top:0,ease:Cubic.easeInOut})
	//导航3D翻转效果
	main.timeScroll.to({},0,{onComplete:function(){
		menu.changeMenu("menu_state3")
	},onReverseComplete:function(){
		menu.changeMenu("menu_state2")
	}},"-=0.4")
	
	main.timeScroll.to({},0,{onComplete:function(){
		scene3Animation.timeline.tweenTo("scene3State1")
	},onReverseComplete:function(){//当返回到第三屏的时候，第三屏动画重置为初始状态
		scene3Animation.timeline.seek(0,false)
	}},"-=0.4")
		main.timeScroll.add("step3")
		//配制第三屏动画-start--------
		
	main.timeScroll.to({},0,{onComplete:function(){
		scene3Animation.timeline.tweenTo("scene3State2")
	},onReverseComplete:function(){
		scene3Animation.timeline.tweenTo("scene3State1")
	}})
	main.timeScroll.to({},0.2,{})
		main.timeScroll.add("aimate3")
		
		//配制第三屏动画-end--------
		
	main.timeScroll.to(".scene4",0.8,{top:0,ease:Cubic.easeInOut})
		main.timeScroll.add("step4")
	//翻转到第五屏，第四屏向上滚走
	main.timeScroll.to(".scene4",0.5,{top:-550,ease:Cubic.easeInOut})	
	main.timeScroll.to(".scene5",0.5,{top:0,ease:Cubic.easeInOut,onReverseComplete:function(){
		scene5Animation.timeline.seek(0,false)
	}},"-=0.5")
	//当屏幕宽度大于950的时候，导航条滚出屏幕
	if($(window).width()>950){
		main.timeScroll.to(".menu_wrapper",0,{top:-100},"-=0.5")
	}else{
		main.timeScroll.to(".menu_wrapper",0,{top:0})
	}
	main.timeScroll.to({},0,{onComplete:function(){
		scene5Animation.timeline.tweenTo("scene5Point")
	}},"-=0.5")
		main.timeScroll.add("step5")	
	//底部内容显示
	main.timeScroll.to(".scene5",0.5,{top:-$(".footer").height(),ease:Cubic.easeInOut})
	main.timeScroll.to(".footer",0.5,{top:$(window).height()-$(".footer").height(),ease:Cubic.easeInOut},"-=0.5")
		main.timeScroll.add("footer")	
	main.timeScroll.stop()
	main.timeScroll.seek(time1)//改变屏幕大小的时候，动画直接执行到之前执行的时间点
}
//导航3D翻转效果对象
var menu={}
menu.changeMenu=function(className){
	let oldMenu=$(".menu");
	let newMenu=oldMenu.clone();
	newMenu.removeClass("menu_state1").removeClass('menu_state2').removeClass("menu_state3")
	newMenu.addClass(className)
	$(".menu_wrapper").append(newMenu);
	//将导航条的事件，重新加到新导航上
	main.button3D(".start",".state1",".state2",0.2);
	main.navMouse();
	//给旧导航添加class,方便删除
	oldMenu.addClass("removeClass")
	
	//设置导航翻转动画
	if($(window).width()>960){
		let animation=new TimelineMax();
		animation.to(oldMenu,0,{top:22,rotationX:0,transformPerspective:600,transformOrigin:"center bottom"})
		animation.to(newMenu,0,{top:100,rotationX:-90,transformPerspective:600,transformOrigin:"top center"})
		
		animation.to(oldMenu,0.3,{rotationX:90,top:-55,ease:Cubic.easeInOut})
		animation.to(newMenu,0.3,{rotationX:0,top:22,ease:Cubic.easeInOut,onComplete:function(){
			$(".removeClass").remove()
		}},"-=0.3")
	}else{			
		$(newMenu).remove()
	}
}

//设置第二屏动画
var scene2Animation={}
scene2Animation.timeline=new TimelineMax();
scene2Animation.init=function(){
	//执行staggerTo和to的时候，一定要注意延迟时间
	//因为按钮和动画同时执行，所以按钮在设置的时候需要将延迟时间提前
	scene2Animation.timeline.staggerTo(".scene2_1 img",1.5,{opacity:1,rotationX:0,ease:Elastic.easeOut},0.1)
	//配制第二屏里面的小按钮
	scene2Animation.timeline.to(".points",0,{bottom:22},"-=1.5")
	//初始化小按钮
	scene2Animation.timeline.to(".points .point0 .text",0,{opacity:1})
	scene2Animation.timeline.to(".points .point0 .point_icon",0,{"background-position":"right top"})
		scene2Animation.timeline.add("state1")
		
	scene2Animation.timeline.staggerTo(".scene2_1 img",0.2,{opacity:0,rotationX:-90},0)
	scene2Animation.timeline.to(".scene2_2 .left",0.3,{opacity:1,ease:Elastic.easeOut})
	scene2Animation.timeline.staggerTo(".scene2_2 .right img",0.3,{opacity:1,rotationX:0,ease:Elastic.easeOut},0,"-=0.3")
	
	//按钮
	scene2Animation.timeline.to(".points .point .text",0,{opacity:0},"-=0.3")
	scene2Animation.timeline.to(".points .point .point_icon",0,{"background-position":"left top"},"-=0.3")
	scene2Animation.timeline.to(".points .point1 .text",0,{opacity:1},"-=0.3")
	scene2Animation.timeline.to(".points .point1 .point_icon",0,{"background-position":"right top"},"-=0.3")
	
		scene2Animation.timeline.add("state2")
		
	scene2Animation.timeline.to(".scene2_2 .left",0.2,{opacity:0})
	scene2Animation.timeline.staggerTo(".scene2_2 .right img",0.2,{opacity:0,rotationX:-90},"-=0.2")
	scene2Animation.timeline.to(".scene2_3 .left",0.3,{opacity:1})
	scene2Animation.timeline.staggerTo(".scene2_3 .right img",0.3,{opacity:1,rotationX:0,ease:Elastic.easeOut},0,"-=0.3")
	
	//按钮
	scene2Animation.timeline.to(".points .point .text",0,{opacity:0},"-=0.3")
	scene2Animation.timeline.to(".points .point .point_icon",0,{"background-position":"left top"},"-=0.3")
	scene2Animation.timeline.to(".points .point2 .text",0,{opacity:1},"-=0.3")
	scene2Animation.timeline.to(".points .point2 .point_icon",0,{"background-position":"right top"},"-=0.3")
	
		scene2Animation.timeline.add("state3")
		
		
		
	scene2Animation.timeline.to(".scene2_3 .left",0.2,{opacity:0})
	scene2Animation.timeline.staggerTo(".scene2_3 .right img",0.2,{opacity:0,rotationX:-90},"-=0.2")
	scene2Animation.timeline.to(".scene2_4 .left",0.3,{opacity:1})
	scene2Animation.timeline.staggerTo(".scene2_4 .right img",0.3,{opacity:1,rotationX:0,ease:Elastic.easeOut},0,"-=0.3")
	
	//按钮
	scene2Animation.timeline.to(".points .point .text",0,{opacity:0},"-=0.3")
	scene2Animation.timeline.to(".points .point .point_icon",0,{"background-position":"left top"},"-=0.3")
	scene2Animation.timeline.to(".points .point3 .text",0,{opacity:1},"-=0.3")
	scene2Animation.timeline.to(".points .point3 .point_icon",0,{"background-position":"right top"},"-=0.3")
		scene2Animation.timeline.add("state4")
	//因为动画是在主动画里面执行的，所以先把动画停止掉	
	scene2Animation.timeline.stop()
}

//设置第三屏动画
var scene3Animation={}
scene3Animation.timeline=new TimelineMax();
//设置第三屏动画的初始值
scene3Animation.init=function(){
	scene3Animation.timeline.to(".scene3 .step img",0,{opacity:0,rotationX:90,transformPerspective:600,transformOrigin:"center center"})
	scene3Animation.timeline.staggerTo(".scene3 .step3_1 img",0.3,{opacity:1,rotationX:0,ease:Cubic.easeInOut},0.1)
	
		scene3Animation.timeline.add("scene3State1")
		
	scene3Animation.timeline.to(".scene3 .step3_1 img",0.3,{opacity:0,rotationX:90})//此地持续时间不能为0，
	scene3Animation.timeline.to(".scene3 .step3_2 img",0.3,{opacity:1,rotationX:0,ease:Cubic.easeInOut})
	
		scene3Animation.timeline.add("scene3State2")
		
	scene3Animation.timeline.stop()
}
//设置第五屏动画
var scene5Animation={}
scene5Animation.timeline=new TimelineMax()
//设置第五屏动画的初始值
scene5Animation.init=function(){
	//初始化第五屏
	scene5Animation.timeline.to(".scene5 .area_content img, .scene5 .button1, .scene5 .button2",0,{opacity:0,rotationX:-90,transformPerspective:600,transformOrigin:"center center"})
	scene5Animation.timeline.to(".scene5 .scene5_img",0,{top:-220})
	
	scene5Animation.timeline.to(".scene5 .scene5_img",0.5,{top:0,ease:Cubic.easeInOut})
	scene5Animation.timeline.staggerTo(".scene5 .area_content img,.scene5 .button1,.scene5 .button2",1,{opacity:1,rotationX:0,ease:Elastic.easeInOut},0.2,"-=0.3")
	scene5Animation.timeline.to(".scene5 .lines",0.3,{opacity:1})
		scene5Animation.timeline.add("scene5Point")
	scene5Animation.timeline.stop()
}
