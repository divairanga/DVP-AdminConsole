/**
 * Created by Pawan on 6/14/2016.
 */

mainApp.controller("limitController", function ($scope,$state,$uibModal, limitBackendService) {

    $scope.limitList=[];

    $scope.GetLimits = function () {
        limitBackendService.getLimits().then(function (response) {

            if(response.data.IsSuccess)
            {
                $scope.limitList=response.data.Result;
            }
            else
            {
                console.log("Picking limits failed ",response.data.Exception);
            }

        }, function (error) {
            console.log("Error in picking limits  ",error);
        });
    };

    $scope.showModal= function (limId,limitData) {
        //modal show
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/limit/partials/editLimit.html',
            controller: 'limitModalController',
            size: 'sm',
            resolve: {
                limId: function () {
                    return limId;
                },
                limitData : function () {
                    return limitData;
                },
                reloadPage : function () {
                    return $scope.reloadPage;
                }
            }
        });
    };

    $scope.reloadPage= function () {
        $state.reload();
    };

    $scope.DeleteLimit = function () {

    }
    $scope.GetLimits();

});

mainApp.controller("limitModalController", function ($scope, $uibModalInstance,limitBackendService,limId,limitData,reloadPage) {
    $scope.showModal=true;
    if(limId)
    {
        $scope.limitData=limitData;
    }

    $scope.saveOrUpdateLimit = function (limitData) {

        if(!limId)
        {
            $scope.saveLimit(limitData);
        }
        else
        {
            $scope.updateLimit(limitData);
        }

    }




    $scope.saveLimit = function (resource) {

        limitBackendService.saveNewLimit(resource).then(function (response) {
            if(response.data.IsSuccess)
            {
                console.log("successfully Saved new Limit ");
                $scope.closeModal();
            }
            else
            {
                console.log("Exception in Save new Limit "+response.data.Exception);
                $scope.closeModal();
            }


        }, function (error) {
            console.log("error in Save new Limit "+error);
            $scope.closeModal();
        });

    };

    $scope.updateLimit = function (resource) {

        if (limId) {
            limitBackendService.updateMaxLimit(resource.LimitId, resource.MaxCount).then(function (response) {
                if (response.data.IsSuccess) {
                    console.log("successfully Saved  Limit MAx ");
                    $scope.closeModal();
                }
                else {
                    console.log("Exception in Limit Max " + response.data.Exception);
                    $scope.closeModal();
                }


            }, function (error) {
                console.log("error in Limit Max " + error);
                $scope.closeModal();

            });

        }
    };
    $scope.updateLimitStatus = function (resource) {

        if(limId)
        {
            limitBackendService.setLimitStatus(resource.LimitId,resource.Enable).then(function (response) {
                if(response.data.IsSuccess)
                {
                    console.log("successfully set Limit status ");
                }
                else
                {
                    console.log("Exception in setting Limit status "+response.data.Exception);
                }

            }, function (error) {
                console.log("error in setting Limit status "+error);
            });
        }


    };

    $scope.closeModal= function () {
        $uibModalInstance.dismiss('cancel');
        reloadPage();
    }




});