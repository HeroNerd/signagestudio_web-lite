/**
 Settings Backbone > View
 @class FQLinePropView
 @constructor
 @return {Object} instantiated FQLinePropView
 **/
define(['jquery', 'backbone'], function ($, Backbone) {

    var FQLinePropView = Backbone.View.extend({

        /**
         Constructor
         @method initialize
         **/
        initialize: function () {
            var self = this;
            self.m_selectedLineID = undefined;
            self.m_property = BB.comBroker.getService(BB.SERVICES['PROPERTIES_VIEW']);
            self.m_property.initPanel('#' + self.el.id);
            self._listenOpenCustomerTerminal();
            self._listenInputNameChange();
        },

        /**
         Listen to open customer terminal
         @method _listenOpenCustomerTerminal
         **/
        _listenOpenCustomerTerminal: function () {
            var self = this;
            $(Elements.OPEN_FASTERQ_CUSTOMER_TERMINAL).on('click', function (e) {
                var data = {
                    call_type: 'CUSTOMER_TERMINAL',
                    business_id: BB.Pepper.getUserData().businessID,
                    line_id: self.m_selectedLineID,
                    line_name: self.collection.get(self.m_selectedLineID).get('name')
                };
                data = $.base64.encode(JSON.stringify(data));
                var url = BB.CONSTS.BASE_URL + '?mode=customerTerminal&param=' + data;
                window.open(url, '_blank');
            });
        },

        /**
         Listen to changes in Line item rename through properties
         @method _listenInputNameChange server:updateLine
         @return none
         **/
        _listenInputNameChange: function () {
            var self = this;
            var onChange = _.debounce(function (e) {
                var text = $(e.target).val();

                if (_.isUndefined(self.m_selectedLineID))
                    return;
                var model = self.collection.get(self.m_selectedLineID);
                model.set('name', text);
                model.save({}, {
                    success: function (model, response) {
                        // self._populateLines();
                        // log('model updated');
                    }, error: function () {
                        log('error delete failed');
                    }
                });

            }, 400);
            self.m_inputChangeHandler = $(Elements.SELECTED_LINE_NAME).on("input", onChange);
        },

        lineSelected: function(i_lineID) {
            var self = this;
            self.m_selectedLineID = i_lineID;
            self.m_property.viewPanel(Elements.FASTERQ_LINE_PROPERTIES);
            $(Elements.SELECTED_LINE_NAME).val(self.collection.get(self.m_selectedLineID).get('name'));
        }
    });

    return FQLinePropView;
});

