/**
 * Created by Waruna on 10/2/2017.
 */

mainApp.factory('contactService', function ($http, baseUrls) {

    var getAllContacts = function () {
        return $http({
            method: 'GET',
            url: baseUrls.contactUrl + "Contacts"
        }).then(function (response) {
            if (response.data) {
                return response.data;
            } else {
                return {};
            }
        });
    };

    var createNewContact = function (name, contact) {
        var obj = {"contact": contact, "type": "work", "name": name};
        return $http({
            method: 'POST',
            data: obj,
            url: baseUrls.contactUrl + "Contact"
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data;
            } else {
                return undefined;
            }
        });
    };

    var saveCallLog = function (log) {
        var obj = {"log": log};
        return $http({
            method: 'POST',
            data: obj,
            url: baseUrls.contactUrl + "CallLog"
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.IsSuccess;
            } else {
                return false;
            }
        });
    };

    var getCallLogs = function (page, date,resourceName) {
        var url = baseUrls.contactUrl + "Resource/"+resourceName+"/CallLog/10/"+page;
        if (date) {
            url = url + "?date=" + date;
        }
        return $http({
            method: 'GET',
            url:url
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return null;
            }
        });
    };

    var searchCallLogs = function (number) {
        return $http({
            method: 'GET',
            url: baseUrls.contactUrl + "SearchCallLog/" + number
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return null;
            }
        });
    };

    return {
        getAllContacts: getAllContacts,
        CreateNewContact: createNewContact,
        SaveCallLog: saveCallLog,
        GetCallLogs: getCallLogs,
        SearchCallLogs: searchCallLogs
    }
});