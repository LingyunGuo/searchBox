$(document).ready(function () {
    var test = new searchBox({
        "ajax_url": "/_search",
        disappearOnBlur: false,
        showAmount: 1,
        result_tag: ["line", "block"]
    }, $("#searchBox"), $("#searchBox_result"));


    // var test2 = new searchBox({
    //     "ajax_url": "/_search"
    // }, $("#anotherSearchBox"), $("#anotherSearchBox_result"));
});