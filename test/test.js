/*jshint expr: true*/

var expect = chai.expect;
var should = chai.should();


describe('basic setup tests', function () {
    it('should return a searchBox with basic setup', function (done) {
        var testBox = new searchBox({
            "ajax_url": "",
            result_tag: ["tag"]
        }, $("#search_box"), $("#result_panel"));
        expect(testBox).to.be.not.undefined;
        done();
    });

    it('should throw error if option object is not given', function (done) {
        try {
            var testBox = new searchBox(undefined, $("#search_box"), $("#result_panel"));
        }
        catch (err) {
            expect(err.message).to.be.eql("The option is required to be an object.");
            done();
        }
    });

    it('should throw error if search field is not a jQuery object', function (done) {
        try {
            var testBox = new searchBox({
                "ajax_url": "",
                result_tag: ["tag"]
            }, undefined, $("#result_panel"));
        }
        catch (err) {
            expect(err.message).to.be.eql("Search box is requried to be an HTML element.");
            done();
        }
    });

    it('should throw error if result panel is not a jQuery object', function (done) {
        try {
            var testBox = new searchBox({
                "ajax_url": "",
                result_tag: ["tag"]
            }, $("#search_box"), undefined);
        }
        catch (err) {
            expect(err.message).to.be.equal("Result panel is requried to be an HTML element.");
            done();
        }
    });

    it('should throw error if result tag list is not given', function (done) {
        try {
            var testBox = new searchBox({
                "ajax_url": ""
            }, $("#search_box"), $("#result_panel"));
        }
        catch (err) {
            expect(err.message).to.be.equal("An array of result tags should be given.");
            done();
        }
    });

    describe('template ajax call tests', function () {
        var ajaxStub;
        beforeEach(function () {
            ajaxStub = sinon.stub($, "ajax");
        });

        afterEach(function () {
            $.ajax.restore();
        });

        it('should read template by the templateUrl in option', function (done) {
            ajaxStub.yieldsTo("success", "<html></html>");
            var testBox = new searchBox({
                "ajax_url": "",
                "templateUrl": "template.html",
                result_tag: [""]
            }, $("#search_box"), $("#result_panel"));

            expect(testBox.templateUrl).to.be.eql("template.html");
            expect(testBox.template).to.be.not.undefined;
            done();
        });

        it('should throw error if ajax call fails to load template', function (done) {
            ajaxStub.yieldsTo("error", "error");

            try {
                var testBox = new searchBox({
                    "ajax_url": "",
                    "templateUrl": "error.html",
                    result_tag: [""]
                }, $("#search_box"), $("#result_panel"));
            }
            catch (err) {
                expect(err).to.be.eql("error");
                done();
            }
        });
    });

    describe('default template tests', function () {

        it("should create a template with single group of data", function (done) {
            var testBox = new searchBox({
                "ajax_url": "",
                result_tag: ["tag"]
            }, $("#search_box"), $("#result_panel"));

            var templateResult = "<ul><h3 class=\"tag-title\">tag<span class=\"search-toggle-btn tag\"><a href=\"#\" class=\"tag\">+</a></span></h3><li class=\"tag tag-item\"><p class=\"tag tag-text\"></p></li></ul>";

            expect(testBox.template[0].outerHTML).to.be.eql(templateResult);
            done();
        });

        it("should create a template with multiple groups of data", function (done) {
            var testBox = new searchBox({
                "ajax_url": "",
                result_tag: ["tag1", "tag2"]
            }, $("#search_box"), $("#result_panel"));

            var templateResult = "<ul><h3 class=\"tag1-title\">tag1<span class=\"search-toggle-btn tag1\"><a href=\"#\" class=\"tag1\">+</a></span></h3><li class=\"tag1 tag1-item\"><p class=\"tag1 tag1-text\"></p></li><li><hr></li><h3 class=\"tag2-title\">tag2<span class=\"search-toggle-btn tag2\"><a href=\"#\" class=\"tag2\">+</a></span></h3><li class=\"tag2 tag2-item\"><p class=\"tag2 tag2-text\"></p></li></ul>";

            expect(testBox.template[0].outerHTML).to.be.eql(templateResult);
            done();
        });
    });

});

