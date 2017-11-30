mainApp.controller("agentStatusController", function ($scope, $state, $filter, $stateParams, $timeout, $log, $http,
                                                      $anchorScroll, agentStatusService, notifiSenderService,
                                                      reportQueryFilterService, uiGridConstants, $interval) {

    $anchorScroll();

    $scope.dtOptions = {paging: false, searching: false, info: false, order: [0, 'desc']};
    $scope.showCallInfos = false;
    $scope.summaryText = "Table";
    $scope.summary = false;
    $scope.largeCard = false;
    $scope.smallCard = false;
    $scope.showDetails = true;
    $scope.filterType="ALL";
    $scope.showTableCard = function () {
        $scope.summary = true;
        $scope.largeCard = false;
        $scope.smallCard = false;
        $scope.showDetails = false;
    };
    $scope.showSmallCard = function () {
        $scope.summary = false;
        $scope.largeCard = false;
        $scope.smallCard = true;
        $scope.showDetails = false;
    };
    $scope.showLargeCard = function () {
        $scope.summary = false;
        $scope.largeCard = true;
        $scope.smallCard = false;
        $scope.showDetails = false;
    };
    $scope.showDetailsCard = function () {
        $scope.summary = false;
        $scope.largeCard = false;
        $scope.smallCard = false;
        $scope.showDetails = true;
    };

    $scope.productivity = [];
    $scope.productivity = [];
    $scope.isLoading = true;
    var calculateProductivity = function () {
        $scope.Productivitys = [];
        $scope.showCallDetails = false;
        if ($scope.profile) {
            /*if ($scope.profile.length == 0) {
             angular.copy($scope.availableProfile, $scope.profile);
             }*/

            angular.forEach($scope.profile, function (agentProfile) {
                try {
                    var agent = null;
                    var availableAgent = $filter('filter')($scope.onlineProfile, {ResourceId: agentProfile.ResourceId.toString()}, true);//"ResourceId":"1"

                    if (availableAgent.length > 0) {
                        agent = availableAgent[0];
                    }

                    if (agent) {
                        if ($scope.agentMode.length > 0) {
                            var modeData = $filter('filter')($scope.agentMode, {Name: agent.Status.Mode});
                            if (modeData.length == 0) {
                                return;
                            }
                        }

                        var ids = $filter('filter')($scope.productivity, {ResourceId: agent.ResourceId.toString()}, true);//"ResourceId":"1"

                        if (ids.length > 0) {
                            var agentProductivity = {
                                "data": [{
                                    value: ids[0].AcwTime ? ids[0].AcwTime : 0,
                                    name: 'After work'
                                }, {
                                    value: ids[0].BreakTime ? ids[0].BreakTime : 0,
                                    name: 'Break'
                                }, {
                                    value: ((ids[0].OnCallTime ? ids[0].OnCallTime : 0) + (ids[0].OutboundCallTime ? ids[0].OutboundCallTime : 0)),//OutboundCallTime
                                    name: 'On Call'
                                }, {
                                    value: ids[0].IdleTime ? ids[0].IdleTime : 0,
                                    name: 'Idle'
                                }],
                                "ResourceId": agent.ResourceId,
                                "LoginTime": ids[0].LoginTime ? moment(ids[0].LoginTime).format("YYYY-MM-DD hh:mm:ss") : "N/A",
                                "ResourceName": agent.ResourceName,
                                "IncomingCallCount": ids[0].IncomingCallCount ? ids[0].IncomingCallCount : 0,
                                "OutgoingCallCount": ids[0].OutgoingCallCount ? ids[0].OutgoingCallCount : 0,
                                "OutboundAnswerCount": ids[0].OutboundAnswerCount ? ids[0].OutboundAnswerCount : 0,
                                "MissCallCount": ids[0].MissCallCount ? ids[0].MissCallCount : 0,
                                "Chatid": agent.ResourceId,
                                "AcwTime": ids[0].AcwTime,
                                "BreakTime": ids[0].BreakTime,
                                "HoldTime": ids[0].HoldTime,
                                "TransferCallCount": ids[0].TransferCallCount,
                                "OnCallTime": ((ids[0].OnCallTime ? ids[0].OnCallTime : 0) + (ids[0].OutboundCallTime ? ids[0].OutboundCallTime : 0)),
                                "IdleTime": ids[0].IdleTime,
                                "StaffedTime": ids[0].StaffedTime,
                                "slotState": {},
                                "RemoveProductivity": false
                            };
                            var resonseStatus = null, resonseAvailability = null, resourceMode = null;
                            var reservedDate = "";

                            if (agent.ConcurrencyInfo && agent.ConcurrencyInfo.length > 0) {

                                agent.ConcurrencyInfo.forEach(function (concurrency) {
                                    if (concurrency && concurrency.HandlingType === 'CALL' && concurrency.SlotInfo && concurrency.SlotInfo.length > 0) {

                                        // is user state Reason

                                        if (agent.Status.Reason && agent.Status.State) {
                                            resonseAvailability = agent.Status.State;
                                            resonseStatus = agent.Status.Reason;
                                            resourceMode = agent.Status.Mode;
                                        }


                                        if (concurrency.IsRejectCountExceeded) {
                                            resonseAvailability = "NotAvailable";
                                            resonseStatus = "Suspended";
                                        }

                                        agentProductivity.slotMode = resourceMode;


                                        if (concurrency.SlotInfo[0]) {

                                            reservedDate = concurrency.SlotInfo[0].StateChangeTime;
                                        }


                                        if (resonseAvailability == "NotAvailable" && (resonseStatus == "Reject Count Exceeded" || resonseStatus == "Suspended")) {
                                            agentProductivity.slotState = resonseStatus;
                                            agentProductivity.other = "Reject";
                                        } else if (resonseAvailability == "NotAvailable" && resonseStatus.toLowerCase().indexOf("break") > -1) {
                                            agentProductivity.slotState = resonseStatus;
                                            agentProductivity.other = "Break";
                                            reservedDate = agent.Status.StateChangeTime;
                                        } else {

                                            if (concurrency.SlotInfo[0]) {
                                                agentProductivity.slotState = concurrency.SlotInfo[0].State;
                                            }

                                        }

                                        agentProductivity.LastReservedTimeT = moment(reservedDate).format('DD/MM/YYYY HH:mm:ss');
                                        agentProductivity.slotStateTime = TimeFormatter(moment.utc(moment(moment(), "DD/MM/YYYY HH:mm:ss").diff(moment(reservedDate), 'seconds')));
                                        if (reservedDate == "") {
                                            agentProductivity.LastReservedTime = null;
                                        } else {
                                            agentProductivity.LastReservedTime = moment(reservedDate).format('DD/MM/YYYY HH:mm:ss')
                                            agentProductivity.slotStateTime = TimeFormatter(moment.utc(moment(moment(), "DD/MM/YYYY HH:mm:ss").diff(moment(reservedDate), 'seconds')));
                                        }


                                    }
                                });


                            } else {
                                resourceMode = agent.Status.Mode;
                                resonseAvailability = agent.Status.State;
                                resonseStatus = agent.Status.Reason;
                                agentProductivity.slotState = "Offline";
                                agentProductivity.slotMode = resourceMode;
                                agentProductivity.other = "Offline";
                                reservedDate = agent.Status.StateChangeTime;
                                agentProductivity.LastReservedTimeT = moment(reservedDate).format('DD/MM/YYYY HH:mm:ss');
                                agentProductivity.slotStateTime = TimeFormatter(moment.utc(moment(moment(), "DD/MM/YYYY HH:mm:ss").diff(moment(reservedDate), 'seconds')));

                                if (resonseAvailability == "NotAvailable" && resonseStatus.toLowerCase().indexOf("break") > -1) {
                                    agentProductivity.slotState = resonseStatus;
                                    agentProductivity.other = "Break";
                                }
                            }


                            /* Set Task Info*/
                            agentProductivity.taskList = [];
                            angular.forEach(agent.ResourceAttributeInfo, function (item) {
                                try {
                                    var task = {};
                                    task.taskType = item.HandlingType;
                                    task.percentage = item.Percentage;
                                    //$filter('filter')(array, expression, comparator, anyPropertyKey)
                                    //var filteredData =  $filter('filter')($scope.gridUserData.data,{ Id: userid },true);
                                    var data = $filter('filter')($scope.attributesList, {AttributeId: parseInt(item.Attribute)}, true);
                                    if (data.length > 0)
                                        task.skill = data[0].Attribute;
                                    agentProductivity.taskList.push(task);
                                }
                                catch (ex) {
                                    console.info(ex);
                                }
                            });
                            /* Set Task Info*/

                            /* Set ConcurrencyInfo */
                            var sessionIds = [];
                            angular.forEach(agent.ConcurrencyInfo, function (item) {
                                try {
                                    var slotInfo = $filter('filter')(item.SlotInfo, {State: "Connected"});
                                    if (slotInfo.length > 0) {
                                        var sid = slotInfo[0].HandlingRequest;
                                        sessionIds.push(sid);
                                    }
                                }
                                catch (ex) {
                                    console.info(ex);
                                }
                            });

                            /*Get Call info base on sid*/
                            agentProductivity.callInfos = [];
                            angular.forEach($scope.activeCalls, function (item) {
                                try {
                                    var inboundCalls = $filter('filter')(item, {'Call-Direction': "inbound"});
                                    angular.forEach(sessionIds, function (sid) {
                                        try {
                                            var callInfo = $filter('filter')(inboundCalls, {'Unique-ID': sid});
                                            if (callInfo.length > 0) {

                                                agentProductivity.callInfos.push(callInfo[0]);
                                                console.info(callInfo);
                                                $scope.showCallDetails = true;
                                            }
                                        } catch (ex) {
                                            console.info(ex);
                                        }
                                    })
                                }
                                catch (ex) {
                                    console.info(ex);
                                }
                            });

                            /* Set ConcurrencyInfo*/

                            agentProductivity.profileName = agent.ResourceName;
                            $scope.Productivitys.push(agentProductivity);
                            console.log($scope.Productivitys);

                        }

                    }

                } catch (ex) {
                    console.log(ex);
                    //$scope.isLoading = false;
                }

            });
            $scope.isLoading = false;
        }
        else {
            $scope.isLoading = false;
        }

    };
    $scope.GetProductivity = function () {
        var momentTz = moment.parseZone(new Date()).format('Z');
        momentTz = momentTz.replace("+", "%2B");

        var currentDate = moment().format("YYYY-MM-DD");
        var queryStartDate = currentDate + ' 00:00:00' + momentTz;
        var queryEndDate = currentDate + ' 23:59:59' + momentTz;

        agentStatusService.GetProductivityWithLoginTime(queryStartDate, queryEndDate).then(function (response) {
            $scope.productivity = response;
            $scope.isLoading = true;
            calculateProductivity();
        }, function (error) {
            $log.debug("productivity err");
            $scope.showAlert("Error", "error", "Fail To Get productivity.");
            $scope.isLoading = false;
        });
    };
    $scope.loadAllAgents = function () {
            angular.copy($scope.availableProfile, $scope.profile);
    }
    $scope.GetProductivity();
    $scope.loadAllAgents();
    $scope.showCallDetails = false;


    $scope.getTableHeight = function() {
        var rowHeight = 30; // your row height
        var headerHeight = 50; // your header height
        return {
            height: (($scope.gridOptions.data.length+2) * rowHeight + headerHeight) + "px"
        };
    };


    $scope.gridOptions = {
        enableColumnResizing: true,
        enableGridMenu: true,
        enableSorting: true,
        columnDefs: [],
        data: 'Productivitys',

        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;

            // call resize every 500 ms for 5 s after modal finishes opening - usually only necessary on a bootstrap modal
            $interval(function () {
                $scope.gridApi.core.handleWindowResize();
            }, 500, 10);


        }
    };


    $scope.gridOptions.columnDefs = [
        {
            name: 'taskList',
            displayName: 'Task',
            $$treeLevel: 1,
            width: 100,
            // cellTemplate: 'template/taskListTemplate.html'
            cellTemplate: 'agent_status/view/template/taskListTemplate.html'
        },
        {
            name: 'profileName',
            displayName: 'Name',
            width: 100,
            pinnedLeft: true,
            sort: {direction: 'asc', priority: 0}
        },
        {
            name: 'LoginTime',
            displayName: 'Login Time',
            cellClass: 'table-time',
            width: 100

        },
        {
            name: 'slotState',
            displayName: 'State',
            width: 200
        },
        {
            name: 'slotStateTime',
            displayName: 'Slot State Time',
            cellClass: 'table-number',
            width: 100
        },
        {
            name: 'AcwTime',
            displayName: 'ACW Time',
            width: 100,
            cellClass: 'table-time',
            cellTemplate: "<div>{{row.entity.AcwTime|secondsToDateTime| date:'HH:mm:ss'}}</div>"
        },
        {
            name: 'BreakTime',
            displayName: 'Break Time',
            width: 100,
            cellClass: 'table-time',
            cellTemplate: "<div>{{row.entity.BreakTime |secondsToDateTime | date:'HH:mm:ss'}}</div>"
        },
        {
            name: 'HoldTime',
            displayName: 'Hold Time',
            width: 100,
            cellClass: 'table-time',
            cellTemplate: "<div>{{row.entity.HoldTime |secondsToDateTime | date:'HH:mm:ss'}}</div>"
        },
        {
            name: 'OnCallTime',
            displayName: 'OnCall Time',
            width: 100,
            cellClass: 'table-time',
            cellTemplate: "<div>{{row.entity.OnCallTime |secondsToDateTime | date:'HH:mm:ss'}}</div>"
        },
        {
            name: 'IdleTime',
            displayName: 'Idle Time',
            width: 100,
            cellClass: 'table-time',
            cellTemplate: "<div>{{row.entity.IdleTime |secondsToDateTime | date:'HH:mm:ss'}}</div>"
        },
        {
            name: 'StaffedTime',
            displayName: 'Staffed Time',
            width: 100,
            cellClass: 'table-time',
            cellTemplate: "<div>{{row.entity.StaffedTime |secondsToDateTime | date:'HH:mm:ss'}}</div>"
        },
        {
            name: 'IncomingCallCount',
            displayName: 'Answered Call Count',
            width: 100,
            cellClass: 'table-number'
        },
        {
            name: 'OutgoingCallCount',
            displayName: 'Outgoing Call Count',
            width: 100,
            cellClass: 'table-number'
        },
        {
            name: 'MissCallCount',
            displayName: 'Missed Call Count',
            width: 100,
            cellClass: 'table-number'
        },
        {
            name: 'OutboundAnswerCount',
            displayName: 'Outgoing Answered Count',
            width: 100,
            cellClass: 'table-number'
        }

    ];

    $scope.cumulative = function (grid, myRow) {
        var skill = '';
        grid.renderContainers.body.visibleRowCache.forEach(function (row, index) {
            if (row.entity && row.entity.taskList && row.entity.taskList.length != 0) {
                row.entity.taskList.forEach(function (value, i) {
                    if (i == 0) {
                        skill += row.entity.taskList[i].skill + " " + row.entity.taskList[i].percentage + "%";
                    } else {
                        skill += " , " + row.entity.taskList[i].skill + " " + row.entity.taskList[i].percentage + "%";
                    }
                });
            }
        });
        return skill;
    };

    var TimeFormatter = function (seconds) {

        var timeStr = '00:00:00';
        if (seconds > 0) {
            var durationObj = moment.duration(seconds * 1000);

            if (durationObj) {
                var tempDays = 0;
                if (durationObj._data.years > 0) {
                    tempDays = tempDays + durationObj._data.years * 365;
                }
                if (durationObj._data.months > 0) {
                    tempDays = tempDays + durationObj._data.months * 30;
                }
                if (durationObj._data.days > 0) {
                    tempDays = tempDays + durationObj._data.days;
                }

                if (tempDays > 0) {

                    timeStr = tempDays + 'd ' + ("00" + durationObj._data.hours).slice(-2) + ':' + ("00" + durationObj._data.minutes).slice(-2) + ':' + ("00" + durationObj._data.seconds).slice(-2);
                } else {

                    timeStr = ("00" + durationObj._data.hours).slice(-2) + ':' + ("00" + durationObj._data.minutes).slice(-2) + ':' + ("00" + durationObj._data.seconds).slice(-2);
                    //(durationObj._data.hours<=9)?('0'+durationObj._data.hours):durationObj._data.hours + ':' + (durationObj._data.minutes<=9)?('0'+durationObj._data.minutes):durationObj._data.minutes  + ':' + (durationObj._data.seconds<=9)?('0'+durationObj._data.seconds):durationObj._data.seconds;
                }
            }
        }
        return timeStr;
    };







    $scope.onSelectionChanged = function () {

        if($scope.filterType=="ALL" || $scope.profile.length == 0)
        {
            $scope.loadAllAgents();
        }

    };
    /*--------------------------- Filter ------------------------------------------*/
    $scope.SaveReportQueryFilter = function () {
        var data = {
            agentMode: $scope.agentMode,
            profile: $scope.profile,
            filterType:$scope.filterType
        };
        reportQueryFilterService.SaveReportQueryFilter("AgentStatus", data);
    };

    $scope.GetReportQueryFilter = function () {
        reportQueryFilterService.GetReportQueryFilter("AgentStatus").then(function (response) {
            if (response) {
                $scope.agentMode = response.agentMode;
                $scope.profile = response.profile;
                $scope.filterType=response.filterType;
                if(!$scope.filterType)
                {
                    $scope.filterType="ALL";
                }

            }
        }, function (error) {
            console.log(error);
        });

    };
    $scope.GetReportQueryFilter();

    /*--------------------------- Filter ------------------------------------------*/

    $scope.activeCalls = [];

    $scope.GetAllActiveCalls = function () {
        agentStatusService.GetAllActiveCalls().then(function (response) {
            $scope.activeCalls = response;

        }, function (error) {
            $log.debug("getAllActiveCalls err");
            $scope.showAlert("Error", "error", "Fail To Get Active Call List.");
        });
    };
    $scope.GetAllActiveCalls();

    $scope.attributesList = [];
    $scope.GetAllAttributes = function () {
        agentStatusService.GetAllAttributes().then(function (response) {
            $scope.attributesList = response;
            $scope.getProfileDetails();
        }, function (error) {
            $log.debug("GetAllAttributes err");
            $scope.showAlert("Error", "error", "Fail To Get Attribute List.");
        });
    };
    $scope.GetAllAttributes();

    $scope.profile = [];
    $scope.onlineProfile = [];
    $scope.availableProfile = [];

    $scope.getProfileDetails = function () {
        agentStatusService.GetProfileDetails().then(function (response) {

            if (response) {
                /*$scope.onlineProfile = response.map(function (item) {
                 return {
                 ResourceName:item.ResourceName,
                 ResourceId:item.ResourceId
                 }
                 });*/

                $scope.onlineProfile = response;
                /*if ($scope.profile.length == 0) {
                 angular.copy($scope.availableProfile, $scope.profile);
                 }*/
            }

        });
    };

    $scope.GetAvailableProfile = function () {
        agentStatusService.GetAvailableProfile().then(function (response) {

            if (response) {
                $scope.availableProfile = response.map(function (item) {
                    return {
                        ResourceName: item.ResourceName,
                        ResourceId: item.ResourceId
                    }
                });
            }

        });
    };
    $scope.GetAvailableProfile();

    var getAllRealTime = function () {
        $scope.getProfileDetails();
        $scope.GetAllActiveCalls();
        $scope.GetProductivity();
        getAllRealTimeTimer = $timeout(getAllRealTime, $scope.refreshTime);
    };

    //getAllRealTime();
    var getAllRealTimeTimer = $timeout(getAllRealTime, 500);


    $scope.$on("$destroy", function () {
        if (getAllRealTimeTimer) {
            $timeout.cancel(getAllRealTimeTimer);
        }
    });

    $scope.refreshTime = 10000;

    /*$scope.showAlert = function (tittle, label, button, content) {
     new PNotify({
     title: tittle,
     text: content,
     type: 'success',
     styling: 'bootstrap3'
     });
     };*/

    $scope.showAlert = function (tittle, type, content) {
        new PNotify({
            title: tittle,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };

    $scope.safeApply = function (fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    //update damith
    $scope.viewScroll = function () {
        $scope.safeApply(function () {
            $scope.scrollEnabled = true;
        });

    };
    $scope.hideScroll = function () {
        $scope.safeApply(function () {
            $scope.scrollEnabled = false;
        });
    };

    //GetUserProfileList
    notifiSenderService.getUserList().then(function (response) {
        $scope.userList = response;
    }, function (error) {
        $log.debug("get user list error.....");
    });

    $scope.querySearch = function (query) {
        if (query === "*" || query === "") {
            if ($scope.availableProfile) {
                return $scope.availableProfile;
            }
            else {
                return [];
            }

        }
        else {
            if ($scope.availableProfile) {
                var filteredArr = $scope.availableProfile.filter(function (item) {
                    var regEx = "^(" + query + ")";

                    if (item.ResourceName) {
                        return item.ResourceName.match(regEx);
                    }
                    else {
                        return false;
                    }

                });

                return filteredArr;
            }
            else {
                return [];
            }
        }

    };

    $scope.agentMode = [];
    $scope.availableAgentMode = [{"Name": "Inbound"}, {"Name": "Outbound"}, {"Name": "Offline"}];
    angular.copy($scope.availableAgentMode, $scope.agentMode);
    $scope.agentModeQuerySearch = function (query) {
        if (query === "*" || query === "") {
            if ($scope.availableAgentMode) {
                return $scope.availableAgentMode;
            }
            else {
                return [];
            }

        }
        else {
            if ($scope.availableAgentMode) {
                var filteredArr = $scope.availableAgentMode.filter(function (item) {
                    var regEx = "^(" + query + ")";

                    if (item.Name) {
                        return item.Name.match(regEx);
                    }
                    else {
                        return false;
                    }

                });

                return filteredArr;
            }
            else {
                return [];
            }
        }

    };

    $scope.ResourceAdded = function (tag) {
        $scope.isLoading = true;
        //getAllRealTime();

        $scope.SaveReportQueryFilter();
    };

    $scope.ResourceRemoved = function (tag) {
        $scope.isLoading = true;
        //getAllRealTime();
        var index = $scope.profile.indexOf(tag);
        if (index > -1) {
            $scope.profile.splice(index, 1);
        }
        $scope.filterType="USER";
        $scope.SaveReportQueryFilter();
    };

    $scope.AgentModeRemoved = function (tag) {
        $scope.isLoading = true;
        var index = $scope.agentMode.indexOf(tag);
        if (index > -1) {
            $scope.agentMode.splice(index, 1);
        }
        $scope.SaveReportQueryFilter();
    };


    $scope.AgentModeAdded = function (tag) {
        $scope.isLoading = true;
        //getAllRealTime();
        $scope.SaveReportQueryFilter();
    };

    $scope.LoadProductivity = function () {
        $scope.isLoading = true;
        $scope.GetProductivity();
        $scope.SaveReportQueryFilter();

    };


    // $(window).scroll(function (e) {
    //
    //     var windowPosition = this.pageYOffset;
    //     if ($scope.showFilter) {
    //         //filter is enable
    //
    //     } else {
    //         if (windowPosition >= 208) {
    //             console.log('fixed menu');
    //             $('#agentStatusTblHeader').addClass('fixed-table-header');
    //         } else {
    //             console.log('remove fixed menu');
    //             $('#agentStatusTblHeader').removeClass('fixed-table-header');
    //         }
    //     }
    //
    //     console.log($scope.showFilter);
    // });

});


