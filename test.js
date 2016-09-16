$(document).ready(function () {
    var test = new searchBox({
        "ajax_url": "http://localhost:8081/search/",
        disappearOnBlur: true,
        searchOnEnter: true,
        attachToSearchBox: true,
        attemptToFitIn: "resize",
        // templateUrl: "template.html",
        searchAtStart: true,
        showAmount: 1,
        result_tag: ["line", "block"]
    }, $("#searchBox"), $("#searchBox_result"));

    // var test2 = new searchBox({
    //     "ajax_url": "/_search"
    // }, $("#anotherSearchBox"), $("#anotherSearchBox_result"));
});