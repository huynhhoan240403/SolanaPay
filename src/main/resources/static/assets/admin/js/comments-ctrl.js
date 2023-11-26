
// app.controller.js
app.controller("comments-ctrl", function($scope, $http) {
	$scope.comments = [];
	$scope.commentForm = {};
	$scope.products = [];
	$scope.accounts = [];
	$scope.wallet = null;
	$scope.showWallet = false;


	$scope.showReplies = function(comment) {
		if (comment.showReplies) {
			comment.showReplies = false;
		} else {
			$http.get(`/rest/comments/details/${comment.id}`)
				.then(function(resp) {
					comment.replies = resp.data;
					comment.showReplies = true;
				})
				.catch(function(error) {
					console.error("Lỗi: ", error);
				});
		}
	};
	$scope.deleteReply = function(reply) {
		if (reply && reply.id !== undefined && reply.id !== null) {
			if (confirm("Bạn có chắc muốn xóa trả lời này?")) {
				$http.delete("/rest/replies/" + reply.id)
					.then(function(resp) {
						var commentIndex = $scope.comments.findIndex(c => c.id === reply.comment.id);
						var replyIndex = $scope.comments[commentIndex].replies.findIndex(r => r.id === reply.id);

						$scope.comments[commentIndex].replies.splice(replyIndex, 1);
						alert("Xóa trả lời thành công!");
					})
					.catch(function(error) {
						alert("Lỗi xóa trả lời!");
						console.log("Error", error);
					});
			}
		} else {
			// Xử lý trường hợp giá trị là 'undefined' hoặc 'null'
			console.error("Dữ liệu trả lời không hợp lệ.");
		}
	}

	$scope.getWallet = function(comment) {
		$http.get("/rest/accounts/" + comment.account.username).then(resp => {
			comment.wallet = resp.data.wallet_key;
			console.log(comment.wallet);
			comment.showWallet = true;
		});
	};

	$scope.toggleWallet = function(comment) {
		if (!comment.showWallet) {
			$scope.getWallet(comment);
		} else {
			comment.showWallet = !comment.showWallet;
		}
	};

	$scope.initialize = function() {
		// Fetch comments, products, and accounts
		$http.get("/rest/comments").then(resp => {
			$scope.comments = resp.data;

		});
		$http.get("/rest/products").then(resp => {
			$scope.products = resp.data;
		});
		$http.get("/rest/accounts").then(resp => {
			$scope.accounts = resp.data;
		});
		$scope.resetForm();
	}
	$scope.deleteComment = function(comment) {
		if (confirm("Bạn có chắc muốn xóa bình luận này?")) {
			// Check if there are associated replies
			if (comment.replies && comment.replies.length > 0) {
				if (confirm("Bình luận này có các trả lời liên quan. Bạn có muốn xóa tất cả trả lời trước khi xóa bình luận không?")) {
					// Delete associated replies first
					comment.replies.forEach(reply => {
						$http.delete("/rest/replies/" + reply.id)
							.then(resp => {
								// Handle success if needed
							})
							.catch(error => {
								// Handle error if needed
								console.log("Error deleting reply", error);
							});
					});
				} else {
					// User chose not to delete comment with associated replies
					return;
				}
			}

			// Now delete the comment
			$http.delete("/rest/comments/" + comment.id)
				.then(resp => {
					var index = $scope.pager.items.findIndex(c => c.id === comment.id);
					$scope.pager.items.splice(index, 1);
					$scope.resetForm();
					alert("Xóa bình luận thành công!");

				})
				.catch(error => {
					alert("Lỗi xóa bình luận!");
					console.log("Error deleting comment", error);
				});
		}
	}



	$scope.createComment = function() {
		var newComment = angular.copy($scope.commentForm);



		$http.post("/rest/comments", newComment).then(resp => {
			$scope.comments.push(resp.data);
			$scope.resetForm();
			alert("Thêm mới bình luận thành công!");
		}).catch(error => {
			alert("Lỗi thêm mới bình luận!");
			console.log("Error", error);
		});
	}

	$scope.editComment = function(comment) {
		$scope.commentForm = angular.copy(comment);
		$scope.commentForm.create_Date = new Date(comment.create_Date);
		$scope.commentForm.account = {
			username: comment.account.username
		};
		$(".nav-tabs a:eq(0)").tab("show");
	};

	$scope.updateComment = function() {
		var updatedComment = angular.copy($scope.commentForm);

		// Kiểm tra logic điều kiện (nếu cần)
		// ...

		$http.put("/rest/comments/" + updatedComment.id, updatedComment).then(resp => {
			var index = $scope.comments.findIndex(c => c.id === updatedComment.id);
			$scope.comments[index] = updatedComment;
			alert("Cập nhật bình luận thành công!");
		}).catch(error => {
			alert("Lỗi cập nhật bình luận!");
			console.log("Error", error);
		});
	}


	$scope.resetForm = function() {
		$scope.commentForm = {};
	}


	$scope.pager = {
		page: 0,
		size: 4,
		get items() {
			if (this.page < 0) {
				this.last();
			}
			if (this.page >= this.count) {
				this.first();
			}
			var start = this.page * this.size;
			return $scope.comments.slice(start, start + this.size);
		},
		get count() {
			return Math.ceil(1.0 * $scope.comments.length / this.size);
		},
		first() {
			this.page = 0;
		},
		last() {
			this.page = this.count - 1;
		},
		next() {
			this.page++;
		},
		prev() {
			this.page--;
		}
	};

	$scope.initialize();
});