import React, { Component } from 'react'
import ThreadList from './ThreadList';


export default class BoardMain extends Component {



    render() {

        return (
            <div className="boardmain">
            boardmain
                {/* title */}
                {/* username,level */}
                <ThreadList/>
                {/* searchinput */}
                {/* write */}
                {/* no page but infinitescroll? */}
            </div>
        )
  }
}
