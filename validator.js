const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


const cancelElement = $("#btn-cancel");

cancelElement.onclick = function(){
    var invalidInputs =  $$(".form-group.invalid");
    Array.from(invalidInputs).forEach(input => {
        input.classList.remove('invalid');
        var errorMessage = input.querySelector(".form-message");
        errorMessage.innerText = "";
    })
}


function Validator(options) {

    function getParent(element, selector){
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            else{
                element = element.parentElement;
            }
        }
    }

    var selectorRules = {}

    function validate(inputElement, rule) {
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
        var errorMessage;

        var rules = selectorRules[rule.selector];
        
        for (var i = 0; i < rules.length; ++i) {
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    );
                    break;
                default:
                    errorMessage = rules[i](inputElement.value);
            }
            if (errorMessage) break;
        }
        
        if (errorMessage) {
            errorElement.innerText = errorMessage;
            getParent(inputElement, options.formGroupSelector).classList.add('invalid');
        } else {
            errorElement.innerText = '';
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
        }

        return !errorMessage;
    }

    //Get form element
    var formElement = $(options.form);

    if (formElement) {

        formElement.onsubmit = function (e){
            e.preventDefault();

            var isFormValid = true;

            options.rules.forEach(rule => {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid =  validate(inputElement, rule);
                if(!isValid){
                    isFormValid = false;
                }
            });

           
            if(isFormValid){
                if(typeof options.onSubmit === 'function' ){
                    var enableInputs = formElement.querySelectorAll('[name]');
                    var formValues = Array.from(enableInputs).reduce((values, input)=>{
                        values[input.name] = input.value
                        input.disabled = true;               
                        return values; 
                    }, {});

                    $("#btn-save").disabled = true;
                    $("#btn-cancel").disabled = true;

                    console.log( $("#btn-save"));
                    options.onSubmit(formValues);
                }
                else{
                    formElement.onSubmit();
                }
            }
        }

        options.rules.forEach(rule => {

            //Save rules for each input
            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test);
            }else{
                selectorRules[rule.selector] = [rule.test]
            }

            

            var inputElements = formElement.querySelectorAll(rule.selector);

            Array.from(inputElements).forEach(inputElement => {
                
                //solve case when blur out inputElement
                inputElement.onblur = function () {
                    validate(inputElement, rule);
                }

                //solve case when type in input
                inputElement.oninput = function(){
                    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
                    errorElement.innerText = "";
                    getParent(inputElement, options.formGroupSelector).classList.remove("invalid");
                }
                
            })

            
        });


    }
}

Validator.isRequired = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return value ? undefined : 'This field must be required';
        }
    }
}

Validator.isEmail = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : "This field must be email";
        }
    }
}

Validator.isNumber = function (selector, minLength) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^[0-9]+$/;
            if(regex.test(value)){
                if(value.length >= minLength)
                    return undefined;
                else 
                    return 'Phone number must have at least 10 digits';
            }
            else{
                return 'This field must be number type';
            }
        }
    }
}

Validator.isName = function(selector){
    return {
        selector: selector,
        test: function (value) {
            var regex = /^[a-zA-Z ]{2,30}$/;
            return regex.test(value) ? undefined : "Invalid Name";
        }
    }
}