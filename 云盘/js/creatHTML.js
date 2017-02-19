//传入一个id,找到这个id下面一级的所有子数据，并生成下一级结构，
//再次调用的时候，传入子数据的id,生成再一级的子数据和结构。
function creatTree(id){
	var datas=data.files;
	var arr=oparate.findChild(datas,id);
	var parents=oparate.findparent(datas,id);
	var str="";
	arr.forEach(function(item){
		str+="<li><h2 data-id="+item.id+" style='padding-left:"+parents.length*18+"px'>";		
		if(oparate.findChild(datas,item.id).length>0){
			str+="<span class='dirIco close1'></span>";
		}else{
			str+="<span class='dirIco'></span>";
		}
		
		str+="<span class='fileIco'></span>";
		str+="<span>"+item.title+"</span>";
		str+="</h2>"	;
		if(oparate.findChild(datas,item.id).length!=0){			
			str+="<ul>";
			str+=creatTree(item.id);//根据当前id,生成当前的子集 
			str+="</ul>";
		}		
		str+="</li>";
	})
	return str;
}
//传入一个id,找到这个id所有的直属父级数据，传入一个数组
//根据数组内容生成页面内容
function creatNav(id){
	var datas=data.files;	
	var arr=oparate.findparent(datas,id).reverse();
	var str="";
	arr.forEach(function(item){
		str+="<li data-id="+item.id+">";
		str+="<a href='javascript:;'>"+item.title+"</a>";
		str+="<span></span>";
		str+="</li>";
	})
	return str;
}
//传入一个id,获取这个id下面的所有的子数据

function creatCon(id){
	var mainArea=document.querySelector(".mainArea");
	var datas=data.files;
	var arr=oparate.findChild(datas,id);
	//判断文件夹区域背景
	if(arr.length==0){
		mainArea.style.background="#f5f8fa url(img/no_file.png) no-repeat 345px 120px";
	}else{
		mainArea.style.background="#f5f8fa";
	}
	var str="";
	arr.forEach(function(item){
		str+="<li data-id="+item.id+" class='mainItem'>";
		str+=mainHtml(item);
		str+="</li>";
	})
	return str;
}
//页面mainArea的html
function mainHtml(item){
	var str="";	
	str+="<img src='img/big_file.png' />";
	str+="<span>"+item.title+"</span>";
	str+="<input type='text'/>";
	str+="<div class='checkbox'></div>";	
	return str;
}
function creatNewFile(){
	var newfile=document.createElement("li");
	newfile.className="mainItem";
	newfile.innerHTML=mainHtml({});
	return newfile;
}
