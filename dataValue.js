//object of data value
//@input object: original js object
//@input template: a jQuery object with data
//@input action: a function with optional parameter 'parameter' and its value
class DataValue {
    constructor(object, template, action) {
        this.data = object;
        this.template = template;
        this.action = action;
        this.template.setDataValue(this.data, null, action);
    }


    //set object
    setData (object) {
        this.data = object;
        this.template.setDataValue(this.data, null, action);
    };

    //set action
    setAction (action) {
        this.action = action;
        this.template.setDataValue(this.data, null, action);
    };
}

//get object with name of data-value
//@input template: a jQuery object with data
//@input action: a function with optional value of 'data-value' parameter
jQuery.fn.getDataValue = function (action, parentObject, level) {
    "use strict";
    var object = {},
        template = jQuery(this);
    if (level == null) {
        level = 1;
    }
    //get each data value
    jQuery(this).find("[data-value]").each(function () {
        var parameter;
        //load data when parameter not in child object
        if (jQuery(this).attr("data-value").split(".").length === level) {
            //set parameter name
            parameter = jQuery(this).attr("data-value").split(".")[level - 1];

            //set data
            if (jQuery(this).is("input[type='checkbox']") || jQuery(this).is("input[type='radio']")) {
                if (jQuery(this).is(":checked")) {
                    object[parameter] = jQuery(this).val();
                }
            } else if (jQuery(this).is("select")) {
                object[parameter] = jQuery(this).find("option:selected").val();
            } else if (jQuery(this).is("input") || jQuery(this).is("textarea")) {
                object[parameter] = jQuery(this).val();
            } else {
                object[parameter] = jQuery(this).text();
            }
        } else if (jQuery(this).attr("data-value").split(".").length > level) {
            //set parameter name
            parameter = jQuery(this).attr("data-value").split(".")[level - 1];

            //get data
            object[parameter] = template.getDataValue(action, object, level + 1);
        } //TODO load data when parameter in child object

        //call action
        if (action != null) {
            //set parameter name
            parameter = jQuery(this).attr("data-value").split(".")[level - 1];

            //get data from action
            var data = action.call(jQuery(this), jQuery(this).attr("data-value"));
            if (data != null) {
                object[parameter] = data;
            }
        }
    });

    return object;
}

//set template data-value to the value of the parameter whose name is the value of data-value
//@input object: a non-array js object for data source
//@input template: a jQuery object for data filling in
//@input action: a function with optional parameter 'parameter' and its value
jQuery.fn.setDataValue = function (object, parentObject, action) {
    "use strict";
    var parameter,
        template = jQuery(this);

    //check parameter full requirement
    if (object == null) {
        throw "Null Object Exception";
    } else if (template == null) {
        throw "Null Template Exception";
    }

    //fill in parameter
    for (parameter in object) {
        //set up data-value
        if (object[parameter] != null && !Array.isArray(object[parameter])) {
            //fill in data-value if parameter is not an array
            if (parentObject == null) {
                parentObject = "";
            }

            //fill in data
            if (template.find("[data-value='" + parentObject + parameter + "']").is("input[type='checkbox']")) {
                //checkbox
                template.find("[data-value='" + parentObject + parameter + "']").prop("checked", object[parameter]);
            } else if (template.find("[data-value='" + parentObject + parameter + "']").is("input[type='radio']")) {
                //radio
                template.find("[data-value='" + parentObject + parameter + "']").prop("checked", false);
                template.find("[data-value='" + parentObject + parameter + "'][value='" + object[parameter] + "']").prop("checked", true);
            } else if (template.find("[data-value='" + parentObject + parameter + "']").is("input") ||
                template.find("[data-value='" + parentObject + parameter + "']").is("textarea")) {
                //input or text area
                template.find("[data-value='" + parentObject + parameter + "']").val(object[parameter]);
            } else if (template.find("[data-value='" + parentObject + parameter + "']").is("select")) {
                //select
                template.find("[data-value='" + parentObject + parameter + "'] option").prop("selected", false);
                template.find("[data-value='" + parentObject + parameter + "'] option[" + object[parameter] + "]").prop("selected", true);
            } else {
                //others
                template.find("[data-value='" + parentObject + parameter + "']").html(object[parameter]);
            }

            //set data if parameter is another object
            if (parameter != 0) {
                if (parentObject != "") {
                    template.setDataValue(object[parameter], parentObject + parameter + ".");
                } else {
                    template.setDataValue(object[parameter], parameter + ".");
                }
            }
        } else if (object[parameter] != null && Array.isArray(object[parameter]) && template.find("#" + parameter.split("List")[0] + "Template").length > 0) {
            //fill in target template if parameter is an array and target template can be found
            //TODO not tested yet
            jQuery.each(object[parameter], function (i, eachObject) {
                var parameterTemplate = jQuery(document.querySelector("#" + parameter + "Template").content.querySelector("div.dataValueTemplate")).clone();
                template.find("[data-value='" + parameter.split("List")[0] + "']").html(eachObject);
                template.append(parameterTemplate);
                template.find("[data-value='" + parameter + "']").setDataValue(eachObject, parameter.split("List")[0] + ".");
            });
        }

        //call action
        if (action != null) {
            action.call(template, parameter, object[parameter]);
        }
    }
}
