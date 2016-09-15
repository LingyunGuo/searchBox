# searchBox
A jQuery searchbox plug-in.

To enable this searchBox plug-in on the page, you need three parameters: configuration option, search box element and result panel element.

## Configuration Option

#### ajax_url: String       **required**
The url for retrieving search results (GET).
#### result_tag: Array[String]      **required**
The tag used to specify different group of data coming in from the ajax call. For example, if you have two groups of data, "line" and "block" respectively, then the `result_tag` option should be
```
result_tag: ["line","block"]
```
The order in result_tag matters.
#### templateUrl: String
The url used to read in result display template, if no templateUrl is set, the searchBox would use its default template.
#### lazySearch: Bool
A boolean that determine whether to do the search everytime a character is entered, or only perform ajax call when the user stops typing. Default to be `true` (only search when typing stops).
#### showAmount: Number || Object
The value decides how many data entries would be displayed for **each** data group.
If this is not being set, then every data group would display all the value it contains.
If this is set to a number, then all data groups would display the same number of data entries(if they could).
This can also be set to an object, which would look like:
```
{
    "line": 1,
    "block": undefined
}
```
This means that only display one data entry for "line" group, and display all data in "block" group. The "block" key-value pair can be omitted.

## Search Box Element       **required**
The element pointer to the input box where user enters query. Should be a jQuery element.

## Result Panel Element     **required**
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
The default template is:
```
<ul class='container'>
    <li class='tag tag-text'></li>
    <li class="tag-showMore'>Show More</li>
</ul>
```
where `tag` would be replaced by "line" and "block". With the JSON result and `showAmount` option showing above,  we would eventually get:
```
<ul class="container">
    <li class="line line-text">line1</li>
    <li class="line-showMore">Show More</li>
    <li class="block block-text">block1</li>
    <li class="block block-text">block2</li>
</ul>
```