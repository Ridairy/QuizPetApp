module.controller("QuizUrl", function ($scope, $http,$timeout) {
        UpdateTests();
        UpdateData();
        function UpdateData() {
            $http.get("/Admin/GetAllTestingUrls").then(function (data) {
                    $scope.QuizUrls = data.data;
                    console.log($scope.QuizUrls);
            }); 
        }
        function UpdateTests() {
                $http.get("/Admin/GetAllTests").then(function (data) {
                    $scope.Quizes = data.data;
                    console.log($scope.Quizes);
                });
        }


        $scope.AddNewUrl = function (test,urlInfo) {

            if (test === undefined) {
                $scope.NewTestUrl = {
                    'Error': "Please enter correct test."
                };
                return;
            }
            if (urlInfo === undefined) urlInfo = '';
            var newInfo = CheckNewUrls(urlInfo);
            var SendData = {
                'TestGuid': test.Guid,
                'TestName': test.Name,
                'Interviewee': newInfo.Interviewee,
                'NumberOfRuns': newInfo.NumberOfRuns,
                'AllowedStartDate': newInfo.AllowedStartDate,
                'AllowedEndDate': newInfo.AllowedEndDate
            };

            $http.post("/Apilike/CreateTestingUrl", SendData).then(UpdateData());

            console.log(SendData);
        };
        $scope.DeleteUrl = function (Guid) {
            $http.post("/Apilike/RemoveTestingUrl" + "?testingUrlGuid=" + Guid).then(UpdateData());
        };

        function CheckNewUrls(urlsInfo) {
            var NewInfo = {
                'Interviewee': '',
                'NumberOfRuns': '',
                'AllowedStartDate': new Date("1900, 01, 01"),
                'AllowedEndDate': new Date("1900, 01, 01")
            };
            if (urlsInfo.Interviewee !== undefined) 
                NewInfo.Interviewee = urlsInfo.Interviewee;
            if (urlsInfo.NumberOfRuns !== undefined)
                NewInfo.NumberOfRuns = urlsInfo.NumberOfRuns;
            if (urlsInfo.AllowedStartDate !== undefined)
                NewInfo.AllowedStartDate = urlsInfo.AllowedStartDate;
            if (urlsInfo.AllowedEndtDate !== undefined)
                NewInfo.AllowedEndtDate = urlsInfo.AllowedEndtDate;
            console.log(NewInfo);
            return NewInfo;
        }
        
        
    });