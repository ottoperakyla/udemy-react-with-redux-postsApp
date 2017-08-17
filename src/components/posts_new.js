import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { createPost } from '../actions'

import Multiselect from 'react-widgets/lib/Multiselect'

const renderMultiselect = ({ meta, label, input, data, valueField, textField }) =>
  <div className="form-group">
  <label>{label}</label>
  <Multiselect {...input}
    onBlur={() => input.onBlur()}
    value={input.value || []} // requires value to be an array
    data={data}
    valueField={valueField}
    textField={textField}
  />
  {meta.touched ? meta.error : ''}
  </div>

class PostsNew extends Component {
  renderField(field) {
    const { meta: { touched, error }, label, input } = field // destructuring madness
    const className = `form-group ${touched && error ? 'has-danger' : ''}`

    return (
      <div className={className}>
        <label>{label}</label>
        <input
          className="form-control"
          type="text"
          {...input} /* input in an object that contains redux-form related event handlers and props */
        />
        <div className="text-help">
        {touched ? error : ''} {/* the meta.error comes from the validate function below
                              the <field> "name" property must map to corresponding key
                              in the errors object in the validate function 
                              the error property is either the error messag OR
                              an empty string (if the field value is valid...)
                              */}
        </div>
      </div>
    )
  }

  onSubmit(values) {
    // this === component since we binded it
    // when we passed it in handleSubmit()
    // since everything is valid here
    // we can now post it to the backend api :)
    this.props.createPost(values, () => {
      this.props.history.push('/') // this.props.history is provided to the component by <Route>
    })
  } 

  render() { 
    const { handleSubmit } = this.props

    return (
      /* 
      redux-form passes the handleSubmit function to the components props 
      handleSubmit runs redux-form code which validates the form
      and if form is valid, then we will call the callback passed in
      in this case its "this.onSubmit". onSubmit needs to be binded
      so that "this" will point to our component and not redux...
      */
      <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
        <Field
          label="Title"
          name="title"
          component={this.renderField}
        />
        <Field
          label="Categories"
          name="categories"
          component={this.renderField}
        />
        <Field
          label="Post Content"
          name="content"
          component={this.renderField}
        />
        <Field
          label="Favourite animal"
          name="favourite_animal"
          component={renderMultiselect}
          data={[ 'cat', 'dog', 'horse' ]}/>
        <button type="submit" className="btn btn-primary">Submit</button>
        <Link to="/" className="btn btn-danger">Cancel</Link>
      </form>
    )
  }
}

function validate(values) {
  // values is object like { title: 'asdf', categories: 'adsf' }

  // the errors object needs to have keys that are mapped
  // to the corresponding <field> "name"-properties, e.g. "title", "categories" and "content"
  const errors = {}

  // Validate the inputs from 'values'
  if (!values.title) { 
    errors.title = 'Enter a title!'
  }
  if (values.title && values.title.length < 3) {
    errors.title = 'Enter a title that is atleast 3 characters long!'
  }
  if (!values.categories) {
    errors.categories = 'Enter some categories!'
  }
  if (!values.content) {
    errors.content = 'Enter some content plz!'
  }
  if (!values.favourite_animal) {
    errors.favourite_animal = 'Plz select some animal :)'
  }

  // If errors is empty, the form is fine to submit
  // If errors has *any* properties, redux form assumes form is invalid
  return errors
}

// this is how you combine the reduxForm() and the connect() helper
export default reduxForm({
  form: 'PostsNewForm', // this is a identifier for the form that redux-form uses internally
  validate
})(
  connect(null, { createPost })(PostsNew)
)
