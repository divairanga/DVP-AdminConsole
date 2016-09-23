/**
 * Created by Heshan.i on 8/16/2016.
 */
(function(){
    var app =angular.module('veeryConsoleApp');

    var triggerConfigController = function ($scope, $state, $stateParams, triggerApiAccess, triggerUserServiceAccess, triggerTemplateServiceAccess, triggerArdsServiceAccess) {
        $scope.title = $stateParams.title;
        $scope.triggerId = $stateParams.triggerId;
        $scope.triggerAction = {};
        $scope.triggerFilter = {};
        $scope.triggerOperation = {};
        $scope.filterTypeAny = "any";
        $scope.filterTypeAll = "all";
        $scope.triggerAction.value = "";
        $scope.users = {};
        $scope.userGroups = {};

        $scope.ticketSchemaKeys = [
            "due_at",
            "active",
            "is_sub_ticket",
            "type",
            "subject",
            "reference",
            "description",
            "priority",
            "status",
            "assignee",
            "assignee_group",
            "channel",
            "tags",
            "SLAViolated"
        ];
        $scope.ticketSchema = {
            due_at: {type: "Date"},
            active: {type: "Boolean"},
            is_sub_ticket: {type: "Boolean"},
            type: {type: "String", enum : ["question","complain","incident","action"]},
            subject: { type: "String"},
            reference: { type: "String"},
            description: { type: "String"},
            priority: {type: "String", enum : ["urgent","high","normal","low"]},
            status: {type: "String", enum : ["new","open","progressing","parked","solved","closed"]},
            assignee: {type: "ObjectId",ref: "User"},
            assignee_group: {type: "ObjectId",ref: "UserGroup"},
            channel: {type: String},
            tags: [String],
            SLAViolated: Boolean
        };

        $scope.filterActionSchemaKeys = function(value){
            if(value === "channel" || value === "tags" || value === "SLAViolated"){
                return false;
            }else{
                return true;
            }
        };

        $scope.showAlert = function (title,content,type) {
            new PNotify({
                title: title,
                text: content,
                type: type,
                styling: 'bootstrap3'
            });
        };

        //$scope.reloadPage = function () {
        //    $state.reload();
        //};

        //---------------ResetData-------------------------------
        $scope.updateValue = function(){
            $scope.triggerFilter.value = undefined;
        };

        $scope.OnChangeTriggerOperation = function(){
            $scope.triggerOperation.field = undefined;
            $scope.triggerOperation.value = undefined;
        };

        //---------------functions Initial Data-------------------
        $scope.loadFilterAll = function(){
            triggerApiAccess.getFiltersAll($stateParams.triggerId).then(function(response){
                if(response.IsSuccess)
                {
                    $scope.filterAll = response.Result;
                }
                else
                {
                    var errMsg = response.CustomMessage;

                    if(response.Exception)
                    {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('Error', 'error', errMsg);
                }
            }, function(err){
                var errMsg = "Error occurred while loading filters";
                if(err.statusText)
                {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
        };

        $scope.loadFilterAny = function(){
            triggerApiAccess.getFiltersAny($stateParams.triggerId).then(function(response){
                if(response.IsSuccess)
                {
                    $scope.filterAny = response.Result;
                }
                else
                {
                    var errMsg = response.CustomMessage;

                    if(response.Exception)
                    {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('Error', 'error', errMsg);
                }
            }, function(err){
                var errMsg = "Error occurred while loading filters";
                if(err.statusText)
                {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
        };

        $scope.loadTriggerActions = function(){
            triggerApiAccess.getActions($stateParams.triggerId).then(function(response){
                if(response.IsSuccess)
                {
                    $scope.triggerActions = response.Result;
                }
                else
                {
                    var errMsg = response.CustomMessage;

                    if(response.Exception)
                    {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('Error', 'error', errMsg);
                }
            }, function(err){
                var errMsg = "Error occurred while loading trigger actions";
                if(err.statusText)
                {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
        };

        $scope.loadTriggerOperations = function(){
            triggerApiAccess.getOperations($stateParams.triggerId).then(function(response){
                if(response.IsSuccess)
                {
                    $scope.triggerOperations = response.Result;
                }
                else
                {
                    var errMsg = response.CustomMessage;

                    if(response.Exception)
                    {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('Error', 'error', errMsg);
                }
            }, function(err){
                var errMsg = "Error occurred while loading trigger operations";
                if(err.statusText)
                {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
        };

        $scope.loadUsers = function(){
            triggerUserServiceAccess.getUsers().then(function(response){
                if(response.IsSuccess)
                {
                    $scope.users = response.Result;
                }
                else
                {
                    var errMsg = response.CustomMessage;

                    if(response.Exception)
                    {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('Error', 'error', errMsg);
                }
            }, function(err){
                var errMsg = "Error occurred while loading users";
                if(err.statusText)
                {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
        };

        $scope.loadUserGroups = function(){
            triggerUserServiceAccess.getUserGroups().then(function(response){
                if(response.IsSuccess)
                {
                    $scope.userGroups = response.Result;
                }
                else
                {
                    var errMsg = response.CustomMessage;

                    if(response.Exception)
                    {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('Error', 'error', errMsg);
                }
            }, function(err){
                var errMsg = "Error occurred while loading user groups";
                if(err.statusText)
                {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
        };

        $scope.loadAttributes = function(){
            triggerArdsServiceAccess.getReqMetaData().then(function(response){
                if(response.IsSuccess)
                {
                    $scope.attributes = [];
                    if(response.Result) {
                        var jResult = JSON.parse(response.Result);
                        if(jResult.AttributeMeta){
                            for(var i = 0; i < jResult.AttributeMeta.length; i++){
                                if(jResult.AttributeMeta[i].AttributeDetails) {
                                    for (var j = 0; j < jResult.AttributeMeta[i].AttributeDetails.length; j++) {

                                        $scope.attributes.push(jResult.AttributeMeta[i].AttributeDetails[j]);
                                    }
                                }
                            }
                        }
                    }
                }
                else
                {
                    var errMsg = response.CustomMessage;

                    if(response.Exception)
                    {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('Error', 'error', errMsg);
                }
            }, function(err){
                var errMsg = "Error occurred while loading attributes";
                if(err.statusText)
                {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
        };

        $scope.loadTemplateInfo = function(){
            triggerTemplateServiceAccess.getTemplates().then(function(response){
                if(response.IsSuccess)
                {
                    $scope.templates = response.Result;
                }
                else
                {
                    var errMsg = response.CustomMessage;

                    if(response.Exception)
                    {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('Error', 'error', errMsg);
                }
            }, function(err){
                var errMsg = "Error occurred while loading templates";
                if(err.statusText)
                {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
        };

        //---------------updateCollections-----------------------
        $scope.removeDeletedAction = function (item) {

            var index = $scope.triggerActions.indexOf(item);
            if (index != -1) {
                $scope.triggerActions.splice(index, 1);
            }

        };

        $scope.removeDeletedFilter = function (item, itemType) {
            switch (itemType){
                case "any":
                    var indexAny = $scope.filterAny.indexOf(item);
                    if (indexAny != -1) {
                        $scope.filterAny.splice(indexAny, 1);
                    }
                    break;
                case "all":
                    var indexAll = $scope.filterAll.indexOf(item);
                    if (indexAll != -1) {
                        $scope.filterAll.splice(indexAll, 1);
                    }
                    break;
                default :
                    break;
            }


        };

        $scope.removeDeletedOperation = function (item) {

            var index = $scope.triggerOperations.indexOf(item);
            if (index != -1) {
                $scope.triggerOperations.splice(index, 1);
            }

        };

        //---------------insertNewData-----------------------------
        $scope.addTriggerAction = function(){
            console.log(JSON.stringify($scope.triggerAction));


            if($scope.triggerAction.value === "TRUE"){
                $scope.triggerAction.value = true;
            }else if($scope.triggerAction.value === "FALSE"){
                $scope.triggerAction.value = false;
            }


            triggerApiAccess.addAction($scope.triggerId, $scope.triggerAction).then(function(response){
                if(response.IsSuccess)
                {
                    $scope.loadTriggerActions();
                    $scope.showAlert('Success', 'info', response.CustomMessage);
                    //$state.reload();
                }
                else
                {
                    var errMsg = response.CustomMessage;

                    if(response.Exception)
                    {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('Error', 'error', errMsg);
                }
            }, function(err){
                var errMsg = "Error occurred while saving trigger action";
                if(err.statusText)
                {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
        };

        $scope.addTriggerFilter = function(){
            console.log(JSON.stringify($scope.triggerFilter));

            if($scope.triggerFilter.value === "TRUE"){
                $scope.triggerFilter.value = true;
            }else if($scope.triggerFilter.value === "FALSE"){
                $scope.triggerFilter.value = false;
            }

            switch ($scope.triggerFilter.type){
                case "any":
                    triggerApiAccess.addFilterAny($scope.triggerId, $scope.triggerFilter).then(function(response){
                        if(response.IsSuccess)
                        {
                            $scope.loadFilterAny();
                            $scope.showAlert('Success', 'info', response.CustomMessage);
                            //$state.reload();
                        }
                        else
                        {
                            var errMsg = response.CustomMessage;

                            if(response.Exception)
                            {
                                errMsg = response.Exception.Message;
                            }
                            $scope.showAlert('Error', 'error', errMsg);
                        }
                    }, function(err){
                        var errMsg = "Error occurred while saving trigger filters";
                        if(err.statusText)
                        {
                            errMsg = err.statusText;
                        }
                        $scope.showAlert('Error', 'error', errMsg);
                    });
                    break;
                case "all":
                    triggerApiAccess.addFilterAll($scope.triggerId, $scope.triggerFilter).then(function(response){
                        if(response.IsSuccess)
                        {
                            $scope.loadFilterAll();
                            $scope.showAlert('Success', 'info', response.CustomMessage);
                            //$state.reload();
                        }
                        else
                        {
                            var errMsg = response.CustomMessage;

                            if(response.Exception)
                            {
                                errMsg = response.Exception.Message;
                            }
                            $scope.showAlert('Error', 'error', errMsg);
                        }
                    }, function(err){
                        var errMsg = "Error occurred while saving trigger filters";
                        if(err.statusText)
                        {
                            errMsg = err.statusText;
                        }
                        $scope.showAlert('Error', 'error', errMsg);
                    });
                    break;
                default :
                    break;
            }
        };

        $scope.addTriggerOperation = function(){
            console.log(JSON.stringify($scope.triggerOperation));
            triggerApiAccess.addOperations($scope.triggerId, $scope.triggerOperation).then(function(response){
                if(response.IsSuccess)
                {
                    $scope.loadTriggerOperations();
                    $scope.showAlert('Success', 'info', response.CustomMessage);
                    //$state.reload();
                }
                else
                {
                    var errMsg = response.CustomMessage;

                    if(response.Exception)
                    {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('Error', 'error', errMsg);
                }
            }, function(err){
                var errMsg = "Error occurred while saving trigger operation";
                if(err.statusText)
                {
                    errMsg = err.statusText;
                }
                $scope.showAlert('Error', 'error', errMsg);
            });
        };

        //---------------load initialData--------------------------
        $scope.loadFilterAll();
        $scope.loadFilterAny();
        $scope.loadTriggerActions();
        $scope.loadTriggerOperations();
        $scope.loadUsers();
        $scope.loadUserGroups();
        $scope.loadTemplateInfo();
        $scope.loadAttributes();
    };

    app.controller('triggerConfigController', triggerConfigController);
}());