import React from 'react';
import { FaBookmark } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";

class ArticleBookMark extends React.Component {
    render(props) {
        if(this.props.isPushed) {
            return (
                <FaBookmark style={{fontSize: '1rem', color: 'red', cursor: 'pointer'}} />
            )
        }
        else {
            return (
                <FaRegBookmark style={{fontSize: '1rem', color: 'red', cursor: 'pointer'}} />
            )
        }   
    }
}

export default ArticleBookMark;