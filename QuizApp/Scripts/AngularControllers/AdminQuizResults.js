module.controller("QuizResults", function ($scope, $http) {
        UpdateResults();
        function UpdateResults() {
            $http.get("/Admin/GetAllTestingResults").then(function (data) {
                $scope.Results = data.data;
                console.log(data.data);
            });
        }

        $scope.DelResult = function (resGuid,index) {
            $http.post("/Apilike/RemoveTestingResult" + "?testingResultGuid=" + resGuid).then(function(){
                $scope.Results.splice(index, 1);
            });
        };
    
    });