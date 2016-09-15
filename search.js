(function () {
    var window = this;
    this.searchBox = function (option, search_box, result_panel) {
        var that = this;

        if (typeof option !== "object") {
            throw new Error("The option is required to be an object.");
        }
        if (search_box === undefined || !(search_box instanceof jQuery)) {
            throw new Error("Search box is requried to be an HTML element");
        }
        if (result_panel === undefined || !(result_panel instanceof jQuery)) {
            throw new Error("Result panel is requried to be an HTML element");
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
            this.template.load(this.templateUrl);
        }
        else {
            var html = "<ul class='container'>";
            for (var i = 0; i < this.result_tag.length; i++) {
                html += "   <li class='" + this.result_tag[i] + " " + this.result_tag[i] + "-text'></li>";
                html += "   <li class='" + this.result_tag[i] + "-showMore' search-data-tag='" + this.result_tag[i] + "'><a href='#'>Show More</a></li>";
            }
            html += "</ul>";
            this.template = $.parseHTML(html);
        }
        this.template = $(this.template);
        this.lazySearch = (undefined === option.lazySearch ? true : option.lazySearch);
        this.disappearOnBlur = (undefined === option.disappearOnBlur ? true : option.disappearOnBlur);
        this.showOnClick = option.showOnClick;
        this.searchAtStart = option.searchAtStart;
        this.searchOnEnter = option.searchOnEnter;
        this.attachToSearchBox = option.attachToSearchBox;
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
                throw new Error("Invalid showAmount option");
            }
        }
        applyConfig.call(that);

        this.search_box.keyup(function (keyEvent) {
            keyUp.call(that, keyEvent);
        });
        this.result_panel.click(function (event) {
            var tag = $(event.target).parent().attr("search-data-tag");
            if (tag) {
                event.stopPropagation();
                showAll.call(that,tag);
            }
        })
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
        getResult.call(this);
        if (false !== show) {
            this.result_panel.css("display", "block");
        }
    };
    searchBox.prototype.clear = function () {
        clearPanel();
    };

    function applyConfig() {
        var that = this;
        if (that.searchAtStart) {
            that.search_box.click(function () {
                if (that.search_box.val().length === 0) {
                    getResult.call(that);
                }
            });
        }
        if (this.disappearOnBlur) {
            $(window.document).click(function (event) {
                if (that.search_box.has($(event.target)).length <= 0 && that.result_panel.has($(event.target)).length <= 0) {
                    searchBox.prototype.hide.call(that);
                }
            });
        }
        if (this.showOnClick) {
            that.search_box.click(function () {
                event.stopPropagation();
                searchBox.prototype.show.call(that);
            });
        }
    }

    function quitSearch() {
        this.search_box.val("");
        clearPanel.call(this);
    }

    function clearPanel() {
        this.result_panel.empty();
    }

    function keyUp(keyEvent) {
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
            if (that.loading) {
                clearTimeout(that.loading);
            }
            that.loading = setTimeout(function () {
                getResult.call(that);
            }, 200);
        }
        else {
            getResult.call(that);
        }
    }

    function getResult() {
        var that = this;
        that.query = that.search_box.val();

        $.ajax(that.ajax_url, {
            data: {
                q: that.query || ''
            },
            dataType: 'json',
            success: function (data) {
                if (data) {
                    that.currentData = data;
                    displayResult.call(that, that.currentData);
                }
            },
            error: function (data) {
                throw JSON.stringify(data);
            }
        });
    }

    function displayResult(data) {
        var that = this;
        searchBox.prototype.show.call(that);
        clearPanel.call(that);
        var currentTemplate = that.template.clone();
        that.result_panel.append(currentTemplate);
        for (var i = 0; i < that.result_tag.length; i++) {
            var currentTag = that.result_tag[i];
            var currentData = data[currentTag];
            var currentElement = currentTemplate.find("." + currentTag);
            var prevItem;
            var maximum;
            if (undefined !== that.showAmount[currentTag]) {
                maximum = Math.min(that.showAmount[currentTag], currentData.length);
            }
            else {
                maximum = currentData.length;
            }
            for (var j = 0; j < maximum; j++) {
                currentElement.find("." + currentTag + "-text").addBack("." + currentTag + "-text").text(currentData[j]);
                if (prevItem) {
                    prevItem.after(currentElement);
                }
                prevItem = currentElement;
                currentElement = prevItem.clone();
            }
            prevItem = null;
            var showMoreElement = currentTemplate.find("." + currentTag + "-showMore");
            if (maximum !== that.showAmount[currentTag]) {
                showMoreElement.remove();
            }
        }
        if (this.attachToSearchBox) {
            setPosition.call(that);
        }
    }

    function setPosition() {
        var pos = this.search_box.offset();
        var search_box_height = this.search_box.outerHeight();
        var top = pos.top + search_box_height;
        var left = pos.left;
        var panelWidth = this.result_panel.outerWidth();
        var panelHeight = this.result_panel.outerHeight();
        if (left + panelWidth > $(window).width()) {
            left = $(window).width() - panelWidth;
        }
        if (top + panelHeight > $(window).height()) {
            top = pos.top - panelHeight;
            this.result_panel.addClass(this.id + "_top");
        }
        this.result_panel.addClass(this.id + "_float");
        this.result_panel.css({
            top: top,
            left: left
        });
    }

    function showAll(tag) {
        var group = $("." + tag);
        var currentData = this.currentData[tag];
        var showMoreBtn = $("." + tag + "-showMore");
        var showAmount = this.showAmount[tag];
        var currentElement = this.template.find("." + tag).clone();
        var prevItem = showMoreBtn;
        for (var i = showAmount; i < currentData.length; i++) {
            currentElement.find("." + tag + "-text").addBack("." + tag + "-text").text(currentData[i]);
            prevItem.after(currentElement);
            prevItem = currentElement;
            currentElement = prevItem.clone();
        }
        showMoreBtn.remove();
    }

} ());