import React, { Component } from 'react'

export default class Comments extends Component {
  render() {
      const{cmt,i} = this.props
    return (
        <div className="comment" key={i}>
            <div> {cmt.cmtNo} </div>
            <div> {cmt.cmt} </div>
            <div> {cmt.cmtWriter} </div>
            <div> {cmt.cmtDate} </div>
        </div>
    )
  }
}
