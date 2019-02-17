import { Model } from "../src/Model";

describe("Model", () => {
    describe("constructor()", () => {
        describe("headers", () => {
            it("should not alter headers in base class", () => {
                const ExtendedModel = Model.extend({
                    headers: { x: "x" }
                });

                expect(Model.prototype.headers).toEqual({});
                expect(ExtendedModel.prototype.headers).toEqual({ x: "x" });
            });
        });
    });

    describe("initialize()", () => {
        describe("parent", () => {
            it("should be null by default", () => {
                let model = new Model();

                expect(model.parent).toBeNull();
            });

            it("should be the same as options.parent", () => {
                let parent = new Model();
                let child = new Model(null, { parent });

                expect(child.parent).toBe(parent);
            });
        });

        describe("filters", () => {
            it("should be {} by default", () => {
                let model = new Model();

                expect(model.filters).toEqual({});
            });

            it("should be the same as options.filters", () => {
                let model = new Model(null, {
                    filters: { f: 1 }
                });

                expect(model.filters).toEqual({ f: 1 });
            });

            describe("in extended model", () => {
                const ExtendedModel = Model.extend({
                    filters: { f: 1 }
                });

                it("should default to protoProps.filters", () => {
                    let model = new ExtendedModel();

                    expect(model.filters).toEqual({ f: 1 });
                });

                it("options.filters should extend default values", () => {
                    let model = new ExtendedModel(null, { filters: { g: 2 } });

                    expect(model.filters).toEqual({ f: 1, g: 2 });
                });

                it("options.filters should override default values", () => {
                    let model = new ExtendedModel(null, { filters: { f: 2 } });

                    expect(model.filters).toEqual({ f: 2 });
                });

                it("options.filters should not alter prototype defaults", () => {
                    new ExtendedModel(null, { filters: { f: 2 } });

                    expect(ExtendedModel.prototype.filters).toEqual({ f: 1 });
                });
            });
        });
    });

    describe("url()", () => {
        const TestModel = Model.extend({
            urlRoot: "/testModel"
        });

        it("should return urlRoot when model does not have id", () => {
            let testModel = new TestModel();

            expect(testModel.url()).toBe("/testModel");
        });

        it("should return urlRoot/id when model has id", () => {
            let testModel = new TestModel({ id: 1 });

            expect(testModel.url()).toBe("/testModel/1");
        });

        describe("in nested model", () => {
            const NestedModel = Model.extend({
                urlRoot: "/nestedModel"
            });

            it("should return url nested under parent", () => {
                let parent = new TestModel({ id: 1 });
                let child = new NestedModel({}, { parent });

                expect(child.url()).toBe("/testModel/1/nestedModel");
            });

            it("should return nested url when has id", () => {
                let parent = new TestModel({ id: 1 });
                let child = new NestedModel({ id: 2 }, { parent });

                expect(child.url()).toBe("/testModel/1/nestedModel/2");
            });
        });
    });

    describe("fetch()", () => {
        const TestModel = Model.extend({
            urlRoot: "/testModel"
        });

        it("should include filters", () => {
            let testModel = new TestModel({ id: 1 }, { filters: { f: 1 }});
            testModel.fetch({
                beforeSend: (jqXHR, settings) => {
                    expect(settings.url).toBe("/testModel/1?f=1");
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

        it("should prepend baseUrl", () => {
            let testModel = new TestModel({ id: 1 });
            testModel.fetch({
                beforeSend: (jqXHR, settings) => {
                    expect(settings.url).toBe("http://localhost/testModel/1");
                    return false;
                }
            });
        });
    });

    describe("parse()", () => {
        const TestModel = Model.extend(null, {
            parsers: {
                a(val) { return val; }
            }
        });

        it("should call attribute parser with model as context", () => {
            let parserContext = null;
            const TestParseContextModel = Model.extend(null, {
                parsers: {
                    a(value, options, model) {
                        parserContext = this;
                        return value;
                    }
                }
            });
            let model = new TestParseContextModel({ a: "A", b: "B" }, { parse: true });
            expect(parserContext).toBe(model);
        });

        it("should call default parser with model as context", () => {
            let parserContext = null;
            const TestParseContextModel = Model.extend(null, {
                parse(value, options, model, attribute) {
                    parserContext = this;
                    return value;
                }
            });
            let model = new TestParseContextModel({ a: "A", b: "B" }, { parse: true });
            expect(parserContext).toBe(model);
        });

        it("should assign model attributes and preserve keys", () => {
            let model = new Model({ a: "A", b: "B" }, { parse: true });

            expect(model.attributes).toEqual({ a: "A", b: "B" });
        });

        it("should call attribute parser for defined attribute", () => {
            const attributeParser = jest.spyOn(TestModel.parsers, "a");

            let testModel = new TestModel({ a: "A", b: "B" }, { parse: true });

            expect(attributeParser).toHaveBeenCalledWith("A", { parse: true }, testModel);

            attributeParser.mockRestore();
        });

        it("should call default parser for undefined attribute", () => {
            const defaultParser = jest.spyOn(TestModel, "parse");

            let testModel = new TestModel({ a: "A", b: "B" }, { parse: true });

            expect(defaultParser).toHaveBeenCalledWith("B", { parse: true }, testModel, "b");

            defaultParser.mockRestore();
        });
    });
});
