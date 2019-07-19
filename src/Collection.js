import _ from "underscore";
import Backbone from "backbone";

export const Collection = Backbone.Collection.extend({
    baseModel: null,
    model: null,

    parent: null,

    filters: {},

    /**
     * Override the default `initialize` to support nested models by default.
     * If overriding this method, make sure you always call BaseModel.prototype.initialize.apply(this, options) first.
     *
     * @param models
     * @param options
     */
    initialize(models = null, options = {}) {
        this.parent = options.parent || null;
        this.filters = _.assign(_.clone(this.filters), options.filters);
    },

    /**
     * Override default `url` method so that url can be derived from associated model.
     *
     * @returns {string}
     */
    url() {
        let modelClass = this.baseModel || this.model;

        const base = this.parent ? this.parent.url() : "";
        const urlRoot = this.urlRoot ? this.urlRoot : modelClass.prototype.urlRoot;

        return base + urlRoot;
    },

    sync(method, model, options) {
        let modelClass = this.baseModel || this.model;
        let beforeSend = options.beforeSend;
        options.beforeSend = (jqXHR, settings) => {
            settings.url = (modelClass.prototype.baseUrl ? modelClass.prototype.baseUrl : "") + settings.url;
            settings.crossDomain = true;

            _.each(modelClass.prototype.headers, (value, header) => {
                jqXHR.setRequestHeader(header, value);
            });

            if (beforeSend) {
                return beforeSend.call(this, jqXHR, settings);
            }

            return null;
        };

        return Backbone.Collection.prototype.sync.call(this, method, model, options);
    },

    fetch(options = {}) {
        _.defaults(options, { data: {} });
        _.extend(options.data, this.filters);

        return Backbone.Collection.prototype.fetch.apply(this, [options]);
    }
});
