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
            this.template = $.parseHTML("<ul class='container'><li class='line line-text'></li><li class='block'><p class='block-text'></p></li></ul>");
        }
        this.template = $(this.template);
        // this.result_panel.css({
        //     "max-height": option.resultPanelMaxHeight ? option.resultPanelMaxHeight : '500px',
        //     width: option.resultPanelWidth ? option.resultPanelWidth : '800px'
        // });
        this.lazySearch = (undefined === option.lazySearch ? true : option.lazySearch);
        this.disappearOnBlur = (undefined === option.disappearOnBlur ? true : option.disappearOnBlur);


        this.search_box.keyup(function (keyEvent) {
            keyUp.call(that, keyEvent);
        });

        this.result_panel.clearPanel = clearPanel;

        return this.search_box;
    };

    function quitSearch() {
        this.search_box.val("");
        this.result_panel.clearPanel();
    }

    function clearPanel() {
        $(this).empty();
    }


    function keyUp(keyEvent) {
        var that = this;
        if (keyEvent.keyCode === 27) {
            return quitSearch.call(that);
        }
        // if (keyEvent.keyCode === 13) {
        getResult.call(that);
        // }
    }

    function getResult(category, callback) {
        var that = this;
        that.query = that.search_box.val();

        function ajaxCall() {
            // harcode in data for now
            displayResult.call(that, that.result_panel, {
                "line": [
                    "First Line in Result",
                    "Second Line in Result"
                ],
                "block": [
                    "This is supposed to be a HUGE chunk of data",
                    "But it's not right now"
                ]
            });
        }

        if (that.lazySearch) {
            if (that.loading) {
                clearTimeout(that.loading);
            }
            that.loading = setTimeout(ajaxCall, 200);
        }
        else {
            ajaxCall();
        }

    }

    function displayResult(panel, data) {
        var that = this;
        that.result_panel.clearPanel();
        that.result_panel.append(that.template);
        for (var i = 0; i < that.result_tag.length; i++) {
            var currentTag = that.result_tag[i];
            var currentData = data[currentTag];
            var currentTemplate = that.template.find("." + currentTag);
            var prevItem;
            console.log("currentTag", currentTag);
            for (var j = 0; j < currentData.length; j++) {
                console.log("currentData", currentData[j]);
                currentTemplate.parent().find("." + currentTag + "-text").text(currentData[j]);
                console.log("currentTemplate", currentTemplate.html());
                if (prevItem) {
                    prevItem.after(currentTemplate);
                }
                prevItem = currentTemplate;
                currentTemplate = prevItem.clone();
            }
        }
    }

    // function arrangeLayout() { }

    // function useTemplate(data, template, callback) {
    //     var container = $.parseHTML(template);
    // }
} ());