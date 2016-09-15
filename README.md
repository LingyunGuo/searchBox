# searchBox
A jQuery searchbox plug-in.

To enable this searchBox plug-in on the page, you need three parameters: configuration option, search box element and result panel element.

## Configuration Option

### ajax_url: String       ★
The url for retrieving search results (GET).
### result_tag: Array[String]      ★
The tag used to specify different groups of data coming in from the ajax call. For example, if you have two groups of data, "line" and "block" respectively, then the `result_tag` option should be
```
result_tag: ["line","block"]
```
The order in result_tag matters.
### templateUrl: String
The url used to read in result display template, if no templateUrl is set, the searchBox would use its default template ([See here](#defaultTemplate)).
### lazySearch: Boolean
A boolean that determines whether to do the search everytime a character is entered, or only perform ajax call when the user stops typing. **Default to be `true` (only search when typing stops).**
### disappearOnBlur: Boolean
A boolean that controls whether the result panel should disappear when both search box and result panel is not focused. **Default to be `false`.**
### showOnClick: Boolean
A boolean that controls whether the result panel should pop up when search box is clicked. **Default to be `false`.**

This would have no effect if disappearOnBlur is not set or set to be false, since the result panel would always be on the page.
### searchOnEnter: Boolean
A boolean that determines whether to perform search whenever typing stops or only when `Enter` key is pressed. **Default to be `false`.**
If this is set to true, then the `lazySearch` option is ignored.
### searchAtStart: Boolean
A boolean that determines whether to perform a search at the very beginning where user clicks on the search box and hasn't entered any query yet. This can be used to display suggestions, query cheatsheets, and so on.
### attachToSearchBox: Boolean
A boolean that controls whether the result panel should be attached to the search box, so that it always appears at the bottom of search box if possible.**Default to be `false`.**
### showAmount: Number || Object
The value decides how many data entries would be displayed for **each** data group.

**Default to have every data group display all the value it contains.**

If this is set to a number, then all data groups would display the same number of data entries(if they could). This can also be set to an object, which would look like:
```
{
    "line": 1,
    "block": undefined
}
```
This means that only display one data entry for "line" group, and display all data in "block" group. The "block" key-value pair can be omitted.

#### Options with ★ is required.

## Search Box Element       ★
The element pointer to the input box where user enters query. Should be a jQuery element.

## Result Panel Element     ★
The element pointer to the element where search results are displayed. Should be a jQuery element.

## Result JSON Format
Assume the data contains two groups of items, "line" and "block", that would like to be displayed in different ways, then the result from ajax call should be something like:
```
{
    "line":[
        "line1","line2",...
    ],
    "block":[
        "block1","block2",...
    ]
}
```
The keys ("line","block") have to match what is in the `result_tag` option, but the order doesn't have to be exactly the same.

## Template Format
Still, assume we have two groups of data, "line" and "block". Then in the template, we have to define six classes: `.line`, `.line-text`, `line-showMore`, `.block`, `.block-text`, `block-showMore`.

`.line` and `.block` are what would get repeated for every data entry in the result JSON, `.line-text` and `.block-text` are where the data actually goes in, while `.line-showMore` and `.block-showMore` would only appear at the end when `showAmount` is set and the result is not fully displayed.

<a name="defaultTemplate"></a>The default template is:
```
<ul class='container'>
    <li class='tag tag-text'></li>
    <li class="tag-showMore' search-data-tag='tag'><a href='#'>Show More</a></li>
</ul>
```
where `tag` would be replaced by "line" and "block". With the JSON result and `showAmount` option showing above,  we would eventually get:
```
<ul class="container">
    <li class="line line-text">line1</li>
    <li class="line-showMore" search-data-tag='line'><a href='#'>Show More</a></li>
    <li class="block block-text">block1</li>
    <li class="block block-text">block2</li>
</ul>
```
If you click on the `Show More` button, it would remove itself and add in all the data entries that was omitted before.
## API

### searchBox.show()
This function shows the result panel. It would not change the content of result panel.
### searchBox.hide(clearOnHide: Boolean)
This function hides the result panel. If `clearOnHide` is set to true, all the content in result panel would be deleted.
### searchBox.clear()
This function clears the result panel. It would use the custom version of clear function, if there is any.
### searchBox.search(query: String, show: Boolean)
This function would try to retrieve the search result with given query. If no query is given, it would use the value in the searchbox. `show` decides whether the result panel should be shown after the search is performed. If the result panel is hidden and `show` is set to false, then it would remain being hidden until `searchBox.show()` is called. **`show` is default to be `true`.**