describe('configuration tests', function () {
    var option = {
        "ajax_url": "",
        result_tag: ["tag"]
    };

    it('should store empty ajax url if not given', function (done) {
        var testBox = new searchBox({
            result_tag: ["tag"]
        }, $("#search_box"), $("#result_panel"));

        expect(testBox.ajax_url).to.be.eql("");
        done();
    });

    it('should store the id referring to the search box', function (done) {
        var attrStub = sinon.stub($.prototype, "attr");
        attrStub.returns("search_box");

        var testBox = new searchBox(option, $("#search_box"), $("#result_panel"));
        expect(testBox.id).to.be.eql("search_box");
        attrStub.restore();
        done();
    });

    it('should call the hide function when clicking is on other elements and disappearOnBlur is true', function (done) {
        var hideStub = sinon.stub(searchBox.prototype, "hide");
        var hasStub = sinon.stub($.prototype, "has");
        hasStub.returns([]);

        option.disappearOnBlur = true;
        var testBox = new searchBox(option, $("#search_box"), $("#result_panel"));
        $(document).trigger("click");
        expect(hideStub.called).to.be.true;

        delete option.disappearOnBlur;
        hideStub.restore();
        hasStub.restore();
        done();
    });

    it('should call getResult with empty search field when searchAtStart is true', function (done) {
        var valStub = sinon.stub($.prototype, "val");
        var ajaxStub = sinon.stub($, "ajax");
        valStub.returns("");
        ajaxStub.returns(undefined);

        option.searchAtStart = true;

        var testBox = new searchBox(option, $("#search_box"), $("#result_panel"));
        testBox.search_box.trigger("click");

        expect(ajaxStub.called).to.be.true;

        delete option.searchAtStart;
        valStub.restore();
        ajaxStub.restore();

        done();
    });

    it('should have default value for lazySearch, disappearOnBlur, toggleDataFcn and attemptToFitIn', function (done) {
        var testBox = new searchBox(option, $("#search_box"), $("#result_panel"));

        expect(testBox.lazySearch).to.be.true;
        expect(testBox.disappearOnBlur).to.be.true;
        expect(testBox.toggleDataFcn).to.be.not.undefined;
        expect(testBox.attemptToFitIn).to.be.eql("none");
        done();
    });

    it('should throw inavlid showAmount option', function (done) {
        option.showAmount = true;
        try {
            var testBox = new searchBox(option, $("#search_box"), $("#result_panel"));
        }
        catch (err) {
            expect(err.message).to.be.eql("Invalid showAmount option.");
            delete option.showAmount;
            done();
        }
    });

    it('should have same showAmount for all groups', function (done) {
        option.showAmount = 1;
        option.result_tag = ["tag1", "tag2"];

        var testBox = new searchBox(option, $("#search_box"), $("#result_panel"));
        expect(testBox.showAmount).to.be.eql({ "tag1": 1, "tag2": 1 });

        delete option.showAmount;
        option.result_tag = ["tag"];
        done();
    });

    it('should have different showAmount for different groups', function (done) {
        option.showAmount = {
            "tag1": 1,
            "tag2": 2
        };
        option.result_tag = ["tag1", "tag2"];

        var testBox = new searchBox(option, $("#search_box"), $("#result_panel"));
        expect(testBox.showAmount).to.be.eql({ "tag1": 1, "tag2": 2 });

        delete option.showAmount;
        option.result_tag = ["tag"];
        done();
    });

    it('should use the custom toggleDataFcn function', function (done) {
        option.toggleDataFcn = sinon.spy();

        var testBox = new searchBox(option, $("#search_box"), $("#result_panel"));
        expect(testBox.toggleDataFcn).to.be.eql(option.toggleDataFcn);

        delete option.toggleDataFcn;
        done();
    });

    it('should return true from the default toggleDataFcn function', function (done) {
        var textStub = sinon.stub($.prototype, "text");
        textStub.returns("+");

        var testBox = new searchBox(option, $("#search_box"), $("#result_panel"));
        expect(testBox.toggleDataFcn($())).to.be.true;

        textStub.restore();
        done();
    });
});

