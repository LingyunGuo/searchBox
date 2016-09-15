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
                html += "   <li class='" + this.result_tag[i] + "-showMore'>Show More</li>";
            }
            html += "</ul>";
            this.template = $.parseHTML(html);
        }
        this.template = $(this.template);
        this.lazySearch = (undefined === option.lazySearch ? true : option.lazySearch);
        this.disappearOnBlur = (undefined === option.disappearOnBlur ? true : option.disappearOnBlur);
        this.showOnClick = option.showOnClick;
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

        this.search_box.keyup(function (keyEvent) {
            keyUp.call(that, keyEvent);
        });

        this.result_panel.clearPanel = clearPanel;
    };

    searchBox.prototype.show = function () {
        this.result_panel.css("display", "block");
    };
    searchBox.prototype.hide = function (clearOnHide) {
        this.result_panel.css("display", "none");
        if (clearOnHide) {
            this.result_panel.clearPanel.call(this);
        }
    };
    searchBox.prototype.search = function (query, autoShow) {
        if (undefined !== query) {
            this.query = query;
        }
        getResult.call(this);
        if (autoShow) {
            this.result_panel.css("display", "block");
        }
    };
    searchBox.prototype.clear = function () {
        this.result_panel.clearPanel();
    };



    function quitSearch() {
        this.search_box.val("");
        this.result_panel.clearPanel.call(this);
    }

    function clearPanel() {
        this.result_panel.empty();
    }


    function keyUp(keyEvent) {
        var that = this;
        if (keyEvent.keyCode === 27) {
            return quitSearch.call(that);
        }
        // if (keyEvent.keyCode === 13) {
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
        // }
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
        that.result_panel.css("display", "block");
        that.result_panel.clearPanel.call(that);
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
    }

} ());