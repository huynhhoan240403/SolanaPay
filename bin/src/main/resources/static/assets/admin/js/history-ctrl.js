app.controller("history-ctrl", function($scope, $http){
	$scope.items = [];
	$scope.form = {};
	$scope.showDetail = false;
	$scope.getDetailData = function(item){
		if( item.showDetail){
            item.showDetail = false;		
		}
		else{
		$http.get(`/rest/historys/details/${item.id}`)
		.then(function(resp){
			item.detailData = resp.data;
			item.showDetail = true;
		}).catch(function(error){
			console.error("error: ",error)
		})
	}
	}
	$scope.initialize = function(){
		$http.get("/rest/historys").then(resp => {
			$scope.items = resp.data;
			$scope.form = {
				available : true,
			};
		})

		$scope.reset(); //để có hình mây lyc1 mới đầu
	}
	$scope.edit = function(item){
		$scope.form = angular.copy(item);
		$(".nav-tabs a:eq(0)").tab("show");
	}
	
	$scope.reset = function(){
		$scope.form = {
			available: true,
		}
	}

	$scope.update = function(){
		var item = angular.copy($scope.form);
		$http.put(`/rest/historys/${item.id}`, item).then(resp => {
			var index = $scope.items.findIndex(p => p.id == item.id);
			$scope.items[index] = item;
			alert("Cập nhật lịch sử đơn hàng thành công!");
		})
		.catch(error => {
			alert("Lỗi cập nhật lịch sử đơn hàng!");
			console.log("Error", error);
		});
	}

	$scope.delete = function(item){
		if(confirm("Bạn muốn xóa lịch sử đơn hàng này?")){
			$http.delete(`/rest/historys/${item.id}`).then(resp => {
				var index = $scope.items.findIndex(p => p.id == item.id);
				$scope.items.splice(index, 1);
				$scope.reset();
				alert("Xóa lịch sử đơn hàng thành công!");
			}).catch(error => {
				alert("Lỗi xóa lịch sử đơn hàng!");
				console.log("Error", error);
			})
		}
	}
	$scope.pager = {
		page: 0,
		size: 10,
		get items(){
			if(this.page < 0){
				this.last();
			}
			if(this.page >= this.count){
				this.first();
			}
			var start = this.page*this.size;
			return $scope.items.slice(start, start + this.size)
		},
		get count(){
			return Math.ceil(1.0 * $scope.items.length / this.size);
		},
		first(){
			this.page = 0;
		},
		last(){
			this.page = this.count - 1;
		},
		next(){
			this.page++;
		},
		prev(){
			this.page--;
		}
	}
    
	$scope.initialize();
});