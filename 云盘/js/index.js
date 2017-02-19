//渲染｜｜交互文件
(function(){
	var main=document.querySelector(".left");
	var top=document.querySelector(".top");
	var nav=document.querySelector(".nav");
	var mainL=document.querySelector(".main .left");
	//左侧高度自适应
//	mainLH();
//	function mainLH(){		
//		mainL.style.height=t.view().h-top.offsetHeight-nav.offsetHeight+"px";		
//	}
//---------------渲染各个区域-----------------
	//左侧树形菜单
	var tree=document.querySelector(".tree");
	tree.innerHTML=creatTree(-1);	
	
	
	//导航菜单
	var navUl=document.querySelector(".header ul");
	navUl.innerHTML=creatNav(0);
	
	//文件区域
	var mainArea=document.querySelector(".mainArea");
	var mainUl=mainArea.getElementsByTagName("ul")[0];
	mainUl.innerHTML=creatCon(0);
	
//------------交互区域------------------------
//渲染公共部分
	function render(fileId){
		t.addClass(getEle(fileId),"active");
		t.removeClass(getEle(currentId),"active");
		navUl.innerHTML=creatNav(fileId);
		mainUl.innerHTML=creatCon(fileId);
		currentId=fileId;
		t.removeClass(checkBtn,"checked");
	}
	
	var fullTipBox=document.querySelector(".full-tip-box");
	var TipText=fullTipBox.getElementsByTagName("span")[0];
	fullTipBox.style.marginLeft=-(fullTipBox.offsetWidth/2)+'px';
	//提示框有三种状态，隐藏／展示／回去／
	function fullTip(className,message){		
		TipText.innerHTML=message;
		fullTipBox.style.transition="none";
		fullTipBox.className="full-tip-box";
		fullTipBox.style.top="-40px";
		
		setTimeout(function(){
			t.addClass(fullTipBox,className);
			fullTipBox.style.transition=".3s";
			fullTipBox.style.top="10px";
		},0)
		//定时器执行之前先清除。
		clearTimeout(fullTipBox.timer)
		fullTipBox.timer = setTimeout(function(){
			fullTipBox.style.top="-40px";
		},2000)
	}
//弹出框的弹出
	var mask=document.querySelector(".mask");	
	function tanbox(className,message1,message2){		
		var maskContant=document.querySelector(".mask-contant");
		var warnText=document.querySelector(".warnText");
		var firstLine=warnText.getElementsByTagName("div")[0];
		var secondLine=warnText.getElementsByTagName("div")[1];
		mask.style.display="block";
		maskContant.className="mask-contant";
//		mask.style.width=t.view().w+"px";
//		mask.style.height=t.view().h+"px";
		t.addClass(maskContant,className);
		firstLine.innerHTML=message1;
		secondLine.innerHTML=message2;			
	}
//	t.on(window,"resize",function(){
//		mask.style.width=t.view().w+"px";
//		mask.style.height=t.view().h+"px";
//	})
//树形菜单区域
	var currentId=0;
	//获取dataId为id的h2
	function getEle(id1){
		var h2s=tree.getElementsByTagName("h2");
		for (var i = 0; i < h2s.length; i++) {
			if(h2s[i].dataset.id==id1){
				return h2s[i];
			}
		}
	}
	
	t.addClass(getEle(0),"active");
	t.on(tree,"click",function(ev){
		var target=ev.target;		
		if(t.parent(target,"h2")){//如果触发源能找到父级为h2的元素，则h2赋给源
			target=t.parent(target,"h2");
			var fileId=target.dataset.id;
			render(fileId)
		}	
	})
	//导航区域
	t.on(navUl,"click",function(ev){
		var target=ev.target;
		if(target=t.parent(target,"li")){
			var fileId=target.dataset.id;			
			render(fileId)
		}
	})
	//文件区域
	var check1=mainArea.getElementsByTagName("div");
	//单击checkbox选中
	t.on(mainArea,"click",function(ev){
		var target=ev.target;
		if(t.parent(target,".checkbox")){
			target=t.parent(target,".checkbox");
			t.toggleClass(target,"active"); 
			var bl=Array.from(checkbox1).every(function(item){
				return t.hasClass(item,"active");
			})
			if(bl){
				t.addClass(checkBtn,"checked");
			}else{
				t.removeClass(checkBtn,"checked");
			}
		}
	})
	//点击命名的input的时候，阻止冒泡
	t.on(mainArea,"mousedown",function(ev){
		var target=ev.target;
		if(t.parent(target,"input")){
			ev.stopPropagation();
		}
	})
	//--------------------------重命名----------------------------
	t.on(mainArea,"click",function(ev){
		var target=ev.target;
		
		if(t.parent(target,"span")){
			target=t.parent(target,"span");
			if(resetBox){//将之前的命名框消失
				resetBox.style.display="none";
				resetBox.previousElementSibling.innerHTML=resetBox.value;
				resetBox.previousElementSibling.style.display="block";
			}			
			resetNameFn(target);			
			ev.stopPropagation();
		}
		
	})
	function resetNameFn(target){		
		target.style.display="none";
		resetBox=target.nextElementSibling;
		resetBox.value=resetBox.previousElementSibling.innerHTML;
		target.nextElementSibling.style.display="block";
		target.nextElementSibling.focus();
		mainArea.resetName=true;	
		
	}
	//文件单击进入下一级
	var checkbox1=document.getElementsByClassName("checkbox");	
	t.on(mainArea,"click",function(ev){
		ev.stopPropagation();
		var target=ev.target
		if(t.parent(target,".checkbox")||t.parent(target,"input")){			
			return;
		}else 
		if(t.parent(target,".mainItem")){//找到每个文件li.
			target=t.parent(target,".mainItem");
//			if(target.querySelector(".active")){//如果是选中状态，不能进入下一级
//				return
//			}
			var fileId=target.dataset.id;
			render(fileId);
		}
		
	})
		
	//--------------文件区onmouseover-------------
	t.on(mainArea,"mouseover",function(ev){
		var target=ev.target;
		if(target=t.parent(target,"li")){			
			t.addClass(target,"hover");
		}
	})
	t.on(mainArea,"mouseout",function(ev){
		var target=ev.target;
		if(target=t.parent(target,"li")){
			var divs=target.getElementsByClassName("checkbox")[0];
			if(!t.hasClass(divs,"active")){
				t.removeClass(target,"hover");
			}			
		}
	})

	//---------------单击全选按钮----------------------------
	var datas=data.files;
	var checkBtn=document.getElementsByClassName("checkBtn")[0];
	var mainItem=document.getElementsByClassName("mainItem");
		
	t.on(checkBtn,"click",function(){
		//当没有子数据的时候，直接返回，不能点击
		if(oparate.findChild(datas,currentId).length==0){
			return;
		}
		var bl=t.toggleClass(this,"checked");
		Array.from(checkbox1).forEach(function(item,index){
			if(bl){
				t.addClass(mainItem[index],"hover");
				t.addClass(item,"active");
			}else{
				t.removeClass(mainItem[index],"hover");
				t.removeClass(item,"active");
			}			
		})

	})
	//-----------------------新建文件夹--------------------------
	var maxId=0;
	var navLeft=document.querySelector(".nav .left");
	var creatNew=navLeft.getElementsByTagName("li")[5];
	var mainUl=mainArea.getElementsByTagName("ul")[0];
	t.on(creatNew,"mouseup",function(ev){		
		var newFile=creatNewFile();				
		mainUl.insertBefore(newFile,mainUl.children[0]);//只能是一个元素，不能是字符串
		mainArea.style.background="#f5f8fa";
		var ips=newFile.querySelector("input");
		var span=newFile.querySelector("span");
		ips.style.display="block";
		ips.focus();
		span.style.display="none";
		creatNew.isCreat=true;
		
	})
	//判断是否新建成功函数
	function creatFile(){
		if(!creatNew.isCreat) return;
		
		var newFile=mainUl.firstElementChild;				
		var ips=newFile.querySelector("input");
		var span=newFile.querySelector("span");
		var value=ips.value.trim();
		if(value==""){
			mainUl.removeChild(newFile,mainUl.children[0]);
			fullTip("warning","请给文件夹命名")
			
		}else{
			if(oparate.isTitleExist(datas,value,currentId)){//如果存在
				mainUl.removeChild(newFile,mainUl.children[0]);
				fullTip("warning","新建文件夹命名重复，不成功");
			}else{
				span.innerHTML=ips.value;
				span.style.display="block";
				ips.style.display="none"
				for(var i=0;i<datas.length;i++){
					if(maxId<datas[i].id){
						maxId=datas[i].id;
					}
				}
				var id1=maxId+1;
				data.files.unshift({//因为新建的文件夹靠前显示，所以用unshift
					"id":id1,
					"pid":currentId,
					"title":ips.value,
					"type":"file"
				})
				tree.innerHTML=creatTree(-1);
				newFile.setAttribute("data-id",id1);//给新生成的文件夹添加id.
				t.addClass(getEle(currentId),"active");
				fullTip("success","新建文件夹成功");
			}
		}
		creatNew.isCreat=false;
	}	
	//按下enter的时候，进行判断
	t.on(document,"keyup",function(ev){
		if(ev.keyCode==13){
			creatFile()
		}
	})
	//按下document的时候，进行判断
	t.on(document,"mousedown",creatFile)
	
//------------------------------------删除文件夹------------------------
//判断选中了哪些文件
	function whoSelect(){
		return Array.from(checkbox1).filter(function(item){
			return t.hasClass(item,"active")
		}).map(function(item){
			return t.parent(item,".mainItem")
		})
	}	
	
	var isdelete=document.getElementsByClassName("isdelete")[0];
	var sure=document.querySelector(".sure");
	var cancel1=document.querySelector(".cancel");		
	var delBtn=navLeft.getElementsByTagName("li")[4];
	var closeBtn=document.querySelector(".closeBtn");
	//点击删除按钮，判断是否有选中的元素，如果有将自定义属性变成true,同时弹窗出来
	t.on(delBtn,"mouseup",function(ev){
		var arr=[];
		for(var i=0;i<checkbox1.length;i++){
			if(t.hasClass(checkbox1[i],"active")){
				arr.push(checkbox1[i].parentNode.dataset.id)
			}
		}
		if(arr.length==0){
			fullTip("warning","请选择需要删除的文件夹");
			return
		}else{	
			delBtn.isDelete=true;			
			dialog({
				title:"确认要删除选中的文件夹吗？",
				content:"删除的文件可以在回收站找到",
				okFn:function(){
						var timer=null;
						var arr=[];
						for(var i=0;i<checkbox1.length;i++){
							if(t.hasClass(checkbox1[i],"active")){
								arr.push(checkbox1[i].parentNode.dataset.id)
							}
						}
						var len=Number(datas.length)-Number(arr.length);
						oparate.deleteChildAll(datas,arr)
						var num=0;
						var delNum=document.querySelector(".delNum");
						var delTol=document.querySelector(".delTol");
						var deleShow=document.querySelector(".deleShow");
						var deleteIng=document.querySelector(".deleteIng");
						delTol.innerHTML=len;
						deleteIng.style.display="block";
						var onoff=false;
						timer=setInterval(function(){
							num++;
							if(num==len){
								clearInterval(timer);
								deleteIng.style.display="none";
								onoff=true;
							}
							delNum.innerHTML=num;
							deleShow.style.transform="rotate(360deg)";
							if(onoff){
								tree.innerHTML=creatTree(-1);
								mainUl.innerHTML=creatCon(currentId);
								t.addClass(getEle(currentId),"active");
								fullTip("success","删除文件夹成功");
								t.removeClass(checkBtn,"checked");
								delBtn.isDelete=false;
								t.removeClass(fullPop,"isDelete");
							}
							
						},50)
					}
				})
			var fullPop=document.querySelector(".full-pop");
			t.addClass(fullPop,"isDelete");
			var isDelete=document.querySelector(".isDelete");
			isDelete.style.width="318px";
		}		
	})
;
	

//----------------------------------重命名--------------------------------
	var resetName=navLeft.getElementsByTagName("li")[3];
	var re_obj={};//将重命名所需要的变量都存到这个数组中。避免在全局申明变量。
	t.on(resetName,"click",function(){
		var selectArr=whoSelect();
		if(selectArr.length===1){//当前只选择了一个元素
			re_obj.element=selectArr[0];
			re_obj.span=re_obj.element.querySelector("span");
			re_obj.ips=re_obj.element.querySelector("input");
			re_obj.checkbox1=re_obj.element.querySelector(".checkbox");			
			re_obj.ips.style.display="block";
			re_obj.ips.select();
			re_obj.span.style.display="none";
			
			re_obj.ips.value=re_obj.span.innerHTML;
			resetName.res=true;//将重命名添加一个属性开关，点击之后为true;
			
		}else if(selectArr.length>1){
			fullTip("warning","重命名只能选择一个文件");
		}else{
			fullTip("warning","请选择重命名的文件");
		}
	})
	t.on(document,"mousedown",function(){
		if(!resetName.res){
			return;
		}
		var value=re_obj.ips.value;
		if(value){
			var isExist=oparate.isTitleExist(datas,value,currentId)
			//如果内容同之前的内容一致,改变两个元素的display
			if(value===re_obj.span.innerHTML.trim()){
				
			}else if(isExist){//如果名字存在,提示，然后改变两个元素的display
				fullTip("warning","文件夹命名重复");
			}else{//如果名字不存在
				var self=oparate.findSelf(datas,re_obj.element.dataset.id);
				re_obj.span.innerHTML=re_obj.ips.value;
				self.title=value;
				tree.innerHTML=creatTree(-1);
			}
			
		}
		//公共部分写在下面，就是改变两个元素的display.
		re_obj.ips.style.display="none";
		re_obj.span.style.display="block";
		resetName.res=false;
	})
	t.on(document,"keydown",function(ev){
		if(ev.keyCode==13){
			if(!resetName.res){
				return;
			}
			var value=re_obj.ips.value;
			if(value){
				var isExist=oparate.isTitleExist(datas,value,currentId)
				//如果内容同之前的内容一致,改变两个元素的display
				if(value===re_obj.span.innerHTML.trim()){
					
				}else if(isExist){//如果名字存在,提示，然后改变两个元素的display
					fullTip("warning","文件夹命名重复");
				}else{//如果名字不存在
					var self=oparate.findSelf(datas,re_obj.element.dataset.id);
					re_obj.span.innerHTML=re_obj.ips.value;
					self.title=value;
					tree.innerHTML=creatTree(-1);
				}
				
			}
			//公共部分写在下面，就是改变两个元素的display.
			re_obj.ips.style.display="none";
			re_obj.span.style.display="block";
			resetName.res=false;
		}		
	});
//---------------------------移动到-----------------------------------

(function(){
	var moveBtn=navLeft.getElementsByTagName("li")[2];
	t.on(moveBtn,"click",function(){
		var selectArr=whoSelect();
		var selectIdArr=[];
		var fileId=null;
		var onoff=false;
		var moveStatus=false;
		//如果没有选择文件，return
		if(selectArr.length==0){
			fullTip("warning","请选择移动的文件");
			return;
		}
		//调用弹框
		dialog({
				title:"移动到",
				content:"<div class='treeMove'><ul class='tree'>"+creatTree(-1)+"</ul></div>",
				okFn:function(){
					//如果moveStatus为true,okFn返回true,
					if(moveStatus){
						return true;
					}else{
						//return false,说明弹窗是可以关闭的
						//将需要移动文件的pid改成所点击的h2的id;
						//判断所需移动的文件的名字是否在移动的文件夹下重名
						var onoff=false;
						//遍历选中的文件夹的id,判断所对应的title在要移动的下一级存不存在
						for (var i = 0; i < selectIdArr.length; i++) {
							var self=oparate.findSelf(datas,selectIdArr[i]);
							var isExist=oparate.isTitleExist(datas,self.title,fileId)
							if(!isExist){
								self.pid=fileId;
								mainUl.removeChild(selectArr[i]);
							}else{								
								onoff=true;
							}
						}
						if(onoff){
							fullTip("warning","部分文件夹移动不成功");
						}					
						tree.innerHTML=creatTree(-1);
						t.addClass(getEle(currentId),"active");
					}
				}
		})
		var fullPop=document.querySelector(".full-pop");
		t.addClass(fullPop,"moveTo");
		var moveTo=document.querySelector(".moveTo");
		moveTo.style.width="406px";
		moveTo.style.background="#fff";
		moveTo.style.paddingLeft="0";
		//按下移动到的时候，页面中所有选中的元素
		
		var treeMove=document.querySelector(".treeMove");
		var h2s=document.querySelector(".treeMove h2");
		var weiyun=document.querySelector('.treeMove h2');
		t.addClass(weiyun,"active");
		var currentEle=weiyun;
		t.on(treeMove,"click",function(ev){
			var target=ev.target;
			if(t.parent(target,"h2")){
				target=t.parent(target,"h2");
				//给点击的h2添加class.
				t.removeClass(currentEle,"active");
				t.addClass(target,"active");
				currentEle=target;
				fileId=target.dataset.id;
				//如果需要移动的数据，本身的pid是点击当前的ID，提示已在文件夹中存在
				
				var error1=document.querySelector(".error");
				for (var i = 0; i <selectArr.length; i++) {
					selectIdArr.push(selectArr[i].dataset.id)
				}
			
				var self=oparate.findSelf(datas,selectIdArr[0]);
				
				if(self.pid==target.dataset.id){		
					error1.innerHTML="文件夹已经存在，不能移动";
					moveStatus=true;
					return//不能移动之后返回，否则会收到下面代码影响。
				}
				
				//不能移动到他自身和他的子数据下面
				var selectData=oparate.findSelfChildInArr(datas,selectIdArr)
				var onoff=false;
				for (var i = 0; i < selectData.length; i++) {
					if(selectData[i].id==target.dataset.id){
						onoff=true;
					}
				}
				if(onoff){
					error1.innerHTML="不能移动到文件夹自身和他的子集下面";
					moveStatus=true;
				}else{
					error1.innerHTML="";
					moveStatus=false;
				}
			}
		})
	})
	
})()
//--------------------------框选，碰撞检测-------------------------------------------------------		
;(function(){	
	/*
	 在页面当中框选，
	 
	 空白区域：直接执行框选
	 文件夹上：1 如果是未被选中状态，执行框选
	          2 被选中状态，执行移动到
	  
	  */
		var disX=0;
		var disY=0;			
		var isChecked=null;
		var box=null;	
		var littleMask=null;
		var shadow=null;
		var moveToEle=null;
		var selectArr=null;

		t.on(mainArea,"mousedown",fnDown);		
		function fnDown(ev){
			ev.preventDefault();
			if(ev.which!==1){
				return;
			}
			var target=ev.target;
			var pos=mainArea.getBoundingClientRect();
			dX=ev.clientX;
			dY=ev.clientY;
			disX=ev.clientX-pos.left;
			disY=ev.clientY-pos.top;
			var isChecked=false;
			//判断按下的元素是否是被选中状态。
			if(t.parent(ev.target,".mainItem")){
				isChecked = !!t.parent(ev.target,".mainItem").querySelector(".active");
			}	
			document.onmousemove=function(ev){		
				if(isChecked){//文件夹是选中状态
					//判断移动范围小于5的时候，不执行代码
					if(Math.abs(ev.clientX-dX)<5&&Math.abs(ev.clientY-dY)<5){
						return
					}
					var selectArr=whoSelect();
					//生成剪影
					if(!shadow){
						shadow=document.createElement("div");
						shadow.className="shadow";
						shadow.innerHTML=`<img src="img/big_file.png" />
										<div>${selectArr.length}</div>`;
						document.body.appendChild(shadow);
					}					
					shadow.style.left=ev.clientX+15+"px";
					shadow.style.top=ev.clientY+15+"px";
					//生成小遮罩，避免鼠标在文件上抬起的时候，触发进入下一级的代码
					if(!littleMask){
						littleMask=document.createElement("div");
						littleMask.style.cssText="width: 10px;height: 10px;background-color: red;position: fixed;";						
						document.body.appendChild(littleMask)
					}
					littleMask.style.left=ev.clientX-5+"px";
					littleMask.style.top=ev.clientY-5+"px";
					moveToEle=null;
					//小遮罩和剪影可以一起随着鼠标移动					
					//用小遮罩和文件进行碰撞检测，需要过滤掉已经选择的文件，全局命名一个变量，碰撞到哪个文件夹，就把哪个文件夹存到这个变量中
					a:for (var i = 0; i < mainItem.length; i++) {
						//排除掉已经选中的文件夹
						for(var j=0;j<selectArr.length;j++){
							if(mainItem[i]===selectArr[j]){
								continue a
							}
						}
						if(t.crash(littleMask,mainItem[i])){
							t.addClass(mainItem[i],"hover")
							moveToEle=mainItem[i];
							
						}else{
							t.removeClass(mainItem[i],"hover")
						}
					}				
					return;					
				}
				var w=Math.abs(ev.clientX-(pos.left+disX));
				var h=Math.abs(ev.clientY-(pos.top+disY));
				if(w>20||h>20){
					if(!box){
						box=document.createElement("div");
						box.className="box";
						box.style.left=disX+"px";
						box.style.top=disY+"px";
						mainArea.appendChild(box);
					}								
					box.style.width=w+"px";
					box.style.height=h+"px";
					box.style.left=Math.min(disX,ev.clientX-pos.left)+"px";
					box.style.top=Math.min(disY,ev.clientY-pos.top)+"px";
					for (var i = 0; i < mainItem.length; i++) {
						if(t.crash(mainItem[i],box)){
							t.addClass(mainItem[i],"hover")
							t.addClass(checkbox1[i],"active")
						}else{
							t.removeClass(mainItem[i],"hover")
							t.removeClass(checkbox1[i],"active")
						}
						var bl=Array.from(checkbox1).every(function(item){
							return t.hasClass(item,"active")
						})
						bl?t.addClass(checkBtn,"checked"):t.removeClass(checkBtn,"checked")	
					}
				}	
			}
			document.onmouseup=function(ev){
				if(box){
					mainArea.removeChild(box);						
				}		
				box=null;
				if(shadow){
					document.body.removeChild(shadow);
					document.body.removeChild(littleMask);
					shadow=null;
					littleMask=null;
				}
				//如果有存入moveToEle,将选中元素的pid 改成moveToEle的id,并重新渲染树型菜单
				if(moveToEle){
					var onoff=false;
					var selectArr=whoSelect();
					var selectIdArr=selectArr.map(function(item){
						return item.dataset.id;
					})
					fileId=moveToEle.dataset.id;
					//遍历选中的文件夹的id,判断所对应的title在要移动的下一级存不存在
					for (var i = 0; i < selectIdArr.length; i++) {
						var self=oparate.findSelf(datas,selectIdArr[i]);
						var isExist=oparate.isTitleExist(datas,self.title,fileId)
						if(!isExist){
							self.pid=fileId;
							mainUl.removeChild(selectArr[i]);
						}else{								
							onoff=true;
						}
					}
					if(onoff){
						fullTip("warning","部分文件夹移动不成功");
					}					
					tree.innerHTML=creatTree(-1);
					
//					t.addClass(getEle(currentId),"active");
					console.log(moveToEle)
					t.removeClass(moveToEle,"hover")
					moveToEle=null
				}
				document.onmousemove=document.onmouseup=null;
			}
			//鼠标抬起的时候，将选中的文件的pid改成移动到的文件的,重新渲染页面
		}
	})()
})()

