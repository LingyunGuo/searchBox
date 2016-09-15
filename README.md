# searchBox
A jQuery searchbox plug-in.

To enable this searchBox plug-in on the page, you need three parameters: configuration option, search box element and result panel element.

===
## Configuration Option

#### ajax_url: String   *required*
The url for retrieving search results (GET).
#### result_tag: Array[String]  *required*
The tag used to specify different group of data coming in from the ajax call. For example, if you have two groups of data, "line" and "block" respectively, then the `result_tag` option should be
```
result_tag: ["line","block"]
```
The order in result_tag matters.
#### templateUrl: String
The url used to read in result display template, if no templateUrl is set, the searchBox would use its default template.
#### lazySearch: Bool
A boolean that determine whether to do the search everytime a character is entered, or only perform ajax call when the user stops typing. Default to be `true` (only search when typing stops).

---

## Search Box Element   *required*
The element pointer to the input box where user enters query. Should be a jQuery element.

---

## Result Panel Element *required*
The element pointer to the element where search results are displayed. Should be a jQuery element.

===
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
===
## Template Format
Still, assume we have two groups of data, "line" and "block". Then in the template, we have to define four classes: `.line`, `.line-text`, `.block`, `.block-text`.
`.line` and `.block` is what would get repeated for every data entry in the result JSON, while `.line-text` and `.block-text` are where the data actually goes in.
The default template is:
```
<ul class='container'>
    <li class='line line-text'></li>
    <li class='block'><p class='block-text'></p></li>
</ul>
```
With a result:
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
We would eventually get:
```
<ul class="container">
    <li class="line line-text">line1</li>
    <li class="line line-text">line2</li>
    <li class="block">
        <p class="block-text">block1</p>
    </li>
    <li class="block">
        <p class="block-text">block2</p>
    </li>
</ul>
```
Note that the data for blocks go one level deeper.