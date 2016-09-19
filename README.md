# searchBox
A jQuery searchbox plug-in.

To enable this searchBox plug-in on the page, you need three parameters: configuration option, search box element and result panel element.

## Configuration Option

#### Options with ★ is required.

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
### searchOnEnter: Boolean
A boolean that determines whether to perform search whenever typing stops or only when `Enter` key is pressed. **Default to be `false`.**
If this is set to true, then the `lazySearch` option is ignored.
### searchAtStart: Boolean
A boolean that determines whether to perform a search at the very beginning where user clicks on the search box and hasn't entered any query yet. This can be used to display suggestions, query cheatsheets, and so on.
### attachToSearchBox: Boolean
A boolean that controls whether the result panel should be attached to the search box, so that it always appears at the bottom of search box if possible.**Default to be `false`.**
### attemptToFitIn: String
This value decides whether the result panel should always try to fit itself in the window. 

If this is set to `auto`, then when the space available is too small for the result panel, the panel would try to place itself on the right or the top. 

If it is set to `resize`, then the panel will first try to move the position to fit itself in, and in the case that it still cannot fit in, it would decrease the size of itself, and add scrollbar if necessary. 

If this is set to `none`, the result panel would always be at the right bottom of the search box, no matter it would be fullly displayed or not.

Note that this would have no effect if `attachToSearchBox` is set to `false`, since in that case the result panel would not move, and should always have enough space.
### showAmount: Number || Object
The value decides how many data entries would be displayed for **each** data group.


If this is set to a number, then all data groups would display the same number of data entries(if they could). This can also be set to an object, which would look like:
```
{
    "line": 1,
    "block": undefined
}
```
This means that only display one data entry for "line" group, and display all data in "block" group. The "block" key-value pair can be omitted.

**Default to have every data group display all the value it contains.**
### toggleDataFcn: Function
User can set a function to decide when to show all the results for one group, and when to hide extra results. This function should return `true` when all the results will be displayed, `false` otherwise. This should always be set if a custom template is used.

## Search Box Element       
The element pointer to the input box where user enters query. Should be a jQuery element.

## Result Panel Element     
The element pointer to the element where search results are displayed. Should be a jQuery element.

## Result JSON Format
Assume the data contains two groups of items, "line" and "block", that would like to be displayed in different ways, then the result from ajax call should be something like:
```
{
    "line": [                       // name of data group
        [
            {
                "type":"text",      // name of element type, 
                                    // this would match elements with class "line-text"
                "index":"0",        // the index of this element among elements with same type
                "value":{
                    "text":...      // values and attributes of this element
                }
            },
            {
                "type":"img",
                "index":"0",
                "value":{
                    "src":...
                    "class":...
                }
            },
            {
                "type":"img",
                "index":"1",
                "value":{
                    "src":...
                    "class":...
                }
            },
            ...
        ],
        ...
    ],
    "block": [
        [
            {
                "type":"text",
                "index":"0",
                "value":{
                    "text":...
                    "id":...
                }
            }
        ],
        [
            {
                "type":"text",
                "index":"0",
                "value":{
                    "text":...
                }
            }
        ]
    ]
})
```
The keys ("line","block") have to match what is in the `result_tag` option, but the order doesn't have to be exactly the same.


The JSON is expected to match what is in the template. Any element that exists in the JSON but not in the template would be ignored. However, if an element is in the template, but there is no related data coming back, then it would be deleted, it would remain what it is like as in the template.

Each element in the list must have all three fields: `type`, `index` and `value`. Entries in the same group should have same list of elements. You can define any element type as you like. As for the `value` object, the valid keys are `text`, `src`, `href`, `id`, `html`, `title`, `alt`, and `class`, all the others would be ignored.

## Template Format
For each tag in the `result_tag` list, you must define a `tag-item` class in the template. This would be the unit that repeats for every data entry under the group with that tag in the JSON data. 

A `tag-title` class is also useful for having a title element for each group of data, however, this is not mandatory.

Besides these two classes that are mentioned above, you can define any other classes with prefix `tag-` in the template, they would be automatically matched with the data coming from AJAX if possible. These classes should have corresponding data in the JSON, otherwise they won't be added into the result panel.

<a name="defaultTemplate"></a>The default template is:
```
<ul class='container'>
    <h3 class="tag-title"><span class="search-toggle-btn"><a href="#" class="tag"></a></span></h3>
    <li class="tag tag-item"><p class="tag tag-text"></p><img class="tag tag-img"/></li>Ï
</ul>
```
where `tag` would be replaced by tags like "line" and "block". 
## API

### searchBox.show()
This function shows the result panel. It would not change the content of result panel.
### searchBox.hide(clearOnHide: Boolean)
This function hides the result panel. If `clearOnHide` is set to true, all the content in result panel would be deleted.
### searchBox.clear()
This function clears the result panel. It would use the custom version of clear function, if there is any.
### searchBox.search(query: String, show: Boolean)
This function would try to retrieve the search result with given query. If no query is given, it would use the value in the searchbox. `show` decides whether the result panel should be shown after the search is performed. If the result panel is hidden and `show` is set to false, then it would remain being hidden until `searchBox.show()` is called. **`show` is default to be `true`.**