describe('prototype function tests', function () {
    var option = {
        "ajax_url": "",
        result_tag: ["tag"]
    };

    describe('searchBox.prototype.show tests', function () {
        it('should change the css of result panel to display:block', function (done) {
            var cssStub = sinon.stub($.prototype, "css");
            var testBox = new searchBox(option, $("#search_box"), $("#result_panel"));

            testBox.show();
            expect(cssStub.calledWith("display", "block")).to.be.true;
            cssStub.restore();
            done();
        });

        it('should call the setPosition function', function (done) {
            var cssStub = sinon.stub($.prototype, "css");
            var offsetStub = sinon.stub($.prototype, "offset");
            var outerHStub = sinon.stub($.prototype, "outerHeight");
            offsetStub.returns({ top: 1, left: 1 });
            outerHStub.returns(0);

            option.attachToSearchBox = true;
            var testBox = new searchBox(option, $("#search_box"), $("#result_panel"));

            testBox.show();
            expect(cssStub.calledWith({
                top: 1,
                left: 1
            })).to.be.true;
            cssStub.restore();
            offsetStub.restore();
            outerHStub.restore();
            done();
        });
    });

    describe('searchBox.prototype.hide tests', function () {
        it('should change the css of result panel to display:block', function (done) {
            var cssStub = sinon.stub($.prototype, "css");
            var testBox = new searchBox(option, $("#search_box"), $("#result_panel"));

            testBox.hide();
            expect(cssStub.calledWith("display", "none")).to.be.true;
            cssStub.restore();
            done();
        });

        it('should call the setPosition function', function (done) {
            var emptyStub = sinon.stub($.prototype, "empty");

            option.attachToSearchBox = true;
            var testBox = new searchBox(option, $("#search_box"), $("#result_panel"));

            testBox.hide(true);
            expect(emptyStub.called).to.be.true;
            delete option.attachToSearchBox;
            emptyStub.restore();
            done();
        });
    });

    describe('searchBox.prototype.search tests', function () {
        var ajaxStub;
        beforeEach(function () {
            ajaxStub = sinon.stub($, "ajax");
        });

        afterEach(function () {
            $.ajax.restore();
        });

        it('should call getResult with the query stored in searchBox object', function (done) {
            var valStub = sinon.stub($.prototype, "val");
            valStub.returns("query");
            ajaxStub.yieldsTo("success", undefined);

            var testBox = new searchBox(option, $("#search_box"), $("#result_panel"));
            testBox.search();

            expect(testBox.query).to.be.eql("query");
            expect(ajaxStub.called).to.be.true;
            valStub.restore();
            done();
        });

        it('should call getResult with the query set in function call', function (done) {
            var valStub = sinon.stub($.prototype, "val");
            valStub.returns("query");
            ajaxStub.yieldsTo("success", undefined);

            var testBox = new searchBox(option, $("#search_box"), $("#result_panel"));
            testBox.search("new query");

            expect(testBox.query).to.be.eql("new query");
            expect(ajaxStub.called).to.be.true;
            valStub.restore();
            done();
        });
    });

    describe('searchBox.prototype.clear test', function () {
        it('should call empty function on result panel', function (done) {
            var emptyStub = sinon.stub($.prototype, "empty");

            var testBox = new searchBox(option, $("#search_box"), $("#result_panel"));
            testBox.clear();

            expect(emptyStub.called).to.be.true;
            emptyStub.restore();
            done();
        });
    });
});

