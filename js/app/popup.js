var myApp = angular.module("my-app", []);

myApp.controller("PopupCtrl", ['$scope', '$http', '$rootScope', function ($scope, $rootScope, $http) {
   console.log("Controller Initialized");

   $scope.maxUses = true;
   $scope.selectedText = "";
   $scope.neutralStyle = {};
   $scope.score = "";
   $scope.magnitude = "";
   $scope.politicalScore = 0;
   $scope.biasRating = 0.0;

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

   //function getEmailPromise() {
    //return new Promise(function(resolve, reject) {
    //    chrome.identity.getProfileUserInfo(function(userInfo) {
    //        console.log(JSON.stringify(userInfo));
    //        if (userInfo["email"] == "") {
    //            console.log("fail");
    //            resolve(true);
    //        } else {
    //            resolve(false);
     //       }
     //   });
    //});
   //}


   chrome.tabs.executeScript({
       code: "window.getSelection().toString();"
   }, async function (selection) {
       //var maxUses = await getEmailPromise();
       var maxUses = true;
       console.log(maxUses);
       console.log("selectedText: " + selection[0]);
       if (selection[0].length > 0 && maxUses == true) {

           // code for gender analysis
           var myHeaders5 = new Headers();
           myHeaders5.append("Content-Type", "application/json");

           var raw5 = JSON.stringify({ "textToTest": selection[0] });

           var requestOptions5 = {
               method: 'POST',
               headers: myHeaders5,
               body: raw5,
               redirect: 'follow'
           };

           fetch("https://jaiv43beaj.execute-api.us-west-2.amazonaws.com/test/getbias", requestOptions5)
             .then(response => response.json())
             .then(resText2 => {
                 console.log("success in getting reponse from Gender Bias API");
                 console.log("response: " + JSON.stringify(resText2) + " gender score : " + resText2.genderScore);
                 console.log("sentiment score: " + resText2.sentimentScore + " " + resText2.sentimentLabel);
                 console.log("poli score: " + resText2.poliScore);
                 $scope.biasRating = parseFloat(resText2.genderScore);
                 $scope.score = resText2.sentimentScore;
                 $scope.magnitude = resText2.sentimentLabel;
                 $scope.politicalScore = Number(resText2.poliScore);
                 //console.log($scope.biasRating);
                 updateSentimentAnalyzer();
                 updatePoliticalAnalyzer();
                 updateGenderScore();
             })
             .catch(error => console.log('error', error));

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

   function updateGenderScore() {
       let genderPercentage = Math.abs($scope.biasRating) * 100;
       if ($scope.biasRating > 0) {
           // Positive
           console.log("male");
           $scope.genderPositiveWidth = { 'width': genderPercentage + "%" };
           $scope.genderPositivePercentage = genderPercentage + "%";
           $scope.genderMag = "male";
           console.log($scope.genderPositivePercentage);
           $scope.$apply();
       } else if ($scope.biasRating < 0) {
           // Negative
           console.log("negative1");
           $scope.genderNegativeWidth = { 'width': genderPercentage + "%" };
           $scope.genderNegativePercentage = Math.abs(genderPercentage) + "%";
           $scope.genderMag = "female";
           console.log($scope.genderNegativePercentage);
           $scope.$apply();
       } else {
           // Neutral
           console.log("neither");
           $scope.genderPositiveWidth = { 'width': "5px" };
           $scope.genderNegativeWidth = { 'width': "5px" };
           $scope.neutralStyle = { 'font-weight': "bold" };
           $scope.$apply();
       }
   }

  }
]);
