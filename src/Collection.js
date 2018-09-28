import _ from "underscore";
import Backbone from "backbone";

export const Collection = Backbone.Collection.extend({
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
        const base = this.parent ? this.parent.url() : "";
        const urlRoot = this.urlRoot ? this.urlRoot : this.model.prototype.urlRoot;

        return base + urlRoot;
    },

    sync(method, model, options) {
        let beforeSend = options.beforeSend;
        options.beforeSend = (jqXHR, settings) => {
            settings.url = (this.model.prototype.baseUrl ? this.model.prototype.baseUrl : "") + settings.url;
            settings.crossDomain = true;

            _.each(this.model.prototype.headers, (value, header) => {
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