describe('keyup function tests', function () {
    var keyEvent = {};
    var option = {
        "ajax_url": "",
        result_tag: ["tag"]
    };

    it('should quit search when esc is pressed', function (done) {
        var valStub = sinon.stub($.prototype, "val");
        var emptyStub = sinon.stub($.prototype, "empty");
        var keyupStub = sinon.stub($.prototype, "keyup");
        keyEvent.keyCode = 27;
        keyupStub.yields(keyEvent);

        var testBox = new searchBox(option, $("#search_box"), $("#result_panel"));
        testBox.search_box.keyup(function () {
            expect(valStub.calledWith("")).to.be.true;
            expect(emptyStub.called).to.be.true;

            valStub.restore();
            emptyStub.restore();
            keyupStub.restore();
            done();
        });
    });

    it('should not search if searchOnEnter is true and Enter is not pressed', function (done) {
        var keyupStub = sinon.stub($.prototype, "keyup");
        var ajaxStub = sinon.stub($, "ajax");
        keyEvent.keyCode = 0;
        keyupStub.yields(keyEvent);
        option.searchOnEnter = true;

        var testBox = new searchBox(option, $("#search_box"), $("#result_panel"));
        testBox.search_box.keyup(function () {
            expect(ajaxStub.called).to.be.false;

            delete option.searchOnEnter;
            keyupStub.restore();
            ajaxStub.restore();
            done();
        });
    });

    it('should not search if searchOnEnter is true and Enter is pressed', function (done) {
        var keyupStub = sinon.stub($.prototype, "keyup");
        var ajaxStub = sinon.stub($, "ajax");
        keyEvent.keyCode = 13;
        keyupStub.yields(keyEvent);
        ajaxStub.yieldsTo("success", undefined);
        option.searchOnEnter = true;

        var testBox = new searchBox(option, $("#search_box"), $("#result_panel"));
        testBox.search_box.keyup(function () {
            expect(ajaxStub.called).to.be.true;

            delete option.searchOnEnter;
            keyupStub.restore();
            ajaxStub.restore();
            done();
        });
    });

    it('should do the search immediately if lazySearch is false', function (done) {
        var keyupStub = sinon.stub($.prototype, "keyup");
        var ajaxStub = sinon.stub($, "ajax");
        keyEvent.keyCode = 1;
        keyupStub.yields(keyEvent);
        ajaxStub.yieldsTo("success", undefined);
        option.lazySearch = false;

        var testBox = new searchBox(option, $("#search_box"), $("#result_panel"));
        testBox.search_box.keyup(function () {
            expect(ajaxStub.called).to.be.true;
            expect(testBox.loading).to.be.null;

            delete option.lazySearch;
            keyupStub.restore();
            ajaxStub.restore();
            done();
        });
    });

    it('should clear the timeout and do the search after new timeout dies', function (done) {
        var keyupStub = sinon.stub($.prototype, "keyup");
        var ajaxStub = sinon.stub($, "ajax");
        var clock = sinon.useFakeTimers();
        keyEvent.keyCode = 1;
        keyupStub.yields(keyEvent);
        ajaxStub.yieldsTo("success", undefined);
        option.lazySearch = true;

        var testBox = new searchBox(option, $("#search_box"), $("#result_panel"));
        testBox.search_box.keyup(function () {
            expect(ajaxStub.called).to.be.false;
            clock.tick(200);
            expect(ajaxStub.called).to.be.true;

            delete option.lazySearch;
            keyupStub.restore();
            ajaxStub.restore();
            clock.restore();
            done();
        });
    });
});

