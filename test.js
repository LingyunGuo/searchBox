$(document).ready(function () {
    var test = new searchBox({
        "ajax_url": "http://localhost:8081/search/",
        disappearOnBlur: false,
        searchAtStart:true,
        // searchOnEnter: true,
        attachToSearchBox: true,
        attemptToFitIn: "resize",
        // templateUrl: "template.html",
        showAmount: 1,
        result_tag: ["line", "block"]
    }, $("#searchBox"), $("#searchBox_result"));

    var test2 = new searchBox({
        "ajax_url": "http://localhost:8081/search/",
        showAmount: 1,
        templateUrl: "template.html",
        result_tag: ["line", "block"]
    }, $("#anotherSearchBox"), $("#anotherSearchBox_result"));
});