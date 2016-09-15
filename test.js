$(document).ready(function () {
    var test = new searchBox({
        "ajax_url": "/_search",
        disappearOnBlur: false,
        result_tag: ["line", "block"]
    }, $("#searchBox"), $("#searchBox_result"));

    // var test2 = new searchBox({
    //     "ajax_url": "/_search"
    // }, $("#anotherSearchBox"), $("#anotherSearchBox_result"));
});