const app = angular.module("app", []);
app.controller("cart-ctrl", function($scope, $http){
	
	 // quản lý giỏ hàng
	var $cart = $scope.cart = {
        items: [],
        add(id){ // thêm sản phẩm vào giỏ hàng
           var item = this.items.find(item => item.id == id);
            if(item){
                item.qty++;
                this.saveToLocalStorage();
            }
            else{
            	$http.get(`/rest/products/${id}`).then(resp => {
            		resp.data.qty = 1;
            		this.items.push(resp.data);
            		this.saveToLocalStorage();
            	})
            }
        },
        remove(id){ // xóa sản phẩm khỏi giỏ hàng
        	var index = this.items.findIndex(item => item.id == id);
            this.items.splice(index, 1);
            this.saveToLocalStorage();
        },
        clear(){ // Xóa sạch các mặt hàng trong giỏ
            this.items = []
            this.saveToLocalStorage();
        },
        amt_of(item){ // tính thành tiền của 1 sản phẩm
        	return item.price * item.qty;
        },
        get count(){ // tính tổng số lượng các mặt hàng trong giỏ //get: phép bạn truy cập vào một thuộc tính của đối tượng như một thuộc tính thông thường
           return this.items
            	.map(item => item.qty)
                .reduce((total, qty) => total += qty, 0);   //reduce(tích lũy, giá trị trong mãng => new Temp)
        },
        get amount(){ // tổng thành tiền các mặt hàng trong giỏ
            return this.items
            	.map(item => this.amt_of(item))
                .reduce((total, amt) => total += amt, 0);
        },
        saveToLocalStorage(){ // lưu giỏ hàng vào local storage
        	var json = JSON.stringify(angular.copy(this.items));
            localStorage.setItem("cart", json);
        },
        loadFromLocalStorage(){ // đọc giỏ hàng từ local storage
           var json = localStorage.getItem("cart");
           this.items = json ? JSON.parse(json) : []; //chuyen sang mãng
        }
    }
	$cart.loadFromLocalStorage();
	
	$scope.order = {
		createDate: new Date(),
		address: "",
		account: {username: $("#username").text()}, //giá trị của username được truyền vào thông qua một hàm truy vấn jQuery ($("#username").text) được gọi với phần tử có id là "username".
		get orderDetails(){
			return $cart.items.map(item => { //chuyển mảng thành map, các mặt hàng trong giỏ chuyển thành orderDetail
				return {
					product:{id: item.id},
					price: item.price,
					quantity: item.qty
				}
			});
		},
		purchase(){
			var order = angular.copy(this);
				// Thực hiện đặt hàng
				$http.post("/rest/orders", order).then(resp => {
					alert("Đặt hàng thành công!");
					$cart.clear();
					location.href = "/order/detail/" + resp.data.id;
				}).catch(error => {
					alert("Đặt hàng lỗi!")
					console.log(error)
				})
		}
	}
})