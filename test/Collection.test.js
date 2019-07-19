import { Collection } from "../src/Collection";
import { Model } from "../src/Model";

describe("Collection", () => {
    describe("initialize()", () => {
        describe("parent", () => {
            it("should be null by default", () => {
                let collection = new Collection();

                expect(collection.parent).toBeNull();
            });

            it("should be the same as options.parent", () => {
                let parent = new Model();
                let child = new Collection(null, { parent });

                expect(child.parent).toBe(parent);
            });
        });

        describe("filters", () => {
            it("should be {} by default", () => {
                let collection = new Collection();

                expect(collection.filters).toEqual({});
            });

            it("should be the same as options.filters", () => {
                let collection = new Collection(null, {
                    filters: { f: 1 }
                });

                expect(collection.filters).toEqual({ f: 1 });
            });

            describe("in extended model", () => {
                const ExtendedCollection = Collection.extend({
                    filters: { f: 1 }
                });

                it("should default to protoProps.filters", () => {
                    let collection = new ExtendedCollection();

                    expect(collection.filters).toEqual({ f: 1 });
                });

                it("options.filters should extend default values", () => {
                    let collection = new ExtendedCollection(null, { filters: { g: 2 } });

                    expect(collection.filters).toEqual({ f: 1, g: 2 });
                });

                it("options.filters should override default values", () => {
                    let collection = new ExtendedCollection(null, { filters: { f: 2 } });

                    expect(collection.filters).toEqual({ f: 2 });
                });

                it("options.filters should not alter prototype defaults", () => {
                    new ExtendedCollection(null, { filters: { f: 2 } });

                    expect(ExtendedCollection.prototype.filters).toEqual({ f: 1 });
                });
            });
        });
    });

    describe("url()", () => {
        const TestModel = Model.extend({
            urlRoot: "/testModel"
        });

        const TestCollection = Collection.extend({
            model: TestModel
        });

        it("should return urlRoot of the model", () => {
            let testCollection = new TestCollection();

            expect(testCollection.url()).toBe("/testModel");
        });

        describe("in nested collection", () => {
            const ParentModel = Model.extend({
                urlRoot: "/parentModel"
            });

            it("should return url nested under parent", () => {
                let parent = new ParentModel({ id: 1 });
                let child = new TestCollection({}, { parent });

                expect(child.url()).toBe("/parentModel/1/testModel");
            });
        });
    });

    describe("fetch()", () => {
        const TestModel = Model.extend({
            urlRoot: "/testModel"
        });

        const TestCollection = Collection.extend({
            model: TestModel
        });

        it("should include filters", () => {
            let testCollection = new TestCollection(null, { filters: { f: 1 }});
            testCollection.fetch({
                beforeSend: (jqXHR, settings) => {
                    expect(settings.url).toBe("/testModel?f=1");
                    return false;
                }
            });
        });
    });

    describe("sync()", () => {
        const TestModel = Model.extend({
            baseUrl: "http://localhost",
            urlRoot: "/testModel",
            headers: { customHeader: "a" }
        });

        const TestCollection = Collection.extend({
            model: TestModel
        });

        it("should prepend baseUrl", () => {
            let testCollection = new TestCollection();
            testCollection.fetch({
                beforeSend: (jqXHR, settings) => {
                    expect(settings.url).toBe("http://localhost/testModel");
                    return false;
                }
            });
        });
    });

    describe("model()", () => {
        const BaseModel = Model.extend({
            baseUrl: "http://localhost",
            urlRoot: "/base-model"
        });

        const ExtendedModel = BaseModel.extend({
            urlRoot: "/extended-model"
        });

        const TestCollection = Collection.extend({
            baseModel: BaseModel,

            model(attributes, options) {
                switch (attributes.type) {
                    case "base":
                        return new BaseModel(attributes, options);

                    case "extended":
                        return new ExtendedModel(attributes, options);

                    default:
                        return new this.baseModel(attributes, options);
                }
            }
        });

        it("should support polymorphic models", () => {
            let testCollection = new TestCollection([{
                type: "base",
                id: "a"
            }, {
                type: "extended",
                id: "b"
            }]);

            expect(testCollection.url()).toBe("/base-model");

            expect(testCollection.get("a")).toBeInstanceOf(BaseModel);
            expect(testCollection.get("b")).toBeInstanceOf(ExtendedModel);
        });
    });
});
