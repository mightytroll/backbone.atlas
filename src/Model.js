import _ from "underscore";
import Backbone from "backbone";

export const Model = Backbone.Model.extend({
    baseUrl: null,
    urlRoot: null,
    headers: {},

    parent: null,
    parentUrlRoot: null,

    filters: {},

    parsers: {},

    /**
     * Override the default `initialize` to support nested models by default.
     * If overriding this method, make sure you always call BaseModel.prototype.initialize.apply(this, options) first.
     *
     * @param {object} attributes
     * @param {object} [options={}]
     */
    initialize(attributes, options = {}) {
        _.defaults(options, {
            baseUrl: null,
            urlRoot: null,
            headers: {},
            parent: _.result(options.collection, "parent", null),
            filters: {}
        });

        this.baseUrl = options.baseUrl || this.baseUrl;
        this.urlRoot = options.urlRoot || this.urlRoot;
        this.headers = _.clone(this.headers);
        _.assign(this.headers, options.headers);
        this.parent = options.parent;
        this.filters = _.clone(this.filters);
        _.assign(this.filters, options.filters);
    },

    /**
     * Override the default `url` method so that nested urls can be constructed.
     *
     * @param {(string|null)} [urlRoot=null]
     * @returns {string}
     */
    url(urlRoot = null) {
        let parentUrl = this.parent ? this.parent.url(this.parentUrlRoot) : "";

        let url;
        if (urlRoot) {
            if (this.isNew()) {
                url = urlRoot;
            } else {
                let id = this.get(this.idAttribute);
                // eslint-disable-next-line no-useless-escape
                url = urlRoot.replace(/[^\/]$/, "$&/") + encodeURIComponent(id);
            }
        } else {
            url = Backbone.Model.prototype.url.apply(this);
        }

        return parentUrl + url;
    },

    sync(method, model, options) {
        let beforeSend = options.beforeSend;
        options.beforeSend = (jqXHR, settings) => {
            settings.url = (this.baseUrl ? this.baseUrl : "") + settings.url;
            settings.crossDomain = true;

            _.each(this.headers, (value, header) => {
                jqXHR.setRequestHeader(header, value);
            });

            if (beforeSend) {
                return beforeSend.call(this, jqXHR, settings);
            }

            return null;
        };

        return Backbone.Model.prototype.sync.call(this, method, model, options);
    },

    fetch(options = {}) {
        _.defaults(options, {
            data: {}
        });
        _.extend(options.data, this.filters);

        return Backbone.Model.prototype.fetch.call(this, options);
    },

    /**
     * Parse response from server and convert it into models and collections in a declarative way.
     *
     * @param {Object} response
     * @param {Object} options
     * @return {Object}
     */
    parse(response, options) {
        const parse = (result, parser, attribute) => {
            if (_.isUndefined(response[attribute])) {
                return result;
            }

            if (!_.isFunction(parser)) {
                throw new Error('Type for field "' + attribute + '" cannot be instantiated!');
            }

            if (parser.extend === Model.extend) {
                result[attribute] = new parser(response[attribute], { ...options, parent: this });
            } else {
                result[attribute] = parser.call(this, response[attribute]);
            }

            return result;
        };

        return _.assign({}, response, _.reduce(this.parsers, parse, {}));
    }
});
