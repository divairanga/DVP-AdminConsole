/**
 * Created by dinusha on 12/30/2015.
 */
(function() {

  var pbxUserApiHandler = function($http, authService, baseUrls)
  {
    var getPABXUsers = function()
    {

      return $http({
        method: 'GET',
        url: baseUrls.pbxUrl + 'PBXUsers',
        headers: {
          'authorization': authService.GetToken()
        }
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var getSIPUsers = function()
    {
      return $http({
        method: 'GET',
        url: baseUrls.sipUserendpoint + 'Users',
        headers: {
          'authorization': authService.GetToken()
        }
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var getPABXUserTemplates = function(userUuid)
    {
      return $http({
        method: 'GET',
        url: baseUrls.pbxUrl + 'PBXUser/' + userUuid + '/PBXUserTemplates',
        headers: {
          'authorization': authService.GetToken()
        }
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var postPABXUserTemplate = function(userUuid, destNum, destType)
    {
      return $http({
        method: 'POST',
        url: baseUrls.pbxUrl + 'PBXUser/' + userUuid + '/PBXUserTemplate',
        headers: {
          'authorization': authService.GetToken()
        },
        data:{CallDivertNumber:destNum, ObjCategory: destType}
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var saveFollowMeConfig = function(userUuid, fmList)
    {
      return $http({
        method: 'POST',
        url: baseUrls.pbxUrl + 'PBXUser/' + userUuid + '/FollowMeMulti',
        headers: {
          'authorization': authService.GetToken()
        },
        data:JSON.stringify(fmList)
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var saveForwardingConfig = function(userUuid, destNum, destType, disconReason, ringTOut)
    {
      return $http({
        method: 'POST',
        url: baseUrls.pbxUrl + 'PBXUser/' + userUuid + '/Forwarding',
        headers: {
          'authorization': authService.GetToken()
        },
        data:{DestinationNumber:destNum, ObjCategory: destType, RingTimeout: ringTOut, DisconnectReason: disconReason, IsActive: true}
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var setAllowedNumbers = function(userUuid, allowedNumbers)
    {
      return $http({
        method: 'POST',
        url: baseUrls.pbxUrl + 'PBXUser/' + userUuid + '/AllowedNumbers',
        headers: {
          'authorization': authService.GetToken()
        },
        data:{AllowedNumbers:allowedNumbers}
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var setDeniedNumbers = function(userUuid, deniedNumbers)
    {
      return $http({
        method: 'POST',
        url: baseUrls.pbxUrl + 'PBXUser/' + userUuid + '/DeniedNumbers',
        headers: {
          'authorization': authService.GetToken()
        },
        data:{DeniedNumbers:deniedNumbers}
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var updatePABXUser = function(usrObj)
    {
      return $http({
        method: 'PUT',
        url: baseUrls.pbxUrl + 'PBXUser/' + usrObj.UserUuid,
        headers: {
          'authorization': authService.GetToken()
        },
        data:usrObj
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var savePABXUser = function(usrObj)
    {
      return $http({
        method: 'POST',
        url: baseUrls.pbxUrl + 'PBXUser',
        headers: {
          'authorization': authService.GetToken()
        },
        data:usrObj
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var deletePABXTemplate = function(id)
    {
      return $http({
        method: 'DELETE',
        url: baseUrls.pbxUrl + 'PBXUserTemplate/' + id,
        headers: {
          'authorization': authService.GetToken()
        }
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var deletePABXUser = function(userUuid)
    {
      return $http({
        method: 'DELETE',
        url: baseUrls.pbxUrl + 'PBXUser/' + userUuid,
        headers: {
          'authorization': authService.GetToken()
        }
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var getPABXUser = function(id)
    {
      return $http({
        method: 'GET',
        url: baseUrls.pbxUrl + 'PBXUser/' + id,
        headers: {
          'authorization': authService.GetToken()
        }
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var getSchedules = function()
    {
      return $http({
        method: 'GET',
        url: 'http://limithandler.app.veery.cloud/DVP/API/1.0.0.0/LimitAPI/Schedules/byCompany',
        headers: {
          'authorization': authService.GetToken()
        }
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var getGreetingFileMetadata = function(refId)
    {
      return $http({
        method: 'GET',
        url: 'http://fileservice.app.veery.cloud/DVP/API/1.0.0.0/FileService/Files/' + refId + '/PABX/USER/GREETING',
        headers: {
          'authorization': authService.GetToken()
        }
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var getFollowMeConfigList = function(userUuid)
    {
      return $http({
        method: 'GET',
        url: baseUrls.pbxUrl + 'PBXUser/' + userUuid + '/FollowMe',
        headers: {
          'authorization': authService.GetToken()
        }
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var getForwardingConfigList = function(userUuid)
    {
      return $http({
        method: 'GET',
        url: baseUrls.pbxUrl + 'PBXUser/' + userUuid + '/Forwarding',
        headers: {
          'authorization': authService.GetToken()
        }
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var deleteFollowMe = function(fmId)
    {
      return $http({
        method: 'DELETE',
        url: baseUrls.pbxUrl + 'FollowMe/' + fmId,
        headers: {
          'authorization': authService.GetToken()
        }
      }).then(function(resp)
      {
        return resp.data;
      })
    };

    var deleteForwarding = function(fwdId)
    {
      return $http({
        method: 'DELETE',
        url: baseUrls.pbxUrl + 'Forwarding/' + fwdId,
        headers: {
          'authorization': authService.GetToken()
        }
      }).then(function(resp)
      {
        return resp.data;
      })
    };



    return {
      getPABXUsers: getPABXUsers,
      getPABXUserTemplates: getPABXUserTemplates,
      postPABXUserTemplate: postPABXUserTemplate,
      deletePABXTemplate: deletePABXTemplate,
      getPABXUser: getPABXUser,
      getGreetingFileMetadata: getGreetingFileMetadata,
      updatePABXUser: updatePABXUser,
      savePABXUser: savePABXUser,
      setAllowedNumbers: setAllowedNumbers,
      setDeniedNumbers: setDeniedNumbers,
      getSIPUsers: getSIPUsers,
      deletePABXUser: deletePABXUser,
      getFollowMeConfigList: getFollowMeConfigList,
      saveFollowMeConfig: saveFollowMeConfig,
      deleteFollowMe: deleteFollowMe,
      getForwardingConfigList: getForwardingConfigList,
      saveForwardingConfig: saveForwardingConfig,
      deleteForwarding: deleteForwarding,
      getSchedules: getSchedules

    };
  };

  var module = angular.module("veeryConsoleApp");
  module.factory("pbxUserApiHandler", pbxUserApiHandler);

}());
