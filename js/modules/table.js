noochForLandlords

    // =========================================================================
    // Bootgrid Data Table
    // =========================================================================

    // Basic (default example, came with theme)
    .directive('bootgridBasic', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                element.bootgrid({
                    css: {
                        icon: 'md icon',
                        iconColumns: 'md-view-module',
                        iconDown: 'md-expand-more',
                        iconRefresh: 'md-refresh',
                        iconUp: 'md-expand-less'
                    }
                });
            }
        }
    })

    // Selection (default example, came with theme)
    .directive('bootgridSelection', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                element.bootgrid({
                    css: {
                        icon: 'md icon',
                        iconColumns: 'md-view-module',
                        iconDown: 'md-expand-more',
                        iconRefresh: 'md-refresh',
                        iconUp: 'md-expand-less'
                    },
                    selection: true,
                    multiSelect: true,
                    rowSelect: true,
                    keepSelection: true
                });
            }
        }
    })


    // FOR HISTORY TABLE
    .directive('bootgridHistoryTable', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                element.bootgrid({
                    css: {
                        icon: 'md icon',
                        iconColumns: 'md-view-module',
                        iconDown: 'md-expand-more',
                        iconRefresh: 'md-refresh',
                        iconUp: 'md-expand-less'
                    },
                    formatters: {
                        "commands": function(column, row) {
                            return "<button type=\"button\" class=\"btn btn-icon btn-default command-edit m-r-10\" data-row-id=\"" + row.id + "\"><span class=\"md md-edit\"></span></button> ";
                        },
                        "status": function (column, row) {
                            if (row.status == "Paid" || row.status == "paid" || row.status == "completed") {
                                return "<span class=\"label label-success\">" + row.status + "</span>";
                            }
                            else if (row.status == "Pending" || row.status == "pending") {
                                return "<span class=\"label label-warning\">" + row.status + "</span>";
                            }
                            else if (row.status == "Rejected" || row.status == "rejected") {
                                return "<span class=\"label label-danger\">" + row.status + "</span>";
                            }
                            else {
                                return "<span class=\"label label-warning\">" + row.status + "</span>";
                            }
                        },
                        "user": function (column, row) {
                            return "<div class=\"media\"><div class=\"pull-left\"><img class=\"tableUserPic\" src=\"img/contacts/" + row.id + ".jpg\"></div><div class=\"media-body\"><div class=\"lv-title\">" + row.tenant + "</div><small class=\"lv-small\">" + row.email + "</small></div></div>";
                        }
                    },
                    columnSelection: false,
                    caseSensitive: false,
                    searchSettings: { characters: 3 },
                    labels: {
                        noResults: "where are my results"
                    }
                });
            }
        }
    })


    // FOR TENANT REQUESTS TABLE
    .directive('tenantRequests', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.bootgrid({
                    css: {
                        icon: 'md icon',
                        iconColumns: 'md-view-module',
                        iconDown: 'md-expand-more',
                        iconRefresh: 'md-refresh',
                        iconUp: 'md-expand-less'
                    },
                    formatters: {
                        "actions": function (column, row) {
                            if (row.status == "Pending" || row.status == "pending") {
                                return "<button data-target=\"#test123\" data-toggle=\"modal\" type=\"button\" class=\"btn btn-icon btn-default m-r-15\" data-row-id=\"" + row.id + "\" title=\"Approve\"><span class=\"md md-check c-green\"></span></button> " +
                                       "<button type=\"button\" class=\"btn btn-icon btn-default\" data-row-id=\"" + row.id + "\"><span class=\"md md-close c-red\"></span></button>";
                            }
                            else if (row.status == "Approved" || row.status == "approved") {
                                return "<button type=\"button\" class=\"btn btn-icon btn-default m-r-15\" data-row-id=\"" + row.id + "\"><span class=\"md md-verified-user c-blue\"></span></button> " +
                                       "<button type=\"button\" class=\"btn btn-icon btn-default\" data-row-id=\"" + row.id + "\"><span class=\"md md-mail\"></span></button>";
                            }
                            else if (row.status == "Rejected" || row.status == "rejected") {
                                return "<button type=\"button\" class=\"btn btn-icon btn-default m-r-15\" data-row-id=\"" + row.id + "\"><span class=\"md md-undo c-orange\"></span></button> " +
                                       "<button type=\"button\" class=\"btn btn-icon btn-default\" data-row-id=\"" + row.id + "\"><span class=\"md md-report c-red\"></span></button>";
                            }
                        },
                        "dateColumn": function (column, row) {
                            return "<span>" + row.dateSubmitted + "</span>";
                        },
                        "status": function (column, row) {
                            if (row.status == "Pending" || row.status == "pending") {
                                return "<span class=\"label label-warning\">" + row.status + "</span>";
                            }
                            else if (row.status == "Approved" || row.status == "approved") {
                                return "<span class=\"label label-success\">" + row.status + "</span>";
                            }
                            else if (row.status == "Rejected" || row.status == "rejected") {
                                return "<span class=\"label label-danger\">" + row.status + "</span>";
                            }
                            else {
                                return "<span class=\"label label-default\">" + row.status + "</span>";
                            }
                        },
                        "user": function (column, row) {
                            return "<div class=\"media\"><div class=\"pull-left\"><img class=\"tableUserPic\" src=\"img/profile-pics/" + row.id + ".jpg\"></div><div class=\"media-body\"><div class=\"lv-title\">" + row.user + "</div><small class=\"lv-small\">" + row.email + "</small></div></div>";
                        },
                    },
                    columnSelection: false,
                    caseSensitive: false,
                    headerAlign: "center",
                    searchSettings: { characters: 2 },
                    labels: {
                        infos: "Showing {{ctx.start}} to {{ctx.end}} of {{ctx.total}} Tenant Requests",
                        noResults: "No users found for that name"
                    }
                });
            }
        }
    })


    // FOR PROPERTY DETAILS TABLE
    .directive('bootgridPropDetailsTable', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.bootgrid({
                    css: {
                        icon: 'md-tableHdr',
                        iconColumns: 'md-view-module',
                        iconDown: 'md-expand-more',
                        iconRefresh: 'md-refresh',
                        iconUp: 'md-expand-less'
                    },
                    formatters: {
                        "unit": function (column, row) {
                            return "<span class=\"f-600 f-22 c-darkblue unitInTable\">" + row.unit + "</span>";
                        },
                        "tenant": function (column, row) {
                            var emailStatus = "c-gray";
                            var phoneStatus = "c-gray";
                            var idStatus = "c-gray";
                            var bankStatus = "c-gray";

                            if (row.isEmailVer == "1") { emailStatus = "c-blue"; }
                            if (row.isPhoneVer == "1") { phoneStatus = "c-blue"; }
                            if (row.isIdVerified == "1") { idStatus = "c-blue"; }
                            if (row.isBankAttached == "1") { bankStatus = "c-blue"; }

                            return "<div class=\"media\"><div class=\"pull-left\">" +
                                   "<img class=\"tableUserPic m-r-5\" src=\"img/contacts/" + row.id + ".jpg\"></div>" +
                                   "<div class=\"media-body\"><div class=\"lv-title f-15 f-500\">" + row.tenant + "</div>" +
                                   "<small class=\"lv-small f-12\">" + row.email + "</small>" +
                                   "<div class=\"icons\"><i class=\"md md-verified-user " + idStatus + "\"></i><i class=\"md md-email " + emailStatus + "\"></i><i class=\"md md-phone-iphone " + phoneStatus + "\"></i><i class=\"md md-account-balance " + bankStatus + "\"></i></div></div></div>";
                        },
                        "status": function (column, row) {
                            var lastDateText = "<br/><span class=\"lastPaymentDate\">(Last: " + row.lastPaymentDate + ")</span>";

                            if (row.status == "Paid" || row.status == "paid" || row.status == "completed") {
                                return "<span class=\"label label-success\">" + row.status + "</span>" + lastDateText;
                            }
                            else if (row.status.toLowerCase == "pending") {
                                return "<span class=\"label label-warning\">" + row.status + "</span>" + lastDateText;
                            }
                            else if (row.status.toLowerCase() == "past due") {
                                return "<span class=\"label label-danger\">" + row.status + "</span>" + lastDateText;
                            }
                            else {
                                return "<span class=\"label label-warning\">" + row.status + "</span>" + lastDateText;
                            }
                        },
                        "amount": function (column, row) {
                            return "<div class=\"f-500 f-15 text-center\">$ " + row.amount + "</div>";
                        },
                        "actions": function (column, row) {
                            return "<button type=\"button\" class=\"btn btn-icon btn-default command-edit m-r-10\" data-row-id=\"" + row.id + "-1\"><span class=\"md md-edit\"></span></button> " +
                                   "<button type=\"button\" class=\"btn btn-icon btn-default command-edit m-r-10\" data-row-id=\"" + row.id + "-2\"><span class=\"md md-today\"></span></button> " +
                                   "<button type=\"button\" class=\"btn btn-icon btn-default command-edit m-r-10\" data-row-id=\"" + row.id + "-3\"><span class=\"md md-more-vert\"></span></button> ";
                        },
                    },
                    columnSelection: false,
                    caseSensitive: false,
                    searchSettings: { characters: 3 },
                    labels: {
                        noResults: "No units or tenants match that search, unfortunately."
                    }
                });
            }
        }
    })