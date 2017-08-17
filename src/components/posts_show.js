import React, { Component } from 'react'
import { fetchPost, deletePost } from '../actions'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

class PostsShow extends Component {
  componentDidMount() {
    const { id } = this.props.match.params
    this.props.fetchPost(id)
  }

  onDeleteClick() {
    const { id } = this.props.match.params

    // do not use this.props.post.id here! we dont know if the ajax has finished yet
    // its safer to use this.props.match.params instead
    this.props.deletePost(id, () => {
      this.props.history.push('/')
    }) 
  }
 
  render() {
    const { post } = this.props

    if (!post) {
      return <div>Loading...</div>
    }

    return (
      <div>
        <Link to="/">Back To Index</Link>
        <button
          className="btn btn-danger pull-xs-right"
          onClick={this.onDeleteClick.bind(this)}
        >
        Delete Post
        </button>
        <h3>{post.title}</h3>
        <h6>Categories: {post.categories}</h6>
        <p>{post.content}</p>
      </div>
    ) 
  }
}

// we need to only get the currently selected post from state.posts
// ownProps is the props of *this* component
// so we get the current post by accessing posts[ownProps.match.params.id]
function mapStateToProps({ posts }, ownProps) {
  return { post: posts[ownProps.match.params.id] }
}

export default connect(mapStateToProps, { fetchPost, deletePost })(PostsShow)
