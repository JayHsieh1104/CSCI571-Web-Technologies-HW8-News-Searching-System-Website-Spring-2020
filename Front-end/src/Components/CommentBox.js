import React from 'react';
import commentBox from 'commentbox.io';

class CommentBox extends React.Component {
    componentDidMount() {
        this.removeCommentBox = commentBox('5678853280235520-proj');
    }

    componentWillUnmount() {
        this.removeCommentBox();
    }

    render() {
        return (
            <div className="commentbox" id={this.props.articleID}></div>
        );
    }
}

export default CommentBox;