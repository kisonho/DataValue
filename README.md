# DataValue
A light jQuery-based data binding javascript

## Get started
Import dataValue.js in HTML:
`<script src='route/to/dataValue/dataValue.js'></script>`

## Set up HTML tag properties
Set up a template, then use `data-value` property to set up the parameter name:
```
<div id='template'>
    <strong data-value='name'></strong>
    <span data-value='age'></span>
</div>
```

## Binding the data by instantiate DataValue class
*Instantiate a DataValue class to bind the data into HTML:*
```
var data = {
    name: "Kison Ho",
    age: 20
};
var dataValue = new DataValue(data, $("#template"));
```
> <div id='template'>
>     <strong data-value='name'>Kison Ho</strong>
>     <span data-value='age'>20</span>
> </div>

*To customize the binding method for each parameter, add a function parameter after the template parameter:*
```
var dataValue = new DataValue(data, $("#template"), function(parameter, data) {
    switch (parameter) {
    case "age":
        data += 10;
        $(this).text(data);
        break;
    }
});
```
> <div id='template'>
>     <strong data-value='name'>Kison Ho</strong>
>     <span data-value='age'>30</span>
> </div>

## Binding the data by calling jQuery function
*Set data to template:*
```
$("#template").setDataValue(data);
```
> <div id='template'>
>     <strong data-value='name'>Kison Ho</strong>
>     <span data-value='age'>20</span>
> </div>
*Customize function also available while setting the data:*
```
$("#template").setDataValue(data, function(parameter, data) {
    switch (parameter) {
    case "age":
        data += 10;
        $(this).text(data);
        break;
    }
});
```
*Get data from template:*
```
<div id='template'>
    <strong data-value='name'>Kison Ho</strong>
    <span data-value='age'>20</span>
</div>
```
Use `var data = $("#template").getDataValue();` can get an object of the template.
> {'name': 'Kison Ho', 'age': '20'}
Get function also supports customize function:
```
var data = $("#template").getDataValue(function(parameter, data) {
    switch (parameter) {
    case "age":
        data += 10;
        $(this).text(data);
        break;
    }
});
```
> {'name': 'Kison Ho', 'age': '30'}

## Binding object in an object
To bind an object with an object inside, just add '.' after the object name:
```
<div id='template'>
    <strong data-value='name'></strong>
    <span data-value='age'></span>
    <hr>
    <span data-value='plan.name'></span><br>
    <span data-value='when'></span>
</div>
```
And instantiate the DataValue class or call set/get functions as normal:
```
var data = {
    name: "Kison Ho",
    age: 20,
    plan: {
        name: 'Make a change',
        when: 'Now'
    }
};
var dataValue = new DataValue(data, $("#template"));
```
> <div id='template'>
>     <strong data-value='name'>Kison Ho</strong>
>     <span data-value='age'>20</span>
>     <hr>
>     <span data-value='plan.name'>Make a change</span><br>
>     <span data-value='plan.when'>Now</span>
> </div>