describe('showMore & hideMore tests', function () {
    var option = {
        "ajax_url": "",
        result_tag: ["tag"]
    };

    it('should call the showMore function but not the setPosition function', function (done) {
        var hasClassStub = sinon.stub($.prototype, "hasClass");
        var attrStub = sinon.stub($.prototype, "attr");
        var textStub = sinon.stub($.prototype, "text");
        hasClassStub.returns(true);
        attrStub.withArgs("class").returns("tag");

        var testBox = new searchBox(option, $("#search_box"), $("#result_panel"));
        var toggleDataFcnStub = sinon.stub(testBox, 'toggleDataFcn');
        testBox.currentData = {
            tag: []
        };
        testBox.showAmount = {
            tag: 0
        };
        toggleDataFcnStub.returns(true);

        testBox.result_panel.trigger("click");

        expect(textStub.calledWith("-")).to.be.true;
        hasClassStub.restore();
        attrStub.restore();
        textStub.restore();
        done();
    });

    it('should show more item', function (done) {
        var itemMock = {
            clone: sinon.spy(function () {
                return this;
            }),
            find: sinon.spy(function () {
                return this;
            }),
            addBack: sinon.spy(function () {
                return this;
            }),
            eq: sinon.spy(function () {
                return this;
            }),
            text: sinon.spy(),
            attr: sinon.spy(),
            html: sinon.spy(),
            addClass: sinon.spy(),
            after: sinon.spy()
        };

        var hasClassStub = sinon.stub($.prototype, "hasClass");
        var attrStub = sinon.stub($.prototype, "attr");
        var textStub = sinon.stub($.prototype, "text");
        hasClassStub.returns(true);
        attrStub.withArgs("class").returns("tag");
        var lastStub = sinon.stub($.prototype, "last");
        lastStub.returns(itemMock);

        var testBox = new searchBox(option, $("#search_box"), $("#result_panel"));
        var toggleDataFcnStub = sinon.stub(testBox, 'toggleDataFcn');
        testBox.currentData = {
            tag: [[{
                type: "type",
                value: {
                    text: "text",
                    src: "src",
                    href: "href",
                    id: "id",
                    html: "html",
                    class: "class"
                },
                index: "index"
            }]]
        };
        testBox.showAmount = {
            tag: 0
        };
        toggleDataFcnStub.returns(true);

        testBox.result_panel.trigger("click");

        expect(itemMock.clone.called).to.be.true;
        expect(itemMock.find.calledWith(".tag-type")).to.be.true;
        expect(itemMock.addBack.calledWith(".tag-type")).to.be.true;
        expect(itemMock.text.calledWith("text")).to.be.true;
        expect(itemMock.attr.calledWith("src")).to.be.true;
        expect(itemMock.attr.calledWith("href")).to.be.true;
        expect(itemMock.attr.calledWith("id")).to.be.true;
        expect(itemMock.html.calledWith("html")).to.be.true;
        expect(itemMock.addClass.calledWith("class")).to.be.true;

        toggleDataFcnStub.restore();
        hasClassStub.restore();
        lastStub.restore();
        attrStub.restore();
        textStub.restore();
        done();
    });

    it('should hide more item', function (done) {
        var hasClassStub = sinon.stub($.prototype, "hasClass");
        hasClassStub.returns(true);
        var attrStub = sinon.stub($.prototype, "attr");
        attrStub.withArgs("class").returns("tag");
        var childrenStub = sinon.stub($.prototype, "children");
        var fakeText = {
            text: sinon.spy()
        };
        childrenStub.returns(fakeText);
        var sliceStub = sinon.stub($.prototype, "slice");
        var fakeRemove = {
            remove: sinon.spy()
        };
        sliceStub.returns(fakeRemove);
        var testBox = new searchBox(option, $("#search_box"), $("#result_panel"));
        testBox.showAmount = {
            tag: 0
        };
        var toggleDataFcnStub = sinon.stub(testBox, 'toggleDataFcn');
        toggleDataFcnStub.returns(false);
        testBox.result_panel.trigger("click");

        expect(childrenStub.calledWith("a")).to.be.true;
        expect(sliceStub.calledWith(0)).to.be.true;
        expect(fakeRemove.remove.called).to.be.true;
        expect(fakeText.text.calledWith("+")).to.be.true;

        toggleDataFcnStub.restore();
        childrenStub.restore();
        attrStub.restore();
        hasClassStub.restore();
        done();
    });
});

