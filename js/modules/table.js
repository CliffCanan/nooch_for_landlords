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