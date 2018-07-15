
module.controller("QuizList", function ($scope, $http, $timeout) {
        $scope.TestEditable = [];
        $scope.QuestionEditable = [];
        $scope.qtime = new Date();
        $scope.ttime = new Date();
        UpdateData();

        $scope.AddTest = function () {
            if ($scope.NewTest === undefined) {
                $scope.NewTest = { 'Error': "Please insert data." };
                console.log($scope.NewTest);
                return;
            }
            if ($scope.NewTest.Name === undefined) {
                $scope.NewTest = { 'Error': "Please insert test name." };
                console.log($scope.NewTest);
                return;
            }
            if ($scope.NewTest.TestTimeLimit === undefined || $scope.NewTest.QuestionTimeLimit === undefined) {
                $scope.NewTest = { 'Error': "Please insert correct time limit." };
                console.log($scope.NewTest);
                return;
            }
            var tt = new Date($scope.NewTest.TestTimeLimit);
            var qt = new Date($scope.NewTest.QuestionTimeLimit);
            var FormatTT = tt.getHours() + ":" + tt.getMinutes() + ":" + tt.getSeconds();
            var FormatQT = qt.getHours() + ":" + qt.getMinutes() + ":" + qt.getSeconds();
            
            $scope.NewTest.TestTimeLimit = FormatTT;
            $scope.NewTest.QuestionTimeLimit = FormatQT;

            console.log($scope.NewTest);
            $http.post("/Apilike/CreateTest", $scope.NewTest).then(function () {
                $scope.Quiz.push($scope.NewTest);
                $scope.NewTest = null;
                
            });
        };

        $scope.AddQuestion = function (testGuid, newQuestion) {
            var SendData = {
                'testGuid': testGuid,
                'Instance': newQuestion.Instance,
                'Hint': newQuestion.Hint
            };
            $http.post("/Apilike/CreateQuestion", SendData).then(function () {
                UpdateData();
            });
        };
        $scope.AddAnswer = function (questionGuid, newAnswer) {
            var SendData = {
                'questionGuid': questionGuid,
                'Instance': newAnswer.Instance,
                'IsCorrect': newAnswer.IsCorrect
            };
            $http.post("/Apilike/CreateAnswer", SendData).then(function () {
                UpdateData();
            });
        };
                

        $scope.DeleteTest = function (testGuid) {
            $http.post("/Apilike/RemoveTest" + '?testGuid=' + testGuid).then(function () {
                UpdateData();
            });
        };
        $scope.DeleteQuestion = function (questionGuid) {
            $http.post("/Apilike/RemoveQuestion" + '?questionGuid=' + questionGuid).then(function(){
                UpdateData();
            });
        };
        $scope.DeleteAnswer = function (answerGuid) {
            $http.post("/Apilike/RemoveAnswer" + '?answerGuid=' + answerGuid).then(function () {
                UpdateData();
            });
        };

        $scope.UpdateTest = function (test) {
            var tt, qt, FormatTT, FormatQT;
            if (isDate(test.TestTimeLimit)) {
                tt = new Date(test.TestTimeLimit);
                FormatTT = tt.getHours() + ":" + tt.getMinutes() + ":" + tt.getSeconds();
            }
            else FormatTT = test.TestTimeLimit;

            if (isDate(test.QuestionTimeLimit)) {
                qt = new Date(test.QuestionTimeLimit);
                FormatQT = qt.getHours() + ":" + qt.getMinutes() + ":" + qt.getSeconds();
            }
            else FormatQT = test.QuestionTimeLimit;
            console.log(test);
            var SendData = {
                'testGuid': test.Guid,
                'Name': test.Name,
                'Description': test.Description,
                'TestTimeLimit': FormatTT,
                'QuestionTimeLimit': FormatQT,
                'Guid': test.Guid
            };
            console.log(SendData);
            $http.post("/Apilike/UpdateTest", SendData).then(function () {
                UpdateData();
            });

        };
        function isDate(val) {
            return val instanceof Date;
        }
        $scope.UpdateQuestion = function (q) {
            var SendData = {
                'questionGuid': q.Guid,
                'Instance': q.Instance, 
                'Guid': q.Guid,
                'Hint': q.Hint
            };
            $http.post("/Apilike/UpdateQuestion", SendData).then(function () {
                UpdateData();
            });

        };
        $scope.TestEditMode = function (index) {
            if ($scope.TestEditable[index] === true)
                $scope.TestEditable[index] = false;
            else
                $scope.TestEditable[index] = true;
        };
        $scope.QuestionEditMode = function (indexQuestion) {

            if ($scope.QuestionEditable[indexQuestion] === true) {

                $scope.QuestionEditable[indexQuestion] = false;
            }
            else {
                $scope.QuestionEditable[indexQuestion] = true;
            }
        };

        function UpdateData() {
            $timeout(function () {
                $http.get("/Admin/GetAllTests").then(function (data) {
                    $scope.Quiz = data.data;
                    console.log($scope.Quiz);
                });
            },0);
        }


    });