describe('getResult tests', function () {
    var option = {
        "ajax_url": "",
        result_tag: ["tag"]
    };
    var ajaxStub;
    var testBox;
    beforeEach(function () {
        testBox = new searchBox(option, $("#search_box"), $("#result_panel"));
        ajaxStub = sinon.stub($, "ajax");

    });

    afterEach(function () {
        ajaxStub.restore();
    });

    it('should throw an error from ajax call', function (done) {
        ajaxStub.yieldsTo("error", "error");
        try {
            testBox.search(undefined, false);
        }
        catch (e) {
            expect(e).to.be.eql("error");
            done();
        }
    });

    it('should receive the data successfully', function (done) {
        ajaxStub.yieldsTo("success", "data");
        var emptyStub = sinon.stub($.prototype, "empty");
        var appendStub = sinon.stub($.prototype, "append");
        var cssStub = sinon.stub($.prototype, "css");
        testBox.result_tag = [];
        testBox.template = {
            clone: sinon.spy(function () {
                return "template";
            })
        };
        testBox.search("query", false);

        expect(emptyStub.called).to.be.true;
        expect(testBox.template.clone.called).to.be.true;
        expect(appendStub.calledWith("template")).to.be.true;
        expect(cssStub.calledWith("display", "block")).to.be.true;

        emptyStub.restore();
        appendStub.restore();
        cssStub.restore();

        done();
    });

    it('should receive the data and call the setPosition function', function (done) {
        ajaxStub.yieldsTo("success", "data");
        var emptyStub = sinon.stub($.prototype, "empty");
        var appendStub = sinon.stub($.prototype, "append");
        var cssStub = sinon.stub($.prototype, "css");
        var offsetStub = sinon.stub($.prototype, "offset");
        var outerHStub = sinon.stub($.prototype, "outerHeight");
        offsetStub.returns({ top: 1, left: 1 });
        outerHStub.returns(0);

        testBox.result_tag = [];
        testBox.attachToSearchBox = true;
        testBox.template = {
            clone: sinon.spy(function () {
                return "template";
            })
        };
        testBox.search("query", false);

        expect(emptyStub.called).to.be.true;
        expect(testBox.template.clone.called).to.be.true;
        expect(appendStub.calledWith("template")).to.be.true;
        expect(cssStub.calledWith("display", "block")).to.be.true;
        expect(cssStub.calledWith({
            top: 1,
            left: 1
        })).to.be.true;

        emptyStub.restore();
        appendStub.restore();
        cssStub.restore();
        offsetStub.restore();
        outerHStub.restore();

        done();
    });
});

