angular.module("Admin", ['ngSanitize'])
	.controller('AppCtrl', function ($scope, $http) {
		getApp();

		function getApp() {
			$http.get('http://bellhapp.com:1454/application').then(function (res) {
				$scope.apps = res.data;
				setTimeout(function () {
					getApp();
				}, 1000);
			});
		}

		$scope.command = function (cmd, env) {
			$http.post('http://bellhapp.com:1454/command', { cmd: cmd, env: env }).then(function (res) {
				console.log(res);
			});
		}
	});