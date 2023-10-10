app.controller("revenue-ctrl", function($scope, $http, $location) {
	
	$scope.selectedYear = null;
	$scope.initialize = function() {	
		$http.get("/rest/revenue").then(resp => {
			$scope.years = resp.data;
			$scope.selectedYear = 2023; // Đặt năm 2023 làm năm mặc định
			$scope.getRevenueByYear(); // Gọi hàm để tải dữ liệu doanh thu ngay khi trang tải lên
		}).catch(error => {
	    	$location.path("/unauthorized");
	    })
	}
	$scope.getRevenueByYear = function() {
		// Perform an API call to get revenue data for the selected year
		// Replace 'YOUR_API_URL' with the actual API endpoint
		$http.get("/rest/revenue/" + $scope.selectedYear)
			.then(function(response) {
				$scope.revenueItems = response.data;
			})
			.catch(function(error) {
				console.log('Error fetching revenue data:', error);
			});
	};
		var chart = new CanvasJS.Chart("chartContainer", {
			animationEnabled: true,
			exportEnabled: true,
			theme: "light1", // "light1", "light2", "dark1", "dark2"
			title:{
				text: "Proceed in year"
			},
			  axisY: {
			  includeZero: true
			},
			data: [{
				type: "column", //change type to bar, line, area, pie, etc
				//indexLabel: "{y}", //Shows y value on all Data Points
				indexLabelFontColor: "#5A5757",
				  indexLabelFontSize: 16,
				indexLabelPlacement: "outside",
				dataPoints: [
					{ x: 20, y: 55 },
					{ x: 50, y: 92, indexLabel: "\u2605 Highest" },
					{ x: 60, y: 68 },
					{ x: 70, y: 38 },
					{ x: 130, y: 21, indexLabel: "\u2691 Lowest" }
				]
			}]
		});
		chart.render();
		$scope.initialize();
});