describe('displayResult tests', function () {
    var option = {
        "ajax_url": "",
        result_tag: ["tag"]
    };
    var ajaxStub;
    var testBox;
    beforeEach(function () {
        testBox = new searchBox(option, $("#search_box"), $("#result_panel"));
        ajaxStub = sinon.stub($, "ajax");
    });
    afterEach(function () {
        ajaxStub.restore();
    });

    it('should return an empty template with no tag-item', function (done) {
        ajaxStub.yieldsTo("success", { tag: "data" });
        testBox.result_tag = ["tag"];
        testBox.showAmount = {
            tag: 0
        };
        testBox.template = $($.parseHTML("<div><h1 class='tag-item'></h1></div>"));

        testBox.search("query", false);
        expect(testBox.result_panel.children("div").length).to.be.eql(1);
        done();
    });

    it('should return an empty template with neither tag-item nor showMore button', function (done) {
        ajaxStub.yieldsTo("success", { tag: [] });
        testBox.result_tag = ["tag"];
        testBox.showAmount = {};
        testBox.template = $($.parseHTML("<div><h1 class='tag-title'><span></span></h1><h1 class='tag-item'></h1></div>"));

        testBox.search("query", false);

        expect(testBox.result_panel.children("div").length).to.be.eql(1);
        expect(testBox.result_panel.children("span").length).to.be.eql(0);
        testBox.result_panel.empty();
        done();
    });

    it('should show the data from AJAX call', function (done) {
        ajaxStub.yieldsTo("success", {
            tag: [[{
                "type": "text",
                "index": "0",
                "value": {
                    "text": "text",
                    "id": "id",
                    "class": "class"
                }
            }]]
        });
        testBox.result_tag = ["tag"];
        testBox.showAmount = {
            tag: 1
        };
        testBox.template = $($.parseHTML("<div><h1 class='tag-title'><span></span></h1><div class='tag-item'><p class='tag-text'></p></div></div>"));
        testBox.search("query", false);

        expect(testBox.result_panel.find(".tag-text").text()).to.be.eql("text");
        expect(testBox.result_panel.find(".tag-text").hasClass("class")).to.be.true;
        expect(testBox.result_panel.find(".tag-text").attr("id")).to.be.eql("id");
        testBox.result_panel.empty();
        done();
    });

    it('should ignore elements that are not in the templates', function (done) {
        ajaxStub.yieldsTo("success", {
            tag: [[
                {
                    "type": "text",
                    "index": "0",
                    "value": {
                        "text": "text",
                        "id": "id",
                        "class": "class"
                    }
                },
                {
                    "type": "ignore",
                    "index": "0",
                    "value": {
                        "text": "text",
                    }
                }]]
        });
        testBox.result_tag = ["tag"];
        testBox.showAmount = {
            tag: 1
        };
        testBox.template = $($.parseHTML("<div><h1 class='tag-title'><span></span></h1><div class='tag-item'><p class='tag-text'></p></div></div>"));
        testBox.search("query", false);

        expect(testBox.result_panel.find(".tag-text").length).to.be.eql(1);
        expect(testBox.result_panel.find(".tag-ignore").length).to.be.eql(0);
        testBox.result_panel.empty();
        done();
    });

    it('should have two items showing in the result panel', function (done) {
        ajaxStub.yieldsTo("success", {
            tag: [[{
                "type": "text",
                "index": "0",
                "value": {
                    "html": "html",
                }
            }], [{
                "type": "text",
                "index": "0",
                "value": {
                    "html": "html_2",
                }
            }]]
        });
        testBox.result_tag = ["tag"];
        testBox.showAmount = {
            tag: 2
        };
        testBox.template = $($.parseHTML("<div><h1 class='tag-title'><span></span></h1><div class='tag-item'><p class='tag-text'></p></div></div>"));
        testBox.search("query", false);
        
        expect(testBox.result_panel.find(".tag-item").length).to.be.eql(2);
        expect(testBox.result_panel.find(".tag-item+.tag-item").length).to.be.eql(1);
        testBox.result_panel.empty();
        done();
    });
});

