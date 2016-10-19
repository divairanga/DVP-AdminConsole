/**
 * Created by Rajinda on 12/31/2015.
 */
'use strict';
mainApp.factory("ticketService", function ($http, $log, $filter, authService, baseUrls) {

    var saveForm = function (item) {

        return $http({
            method: 'post',
            url: baseUrls.ticketUrl + 'FormMaster',
            data: item
        }).then(function (response) {
            return response.data.IsSuccess;
        });
    };

    var getFormProfile = function () {

        return $http({
            method: 'get',
            url: baseUrls.ticketUrl + 'FormProfile'
        }).then(function (response) {
            return response.data;
        });
    };

    var saveFormProfile = function (formProfile) {

        return $http({
            method: 'post',
            url: baseUrls.ticketUrl + 'FormProfile',
            data: JSON.stringify(formProfile)
        }).then(function (response) {
            return response.data;
        });
    };

    var updateFormProfile = function (formProfile) {

        return $http({
            method: 'put',
            url: baseUrls.ticketUrl + 'FormProfile',
            data: JSON.stringify(formProfile)
        }).then(function (response) {
            return response.data;
        });
    };

    var loadFormList = function () {

        return $http({
            method: 'get',
            url: baseUrls.ticketUrl + 'FormMasters'
        }).then(function (response) {
            return response.data.Result;
        });
    };
    return {
        SaveForm:saveForm,
        LoadFormList: loadFormList,
        getFormProfile: getFormProfile,
        saveFormProfile: saveFormProfile,
        updateFormProfile: updateFormProfile
    }

});




