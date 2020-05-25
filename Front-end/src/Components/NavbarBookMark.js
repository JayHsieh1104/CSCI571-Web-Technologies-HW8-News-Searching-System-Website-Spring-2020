import React from 'react';
import { FaBookmark, FaRegBookmark } from "react-icons/fa";


class NavbarBookMark extends React.Component {
    render() {
        if(this.props.isInBookMark) {
            return (
                <FaBookmark style={{fontSize: '1rem', color: 'white'}} />
            )
        }
        else {
            return (
                <FaRegBookmark style={{fontSize: '1rem', color: 'white'}} />
            )
        }       
    }
}

export default NavbarBookMark;