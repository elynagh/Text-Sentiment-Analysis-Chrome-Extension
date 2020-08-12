var myApp = angular.module("my-app", []);

myApp.controller("PopupCtrl", ['$scope', '$http', '$rootScope', function ($scope, $rootScope, $http) {
   console.log("Controller Initialized");

   $scope.selectedText = "";
   $scope.neutralStyle = {};
   $scope.score = "";
   $scope.magnitude = "";
   $scope.politicalScore = 0;

   $scope.positiveWidth = {'width': 0 + "px"};
   //$scope.positivePercentage = "";

   $scope.negativeWidth = {'width': 0 + "px"};
   $scope.negativePercentage = "";

   // adjust political scale from -42 to 42, to -100 to 100
   function adjustPoliticalScale(originalNumber) {
       let newNumber = (((originalNumber + 42) / (82)) * 200) - 100;
       console.log(newNumber);
       return newNumber;
   }

   chrome.tabs.executeScript({
       code: "window.getSelection().toString();"
   }, function (selection) {
       console.log("selectedText: " + selection[0]);
       if (selection[0].length > 0) {

           // Code for sentiment analysis
           var myHeaders = new Headers();
           myHeaders.append("Content-Type", "application/json");
           myHeaders.append("Authorization", "***REMOVED***");

           var raw = JSON.stringify({ "text": selection[0], "features": { "sentiment": {} } });

           var requestOptions = {
               method: 'POST',
               headers: myHeaders,
               body: raw,
               redirect: 'follow'
           };
           fetch("https://api.us-south.natural-language-understanding.watson.cloud.ibm.com/instances/***REMOVED***/v1/analyze?version=2019-07-12", requestOptions)
             .then(res => {
                 try {
                     if (res.ok) {
                         return res.json()
                     } else {
                         throw new Error(res)
                     }
                 }
                 catch (err) {
                     console.log(err.message)
                     return WHATEVER_YOU_WANT_TO_RETURN
                 }
             })
             .then(resJson => {
                 console.log("success in getting reponse from Sentiment Analysis API");
                 console.log("response: " + JSON.stringify(resJson));
                 $scope.score = resJson.sentiment.document.score;
                 $scope.magnitude = resJson.sentiment.document.label;
                 console.log($scope.score + $scope.magnitude);
                 updateSentimentAnalyzer();
             })
             .catch(err => console.log(err))

           // Code for political analysis
           var myHeaders = new Headers();
           myHeaders.append("Cookie", "***REMOVED***");

           var formdata = new FormData();
           formdata.append("API", "***REMOVED***");
           formdata.append("Text", selection[0]);

           var requestOptions = {
               method: 'POST',
               headers: myHeaders,
               body: formdata,
               redirect: 'follow'
           };

           fetch("https://api.thebipartisanpress.com/api/endpoints/beta/robert", requestOptions)
             .then(res => {
                 try {
                     if (res.ok) {
                         return res.text()
                     } else {
                         throw new Error(res)
                     }
                 }
                 catch (err) {
                     console.log(err.message)
                     return WHATEVER_YOU_WANT_TO_RETURN
                 }
             })
             .then(resText => {
                 console.log("success in getting reponse from Political Analysis API");
                 console.log("response: " + resText);
                 $scope.politicalScore = Number(resText);
                 console.log($scope.politicalScore);
                 updatePoliticalAnalyzer();
             })
             .catch(err => console.log(err))
       }
   });

   function updateSentimentAnalyzer() {
       let percentage = Math.abs($scope.score) * 100;
       if ($scope.magnitude === "positive") {
           // Positive
           $scope.positiveWidth = { 'width': percentage + "%" };
           $scope.positivePercentage = percentage + "%";
           console.log($scope.positivePercentage);
           $scope.$apply();
       } else if ($scope.magnitude === "negative") {
           // Negative
           $scope.negativeWidth = { 'width': percentage + "%" };
           $scope.negativePercentage = percentage + "%";
           $scope.$apply();
       } else {
           // Neutral
           $scope.positiveWidth = { 'width': "5px" };
           $scope.negativeWidth = { 'width': "5px" };
           $scope.neutralStyle = { 'font-weight': "bold" };
           $scope.$apply();
       }
   }

   function updatePoliticalAnalyzer() {
       let percentage = adjustPoliticalScale($scope.politicalScore);
       $scope.politicalMagnitude = percentage;
       if (percentage > 0) {
           // Positive
           console.log("positive1");
           $scope.politicalPositiveWidth = { 'width': percentage + "%" };
           $scope.politicalPositivePercentage = percentage + "%";
           console.log($scope.politicalPositivePercentage);
           $scope.$apply();
       } else if (percentage < 0) {
           // Negative
           console.log("negative1");
           $scope.politicalNegativeWidth = { 'width': percentage + "%" };
           $scope.politicalNegativePercentage = Math.abs(percentage) + "%";
           console.log($scope.politicalNegativePercentage);
           $scope.$apply();
       } else {
           // Neutral
           console.log("neither");
           $scope.politicalPositiveWidth = { 'width': "5px" };
           $scope.politicalNegativeWidth = { 'width': "5px" };
           $scope.neutralStyle = { 'font-weight': "bold" };
           $scope.$apply();
       }
   }

  }
]);
