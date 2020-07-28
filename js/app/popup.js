var myApp = angular.module("my-app", []);

myApp.controller("PopupCtrl", ['$scope', '$http', '$rootScope', function ($scope, $rootScope, $http) {
   console.log("Controller Initialized");

   $scope.selectedText = "";
   $scope.neutralStyle = {};
   $scope.score = "";
   $scope.magnitude = "";

   $scope.positiveWidth = {'width': 0 + "px"};
   //$scope.positivePercentage = "";

   $scope.negativeWidth = {'width': 0 + "px"};
   $scope.negativePercentage = "";

   // Get Background Page to get selectedText from it's scope
   /*let bgPage = chrome.extension.getBackgroundPage();
   let selectedText = bgPage.selectedText;
   $scope.selectedText = selectedText;*/
   /*let selectedText2 = chrome.tabs.sendMessage(tab[0].id, { method: "getSelection" },
    function (response) {
        var text = document.getElementById('text');
        text.innerHTML = response.data;
    });*/
   /*chrome.tabs.executeScript({ code: 'window.getSelection().toString();' }, function (selection) {
       console.log(selection[0]);
       selectedText2 = selection[0];
   });*/
   
   /*function analyzeSelection() {
       chrome.tabs.query({ active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
       function (tab) {
           chrome.tabs.sendMessage(tab[0].id, { method: "getSelection" },
           function (result) {
               console.log("selectedText: " + result.data);
               if (result.data.length > 0) {
                   $http({
                       url: 'https://apis.paralleldots.com/v4/sentiment',
                       method: "POST",
                       data: {
                           key: "IwpHO2YOtbGRBA73ZLNOLrg0wj23ZbjaTW15Xxz7fag",
                           text: result.data
                       }
                   })
                    .then(function(response) {
                        // success
                        console.log("success in getting reponse from Sentiment Analysis API");
                        console.log("response: " + JSON.stringify(response));
                        $scope.score = response.data.sentiment.neutral;
                        $scope.magnitude = response.data.sentiment.neutral;
                        updateSentimentAnalyzer();
                    },
                    function(response) { // optional
                        // failed
                        console.log("failure in getting response from Sentiment Analysis API");
                    });
               }    
           })
       })
   }*/

   chrome.tabs.executeScript({
       code: "window.getSelection().toString();"
   }, function (selection) {
       console.log("selectedText: " + selection[0]);
       if (selection[0].length > 0) {
           /*$http({
               url: 'https://apis.paralleldots.com/v4/sentiment',
               method: "POST",
               data: {
                   api_key: "IwpHO2YOtbGRBA73ZLNOLrg0wj23ZbjaTW15Xxz7fag",
                   text: selection[0]
               }
           })
            .then(function (response) {
                // success
                console.log("success in getting reponse from Sentiment Analysis API");
                console.log("response: " + JSON.stringify(response));
                $scope.score = response.data.sentiment.neutral;
                $scope.magnitude = response.data.sentiment.neutral;
                updateSentimentAnalyzer();
            },
            function (response) { // optional
                // failed
                console.log("failure in getting response from Sentiment Analysis API");
            });*/
           var formdata = new FormData();
           formdata.append("text", selection[0]);
           formdata.append("api_key", "IwpHO2YOtbGRBA73ZLNOLrg0wj23ZbjaTW15Xxz7fag");

           var requestOptions = {
               method: 'POST',
               body: formdata,
               redirect: 'follow'
           };
           fetch("https://apis.paralleldots.com/v4/sentiment", requestOptions)
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
                 $scope.score = resJson.sentiment.neutral;
                 $scope.magnitude = resJson.sentiment.neutral;
                 console.log($scope.score + $scope.magnitude);
                 updateSentimentAnalyzer();
             })
             .catch(err => console.log(err))
           /*response = fetch("https://apis.paralleldots.com/v4/sentiment", requestOptions);
           if (response.ok){
               json = response.json();
               console.log("success in getting reponse from Sentiment Analysis API");
               console.log("response: " + JSON.stringify(json));
               $scope.score = json.data.sentiment.neutral;
               $scope.magnitude = json.data.sentiment.neutral;
               updateSentimentAnalyzer();
           } else {
               alert("HTTP-Error: " + response.status);
           }*/
       }
   });
   

   /*if (selectedText2.length > 0) {
     $http({
         url: 'https://apis.paralleldots.com/v4/sentiment',
          method: "POST",
          data: {
            key: "IwpHO2YOtbGRBA73ZLNOLrg0wj23ZbjaTW15Xxz7fag",
            text: selectedText2
          }
      })
      .then(function(response) {
        // success
        console.log("success in getting reponse from Sentiment Analysis API");
        console.log("response: " + JSON.stringify(response));
        $scope.score = response.data.sentiment.neutral;
        $scope.magnitude = response.data.sentiment.neutral;
        updateSentimentAnalyzer();
      },
      function(response) { // optional
        // failed
        console.log("failure in getting response from Sentiment Analysis API");
      });
   }*/

   function updateSentimentAnalyzer() {
       let percentage = Math.abs($scope.score) * 100;
       if ($scope.score > 0) {
           // Positive
           $scope.positiveWidth = { 'width': percentage + "%" };
           $scope.positivePercentage = percentage + "%";
           console.log($scope.positivePercentage);
           $scope.$apply();
       } else if ($scope.score < 0) {
           // Negative
           $scope.negativeWidth = { 'width': percentage + "%" };
           $scope.negativePercentage = percentage;
       } else {
           // Neutral
           $scope.positiveWidth = { 'width': "5px" };
           $scope.negativeWidth = { 'width': "5px" };
           $scope.neutralStyle = { 'font-weight': "bold" };
           $scope.$apply();
       }
   }

  }
]);
