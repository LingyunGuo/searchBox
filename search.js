(function () {
    var _window = this;
    this.searchBox = function (option, search_box, result_panel) {
        var that = this;

        if (typeof option !== "object") {
            throw new Error("The option is required to be an object.");
        }
        if (search_box === undefined || !(search_box instanceof jQuery)) {
            throw new Error("Search box is requried to be an HTML element.");
        }
        if (result_panel === undefined || !(result_panel instanceof jQuery)) {
            throw new Error("Result panel is requried to be an HTML element.");
        }
        if (option.result_tag === undefined || !(option.result_tag instanceof Array)) {
            throw new Error("An array of result tags should be given.");
        }

        // read in options
        this.ajax_url = option.ajax_url ? option.ajax_url : '';
        this.search_box = search_box;
        this.id = this.search_box.attr("id");
        this.query = '';
        this.loading = null;
        this.result_panel = result_panel;
        this.result_tag = option.result_tag;
        if (option.templateUrl) {
            this.templateUrl = option.templateUrl;
            $.ajax({
                url: this.templateUrl,
                dataType: "html",
                success: function (responseHTML) {
                    var template = $.parseHTML(responseHTML);
                    that.template = $(template);
                },
                error: function (err) {
                    throw err;
                }
            });
        }
        else {
            var html = "<ul>";
            for (var i = 0; i < this.result_tag.length; i++) {
                // default template
                html += "<h3 class='" + this.result_tag[i] + "-title'>" + this.result_tag[i] + "<span class='search-toggle-btn ";
                html += this.result_tag[i] + "'><a href='#' class='" + this.result_tag[i] + "'>+</a></span></h3>";
                html += "<li class='" + this.result_tag[i] + " " + this.result_tag[i] + "-item'>"; html += "<p class='" + this.result_tag[i] + " " + this.result_tag[i] + "-text'></p></li>";
                if (i != this.result_tag.length - 1) {
                    html += "<li><hr/></li>";
                }
            }
            html += "</ul>";
            this.template = $.parseHTML(html);
            this.template = $(this.template);
        }
        this.lazySearch = (undefined === option.lazySearch ? true : option.lazySearch);
        this.disappearOnBlur = (undefined === option.disappearOnBlur ? true : option.disappearOnBlur);
        this.searchAtStart = option.searchAtStart;
        this.searchOnEnter = option.searchOnEnter;
        this.attachToSearchBox = option.attachToSearchBox;
        this.toggleDataFcn = option.toggleDataFcn || toggleDataFcn;
        this.attemptToFitIn = (option.attemptToFitIn === undefined ? "none" : option.attemptToFitIn).toLowerCase();
        this.showAmount = {};
        for (var i = 0; i < this.result_tag.length; i++) {
            if (undefined === option.showAmount) {
                this.showAmount[this.result_tag[i]] = undefined;
            }
            else if (typeof option.showAmount === "number") {
                this.showAmount[this.result_tag[i]] = option.showAmount;
            }
            else if (typeof option.showAmount === "object") {
                this.showAmount[this.result_tag[i]] = option.showAmount[this.result_tag[i]];
            }
            else {
                throw new Error("Invalid showAmount option.");
            }
        }
        applyConfig.call(that);

        this.search_box.keyup(function (keyEvent) {
            keyUp.call(that, keyEvent);
        });
        this.result_panel.click(function (event) {
            if ($(event.target).parent().hasClass("search-toggle-btn")) {
                var tag = $(event.target).attr("class");
                event.stopPropagation();
                if (that.toggleDataFcn($(event.target))) {
                    showMore.call(that, tag);
                    if (that.attachToSearchBox) {
                        setPosition.call(that);
                    }
                }
                else {
                    hideMore.call(that, tag);
                }
            }
        });
    };

    searchBox.prototype.show = function () {
        this.result_panel.css("display", "block");
        if (this.attachToSearchBox) {
            setPosition.call(this);
        }
    };
    searchBox.prototype.hide = function (clearOnHide) {
        this.result_panel.css("display", "none");
        if (clearOnHide) {
            clearPanel.call(this);
        }
    };
    searchBox.prototype.search = function (query, show) {
        if (undefined !== query) {
            this.query = query;
        }
        getResult.call(this, query);
        if (false !== show) {
            this.result_panel.css("display", "block");
        }
    };
    searchBox.prototype.clear = function () {
        clearPanel.call(this);
    };

    var applyConfig = function () {
        var that = this;
        if (that.searchAtStart) {
            that.search_box.click(function () {
                if (that.search_box.val().length === 0) {
                    getResult.call(that);
                }
            });
        }
        if (that.disappearOnBlur) {
            $(_window.document).click(function (event) {
                if (that.search_box.has($(event.target)).length <= 0 && that.result_panel.has($(event.target)).length <= 0) {
                    searchBox.prototype.hide.call(that);
                }
            });
        }
    };

    var quitSearch = function () {
        this.search_box.val("");
        clearPanel.call(this);
    };

    var clearPanel = function () {
        this.result_panel.empty();
    };

    var keyUp = function (keyEvent) {
        var that = this;
        if (keyEvent.keyCode === 27) {
            return quitSearch.call(that);
        }
        if (that.searchOnEnter) {
            if (keyEvent.keyCode === 13) {
                getResult.call(that);
            }
            return;
        }
        if (that.lazySearch) {
            // if (that.loading) {
            clearTimeout(that.loading);
            // }
            that.loading = setTimeout(function () {
                getResult.call(that);
            }, 200);
        }
        else {
            getResult.call(that);
        }
    };

    var getResult = function (query) {
        var that = this;
        if (!query) {
            that.query = that.search_box.val();
        }

        $.ajax(that.ajax_url, {
            data: {
                q: that.query || ''
            },
            dataType: 'json',
            success: function (data) {
                if (data) {
                    that.currentData = data;
                    clearPanel.call(that);
                    var elements = displayResult(that.result_tag, that.showAmount, that.currentData, that.template.clone());
                    that.result_panel.append(elements);
                    searchBox.prototype.show.call(that);
                    if (that.attachToSearchBox) {
                        setPosition.call(that);
                    }
                }
            },
            error: function (data) {
                throw data;
            }
        });
    };

    var displayResult = function (tagList, showAmount, data, template) {
        for (var i = 0; i < tagList.length; i++) { // For each group of data
            var currentTag = tagList[i];
            var currentData = data[currentTag];
            var title = template.find("." + currentTag + "-title");
            var currentItem = template.find("." + currentTag + "-item");
            var prevItem;
            var maximum;
            if (undefined !== showAmount[currentTag]) {
                maximum = Math.min(showAmount[currentTag], currentData.length);
            }
            else {
                maximum = currentData.length;
            }
            if (maximum === currentData.length) {
                title.children("span").remove();
            }
            if (maximum === 0) {
                template.find("." + currentTag + "-item").remove();
            }
            for (var j = 0; j < maximum; j++) { // For each item in the group
                for (var k = 0; k < currentData[j].length; k++) { // For each element in the item
                    var type = currentData[j][k].type;
                    var elementClassSelector = "." + currentTag + "-" + type;
                    var value = currentData[j][k].value;
                    var index = currentData[j][k].index;
                    var currentElement = currentItem.find(elementClassSelector).addBack(elementClassSelector);
                    if (currentElement.length) {
                        currentElement = currentElement.eq(index);
                    }
                    if (!currentElement.length) {
                        break;
                    }
                    for (var key in value) { // For each attribute of current element
                        if (key === "text") {
                            currentElement.text(currentData[j][k].value[key]);
                        }
                        else if (key === "src" || key === "href" || key === "id" || key === "title" || key === "alt") {
                            currentElement.attr(key, currentData[j][k].value[key]);
                        }
                        else if (key === "html") {
                            currentElement.html(currentData[j][k].value[key]);
                        }
                        else if (key === "class") {
                            currentElement.addClass(currentData[j][k].value[key]);
                        }
                    }
                }
                if (prevItem) {
                    prevItem.after(currentItem);
                }
                prevItem = currentItem;
                currentItem = currentItem.clone();
            }
            prevItem = null;
            if (maximum !== showAmount[currentTag]) {
                $("." + tagList[i] + ".search-toggle-btn").children("a").remove();
            }
        }
        return template;
    };

    var setPosition = function () {
        var pos = this.search_box.offset();
        var search_box_height = this.search_box.outerHeight();
        var top = pos.top + search_box_height;
        var left = pos.left;
        if (this.attemptToFitIn !== "none") {
            var panelWidth = this.result_panel.outerWidth();
            var panelHeight = this.result_panel.outerHeight();
            if (left + panelWidth > $(_window).width() && $(_window).width() - panelWidth >= 0) {
                left = $(_window).width() - panelWidth;
            }
            else if (this.attemptToFitIn === "resize" && left + panelWidth > $(_window).width() && $(_window).width() - panelWidth < 0) {
                this.result_panel.width($(_window).width() - left);
            }
            if (top + panelHeight > $(_window).height() && pos.top - panelHeight >= 0) {
                top = pos.top - panelHeight;
                this.result_panel.addClass(this.id + "_top");
            }
            else if (this.attemptToFitIn === "resize" && top + panelHeight > $(_window).height() && pos.top - panelHeight < 0) {
                this.result_panel.height($(_window).height() - top);
            }
        }
        this.result_panel.addClass(this.id + "_float");
        this.result_panel.css({
            top: top,
            left: left
        });
    };

    var showMore = function (tag) {
        var currentData = this.currentData[tag];
        var toggleBtn = $("#" + this.id + "_result ." + tag + ".search-toggle-btn").children("a");
        var showAmount = this.showAmount[tag];
        var prevItem = $("#" + this.id + "_result ." + tag + "-item").last();
        var currentItem = prevItem.clone();
        for (var j = showAmount; j < currentData.length; j++) { // For each item in the group
            for (var k = 0; k < currentData[j].length; k++) { // For each element in the item
                var type = currentData[j][k].type;
                var elementClassSelector = "." + tag + "-" + type;
                var value = currentData[j][k].value;
                var index = currentData[j][k].index;
                var currentElement = currentItem.find(elementClassSelector).addBack(elementClassSelector).eq(index);
                for (var key in value) { // For each attribute of current element
                    if (key === "text") {
                        currentElement.text(currentData[j][k].value[key]);
                    }
                    else if (key === "src" || key === "href" || key === "id") {
                        currentElement.attr(key, currentData[j][k].value[key]);
                    }
                    else if (key === "html") {
                        currentElement.html(currentData[j][k].value[key]);
                    }
                    else if (key === "class") {
                        currentElement.addClass(currentData[j][k].value[key]);
                    }
                }
            }
            if (prevItem) {
                prevItem.after(currentItem);
            }
            prevItem = currentItem;
            currentItem = currentItem.clone();
        }
        toggleBtn.text("-");
    };

    var hideMore = function (tag) {
        var showAmount = this.showAmount[tag];
        var toggleBtn = $("#" + this.id + "_result ." + tag + ".search-toggle-btn").children("a");
        $("#" + this.id + "_result ." + tag + "-item").slice(showAmount).remove();
        toggleBtn.text("+");
    };

    var toggleDataFcn = function (target) {
        if (target.text() === '+') {
            return true;
        }
        return false;
    };
} ());