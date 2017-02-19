var oparate = {	
	findSelf(data,id){
		return data.find(function(item){
			return item.id==id;
		})
	},
	findChild(data,id){
		return data.filter(function (value){
			return value.pid == id;
		})	
	},
	findparent(data,id){
		var arr=[];
		var self=oparate.findSelf(data,id);
		if(self){
			arr.push(self);
			arr=arr.concat(oparate.findparent(data,self.pid));
		}		
		return arr;
	},
	//传入一个id找到所有子数据和他自己
	findSelfChild(data,id){
		var arr=[];
		var self=oparate.findSelf(data,id);
		arr.push(self);		
		oparate.findChild(data,self.id).forEach(function(item){
			arr=arr.concat(oparate.findSelfChild(data,item.id))
		})
		return arr
	},
	//传入一个数组，找到数组中对应项的子数据和他自己
	findSelfChildInArr(data,idArr){
		var arr=[];
		for(var i=0;i<idArr.length;i++){
			arr=arr.concat(oparate.findSelfChild(data,idArr[i]))
		}
		return arr
	},
	//指定多个id,删除对应id的所有子孙数据
	deleteChildAll(data,idArr){
		var childs=oparate.findSelfChildInArr(data,idArr);
		for (var i = 0; i < data.length; i++) {
			for (var j = 0; j< childs.length; j++) {
				if(data[i]==childs[j]){
					data.splice(i,1);
					i--;
					break;
				}
			}
			
		}
	},	
	//传入一个id,判断这个id下面的子数据存不存一个title叫做value的。
	//存在返回true,不存在返回false.
	isTitleExist(data,value,id){
		var childs=oparate.findChild(data,id);
		return childs.findIndex(function(item){
			return item.title===value
		})!==-1
	}
	
}