describe('setPosition tests', function () {
    var option = {
        "ajax_url": "",
        result_tag: ["tag"],
        attachToSearchBox: true
    };

    it('should call the setPosition function', function (done) {
        var hasClassStub = sinon.stub($.prototype, "hasClass");
        var attrStub = sinon.stub($.prototype, "attr");
        var textStub = sinon.stub($.prototype, "text");
        var cssStub = sinon.stub($.prototype, "css");
        var offsetStub = sinon.stub($.prototype, "offset");
        var outerHStub = sinon.stub($.prototype, "outerHeight");
        hasClassStub.returns(true);
        offsetStub.returns({ top: 1, left: 1 });
        outerHStub.returns(0);
        attrStub.withArgs("class").returns("tag");

        var testBox = new searchBox(option, $("#search_box"), $("#result_panel"));
        var toggleDataFcnStub = sinon.stub(testBox, 'toggleDataFcn');
        testBox.currentData = {
            tag: []
        };
        testBox.showAmount = {
            tag: 0
        };
        toggleDataFcnStub.returns(true);

        testBox.result_panel.trigger("click");

        expect(cssStub.calledWith({
            top: 1,
            left: 1
        })).to.be.true;
        hasClassStub.restore();
        attrStub.restore();
        textStub.restore();
        cssStub.restore();
        offsetStub.restore();
        outerHStub.restore();
        done();
    });

    it('should not attempt to fit in the screen', function (done) {
        var cssStub = sinon.stub($.prototype, "css");
        var offsetStub = sinon.stub($.prototype, "offset");
        var outerHStub = sinon.stub($.prototype, "outerHeight");
        var outerWStub = sinon.stub($.prototype, "outerWidth");
        offsetStub.returns({ top: 1, left: 1 });
        outerHStub.returns(0);

        var testBox = new searchBox(option, $("#search_box"), $("#result_panel"));

        testBox.show();
        expect(cssStub.calledWith({
            top: 1,
            left: 1
        })).to.be.true;
        expect(outerWStub.called).to.be.false;
        cssStub.restore();
        offsetStub.restore();
        outerHStub.restore();
        outerWStub.restore();
        done();
    });

    it('should change the position to fit in', function (done) {
        var cssStub = sinon.stub($.prototype, "css");
        var offsetStub = sinon.stub($.prototype, "offset");
        var outerHStub = sinon.stub($.prototype, "outerHeight");
        var outerWStub = sinon.stub($.prototype, "outerWidth");
        var widthStub = sinon.stub($.prototype, "width");
        var heightStub = sinon.stub($.prototype, "height");
        var addClassStub = sinon.stub($.prototype, "addClass");
        offsetStub.returns({ top: 2, left: 1 });
        outerHStub.returns(1);
        outerWStub.returns(0);
        widthStub.returns(0);
        heightStub.returns(0);
        option.attemptToFitIn = "auto";

        var testBox = new searchBox(option, $("#search_box"), $("#result_panel"));
        testBox.id = "search_box";
        testBox.show();

        expect(cssStub.calledWith({
            top: 1,
            left: 0
        })).to.be.true;
        expect(addClassStub.calledWith("search_box_float")).to.be.true;

        cssStub.restore();
        offsetStub.restore();
        outerHStub.restore();
        outerWStub.restore();
        widthStub.restore();
        heightStub.restore();
        addClassStub.restore();
        done();
    });

    it('should try to fit in the screen without resizing', function (done) {
        var cssStub = sinon.stub($.prototype, "css");
        var offsetStub = sinon.stub($.prototype, "offset");
        var outerHStub = sinon.stub($.prototype, "outerHeight");
        var outerWStub = sinon.stub($.prototype, "outerWidth");
        var widthStub = sinon.stub($.prototype, "width");
        var heightStub = sinon.stub($.prototype, "height");
        offsetStub.returns({ top: 1, left: 1 });
        outerHStub.returns(2);
        outerWStub.returns(1);
        widthStub.returns(0);
        heightStub.returns(0);
        option.attemptToFitIn = "auto";

        var testBox = new searchBox(option, $("#search_box"), $("#result_panel"));
        testBox.show();

        expect(cssStub.calledWith({
            top: 3,
            left: 1
        })).to.be.true;
        cssStub.restore();
        offsetStub.restore();
        outerHStub.restore();
        outerWStub.restore();
        widthStub.restore();
        heightStub.restore();
        done();
    });

    it('should try to fit in the screen by resizing the result panel', function (done) {
        var cssStub = sinon.stub($.prototype, "css");
        var offsetStub = sinon.stub($.prototype, "offset");
        var outerHStub = sinon.stub($.prototype, "outerHeight");
        var outerWStub = sinon.stub($.prototype, "outerWidth");
        var widthStub = sinon.stub($.prototype, "width");
        var heightStub = sinon.stub($.prototype, "height");
        offsetStub.returns({ top: 1, left: 1 });
        outerHStub.returns(2);
        outerWStub.returns(1);
        widthStub.returns(0);
        heightStub.returns(0);
        option.attemptToFitIn = "resize";

        var testBox = new searchBox(option, $("#search_box"), $("#result_panel"));
        testBox.id = "search_box";
        testBox.show();

        expect(cssStub.calledWith({
            top: 3,
            left: 1
        })).to.be.true;
        expect(widthStub.calledWith(-1)).to.be.true;
        expect(heightStub.calledWith(-3)).to.be.true;

        cssStub.restore();
        offsetStub.restore();
        outerHStub.restore();
        outerWStub.restore();
        widthStub.restore();
        heightStub.restore();
        done();
    });
});