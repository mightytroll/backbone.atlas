## About Atlas

_Atlas_* is an extension for _Backbone_. It provides improved `Model` and `Collection` classes for
easier manipulation of nested resources, filters and custom headers.

*_In anatomy, the atlas is the first cervical vertebra of the spine._

## Table of contents
- [ Installation ](#installation)
- [ Usage ](#usage)
  - [ Import ](#example-import-module)
  - [ Extending ](#example-extending)
  - [ Overriding Initialize ](#example-overriding-initialize)
  - [ Polymorphic Collections ](#example-polymorphic-collections)
- [ Features ](#features)
  - [ Nesting Resources ](#nesting-resources)
  - [ Filters ](#filters)
  - [ Parsing ](#parsing)
  - [ Headers ](#headers)

## Installation

Install as node module.
```npm
npm install --save backbone.atlas
```

## Usage

#### Example: Import Module
```javascript
import Atlas from "backbone.atlas";
``` 

To use all _Atlas_ features, application models and collections must extend _Atlas_' instead of _Backbone_'s.

#### Example: Extending

```javascript
const ExampleModel = Atlas.Model.extend(protoProps);
const ExampleCollection = Atlas.Collection.extend(protoProps);
```

_Atlas_ uses `initialize` method to assign options like `parent` and `filters`. If `initialize` method is implemented,
super `initialize` must be called.

#### Example: Overriding Initialize

```javascript

const ExampleModel = Atlas.Model.extend({
  initialize(attributes, options) {
    Atlas.Model.prototype.initialize.call(this, attributes, options);
      
    // Additional initialization
  }
});
```

#### Example: Polymorphic Collections

```javascript
const ExampleCollection = Collection.extend({
  baseModel: User,

  model(attributes, options) {
    switch (attributes.type) {
      case "1":
        return new Seller(attributes, options);

      case "2":
        return new Traveler(attributes, options);

      default:
        return new this.baseModel(attributes, options);
    }
  }
});
```

**NOTE:** Collection's `url()` and `sync()` methods check `model.prototype` to determine `urlRoot` and `headers`. Specify `baseModel` for polymorphic collections.

## Features

### Nesting Resources

Resources are nested by specifying `parent` option when instantiating model ot collection.

#### Example: User Preferences

```javascript
const User = Atlas.Model.extend({
  urlRoot: "/users",
});

const Preference = Atlas.Model.extend({
  urlRoot: "/preferences"
});

const Preferences = Atlas.Collection.extend({
  model: Preference
});

let user = new User({ id: 1 });
let preferences = new Preferences([], { parent: user });

preferences.fetch(); // Will fetch from `/user/1/preferences`
```
**NOTE:** _Atlas_ uses `url()` method to return nested urls. There is rarely a need to override this method.

### Filters

Query parameters can easily be manipulated with `filters` option.

#### Example: Filtered Products

```javascript
const Product = Atlas.Model.extend({
  urlRoot: "/products"
});

const Products = Atlas.Collection.extend({
  model: Product
});

let computers = new Products([], {
  filters: {
    type: "computer"
  }
});
computers.fetch(); // Will fetch from `/products?type=computer`
```
**NOTE:** _Atlas_ uses `fetch()` method to add filters. There is rarely a need to override this method.

### Parsing

_Atlas_ uses static, per-attribute parsers to parse model attributes individually.

#### Example: Attribute Parsers

```javascript
const Article = Atlas.Model.extend({}, {
  parsers: {
    published(value, options, model) {
      return new Date(value);
    }
  }
});

let article = new Article({ published: "2018-09-28" }, { parse: true });
article.get("published"); // Returns a Date object
```

If a specific attribute parser is not defined, default attribute parser will be be called.
Default parser can be overridden to provide a catch-all parser logic.

#### Example: Default Parser

```javascript
const Article = Atlas.Model.extend({}, {
  parse(value, options, model, attribute) {
    return value;
  }
});
```

### Headers

Request headers can easily be manipulated with `headers` option.
Headers added this way will only affect instances of `ExampleModel` and it's extending classes.

**IMPORTANT:** Headers are always set to `Model`. `Collection` will pickup headers from it's `model` option.

#### Example: Custom Headers

```javascript
const ExampleModel = Atlas.Model.extend({
  headers: {
    "X-Custom-Header": "Hello"
  }
});
```
**NOTE:** _Atlas_ uses `sync()` method to add headers. There is rarely a need to override this method.