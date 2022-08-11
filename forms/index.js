// import in caolan forms
const forms = require("forms");
// create some shortcuts
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets

var bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};

const createMouseForm = (brands) => {
    return forms.create({
        'name': fields.string({
            required: true,
            errorAfterField: true
            
        }),
        'cost': fields.string({
            required: true,
            errorAfterField: true,
            
        }),
        'description': fields.string({
            required: true,
            errorAfterField: true,
            
        }),
        'weight' : fields.number({
            required: true,
            errorAfterField: true
        }),
        'dpi': fields.number({
            required: true,
            errorAfterField: true
        }),
        'features': fields.string({
            required: true,
            errorAfterField: true
        }),
        'backlighting': fields.string({
            required: true,
            errorAfterField: true
        }),
        'height': fields.number({
            required: true,
            errorAfterField: true
        }),
        'width': fields.number({
            required: true,
            errorAfterField: true
        }),
        'length': fields.number({
            required: true,
            errorAfterField: true
        }),
        'numberOfButtons': fields.number({
            required: true,
            errorAfterField: true
        }),
        'connectivity': fields.string({
            required: true,
            errorAfterField: true
        }),
        'shape' : fields.string({
            required : true,
            errorAfterField : true
        }),
        'brand_id': fields.string({
            label: "Brand",
            required: true,
            errorAfterField: true,
            widget : widgets.select(),
            choices: brands
        })
    })
};

const createRegistrationForm = () => {
    return forms.create({
        'first_name' : fields.string({
            required: true,
            errorAfterField: true
        }),
        'last_name': fields.string({
            required: true,
            errorAfterField: true
        }),
        'email' : fields.string({
            required: true,
            errorAfterField: true
        }),
        'password': fields.password({
            required: true,
            errorAfterField: true
        }),
        'confirm_password': fields.password({
            required: true,
            errorAfterField: true,
            validators: [validators.matchField('password')]
        })
        
    })
}

const createLoginForm = () => {
    return forms.create({
        'email': fields.string({
            required: true,
            errorAfterField : true, 
        }),
        'password' : fields.password({
            required: true,
            errorAfterField: true
        })
    })
}

module.exports = { createMouseForm, bootstrapField, createLoginForm, createRegistrationForm};