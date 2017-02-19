(function(){
	var methods={
		//给元素添加事件
		on(element,evName,evFn){
			element.addEventListener(evName,evFn,false)
		},
		//移出某个元素的某个事件
		off(element,evName,evFn){
			element.removeEventListener(evName,evFn,false)
		},
		//获取可视区宽高
		view(){
			return {
				w:document.documentElement.clientWidth,
				h:document.documentElement.clientHeight
			}			
		},
		//给指定元素添加class.
		addClass(element,className){
			if(!methods.hasClass(element,className)){
					element.className+=" "+className;
			}			
		},
		removeClass(element,className){
			if(methods.hasClass(element,className)){
				var arr=element.className.split(" ");
				for (var i = 0; i < arr.length; i++) {
					if(arr[i]==className){
						arr.splice(i,1);
						i--;//每执行一次，让i－1，达到删干净的效果
					}
				}
				element.className=arr.join(" ");
			}
		},
		//如果元素有指定class删除class,如果；没有添加class.
		toggleClass(element,className){
			if(methods.hasClass(element,className)){
				methods.removeClass(element,className);
				return false;
			}else{
				methods.addClass(element,className);
				return true;
			}
		},
		
		//判断当前函数有没有指定的class
		hasClass(element,attr){
				var arr = element.className.split(" ");
				for(var i=0;i<arr.length;i++){
					if(arr[i]==attr){
						return true;
					}
				}		
			return false
		},
		crash(obj1,obj2){
			var pos1=obj1.getBoundingClientRect();
			var pos2=obj2.getBoundingClientRect();
			if(pos1.right>pos2.left&&pos1.left<pos2.right&&pos1.bottom>pos2.top&&pos1.top<pos2.bottom){
				return true
			}else{
				return false
			}			
		},
		//找到当前元素最近的具有指定的属性的父级（class,id,tagName）
		parent(element,attr){
			var firstChar=attr.charAt(0);
			if(firstChar=="."){	
				console.log(element)
				while(element.nodeType!==9 && !methods.hasClass(element,attr.slice(1))){
					element=element.parentNode;
				} 
			}else if(firstChar=="#"){
				while(element.nodeType!==9 && element.id!=attr.slice(1)){
					element=element.parentNode;
				}
			}else{
				while(element.nodeType!==9 && element.nodeName!=attr.toUpperCase()){
					element=element.parentNode;
				}
			}
			return element.nodeType===9?null:element;
		}		
	}
	window.t=methods;
})()
