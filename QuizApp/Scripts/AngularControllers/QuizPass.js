angular.module("QuizApp",[])
    .controller("QuizPassing", function ($scope, $http,$timeout) {
        $scope.QuestionVision = [];
        var Answers = [];
        var StartDateTime = new Date();
        var EndDateTime = new Date();
        var SendQuestionsAnswers = [];
        currQuestion=0;
        $scope.Start = function (Interviewee, urlGuid) {
            $http.get("/Quiz/GetInfoAndStartTest" + "?testingUrlGuid=" + urlGuid)
                .then(function (data) {
                    $scope.TestData = data.data;
                    $scope.TestData.Interviewee = $scope.Start.Interviewee;
                    if ($scope.TestData.Interviewee === undefined) {
                        $scope.TestData.Interviewee = Interviewee;
                    }
                    $scope.TestStart = true;
                    $scope.TestData.testingGuid = urlGuid;
                    $scope.QuestionVision[0] = true;
                    StartDateTime.setTime(Date.now());
                    TimerStart();
                   // console.log($scope.TestData);
                   // console.log(StartDateTime);
                });
        };
        $scope.AddAnswer = function (Answer, index) {
            $scope.QuestionVision[index] = false;
            $scope.QuestionVision[index + 1] = true;
            Answers[index] = SelectedAnswers(Answer);
            currQuestion++;
            QuestionTime = $scope.TestData.QuestionTimeLimit.TotalMilliseconds;
        };

        $scope.FinishTest = function (Answer, index) {
            Answers[index] = SelectedAnswers(Answer);
            tic = false;
            EndDateTime.setTime(Date.now());
            var l = 0;
            for (i = 0; i <= index; i++) {
                SendQuestionsAnswers[i] = {
                    'QuestionGuid': $scope.TestData.Questions[i].Guid,
                    'AnswersSelected': Answers[i]
                };
            }
            var SendData =
                {
                    'AttemptGuid': $scope.TestData.AttemptGuid,
                    'Interviewee': $scope.TestData.Interviewee,
                    'TestingStartDateTime': StartDateTime,
                    'TestingEndDateTime': EndDateTime,
                    'QuestionTried': index + 1,
                    'Questions': SendQuestionsAnswers,
                    'TestingGuid': $scope.TestData.testingGuid
                };

            $http.post("/Quiz/FinishTest", SendData).then(function () {
                $http.get("/Admin/GetAllTestingResults/").then(function (data) {
                    $scope.CurrResults = data.data[data.data.length - 1];
                    $scope.CurrResults.Score *= 100;
                    if ($scope.CurrResults.Score === 100) $scope.CurrResults.msg = "Perfect";
                    else if ($scope.CurrResults.Score >= 75) $scope.CurrResults.msg = "fine";
                    else if ($scope.CurrResults.Score >= 50) $scope.CurrResults.msg = "not bad";
                    else if ($scope.CurrResults.Score > 0) $scope.CurrResults.msg = "bad";
                    else if ($scope.CurrResults.Score === 0) $scope.CurrResults.msg = "zero";
                    //console.log($scope.CurrResults);
                });
            });
            //console.log(SendData);
            $scope.TestFinished = true;
            $scope.TestStart = false;
            
        };

        function SelectedAnswers(answers) {
            var OnlySelected = [];
            l = 0;
            //console.log(answers);
            for (i = 0; i <= answers.length-1; i++) {
                if (answers[i].IsSelected === true) {
                    OnlySelected[l] = answers[i].Guid;
                    l++;
                }

            }
            return OnlySelected;
        }


        //Timer area//
        var AllTime, QuestionTime, tic,ChekAllTime,CheckQuestionTime;
        function TimerStart() {
            //console.log("Timer func");
            if ($scope.TestData.TestTimeLimit.TotalMilliseconds === 0) {
                CheckAllTime = false;
            }
            else {
                CheckAllTime = true; 
            }
            if ($scope.TestData.QuestionTimeLimit.TotalMilliseconds === 0) {
                CheckQuestionTime = false;
            }
            else {
                CheckQuestionTime = true;
            }
            AllTime = $scope.TestData.TestTimeLimit.TotalMilliseconds;
            QuestionTime = $scope.TestData.QuestionTimeLimit.TotalMilliseconds;
            tic = true;
            $timeout(TimerTics, 0);
        }
        
        function TimerTics() {
            if (AllTime > 0) {
                AllTime -= 1000;
                
            } else {
                if (CheckAllTime)
                ClickFinish();
            }

            if (QuestionTime > 1000 && CheckQuestionTime) {
                QuestionTime -= 1000;
            } else {
                if (CheckQuestionTime) {
                    QuestionTime -= 1000;
                    ClickNext();
                }
            }

            if (tic) {
                //console.log(tic);
                $scope.Timer = {
                    'TestTime': TimerView(AllTime),
                    'QuestionTime': TimerView(QuestionTime)
                };
                $timeout(TimerTics, 1000);
            } 
        }

        function ClickNext() {
            $timeout(function () {
                if (currQuestion < $scope.TestData.Questions.length-1) {
                    angular.element('#Next' + currQuestion).triggerHandler('click');
                    
                }
                else {
                    ClickFinish();
                }
            });
        }

        function ClickFinish() {
            $timeout(function () {
                angular.element('#FinishButton').triggerHandler('click');
                
            });
        }

        function TimerView(ms) {
            var time;
            if (ms !== 0) {
                var sec = ms / 1000
                    , hours = sec / 3600 % 24
                    , minutes = sec / 60 % 60
                    , seconds = sec % 60;

                if (hours < 10) time = '0' + parseInt(hours) + ":";
                else time += parseInt(hours) + ":";
                if (minutes < 10) time += '0' + parseInt(minutes) + ":";
                else time += parseInt(minutes) + ":";
                if (seconds < 10) time += '0' + parseInt(seconds);
                else time += parseInt(seconds);
            }
            else time = "--:--:--";
            //console.log(time);

            return time;
        }
    });