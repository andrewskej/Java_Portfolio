import React, { Component } from 'react'

export default class ThreadContent extends Component {
  render() {
      const {openThread} = this.props
    return (
        <div className="threadContent" style={{padding:'5%', border:'solid 1px black', borderBottom:'none'}}>
            <div className="contentInfo" style={{display:'flex', justifyContent:'space-between', marginBottom:'3%'}}>
                <div className="contentTitle" style={{fontSize:'20px',fontWeight:'bolder'}}>
                    {openThread.title}
                </div>
                <div className="contentWriter">
                writer: {openThread.writer}
                </div>
                <div className="contentRegDate">
                date: {String(openThread.regdate).split('T')[0] + '  '+ String(openThread.regdate).split('T')[1].split('.')[0]}
                </div>
            </div>
            <div className="content">
                {openThread.content}
            </div>
        </div>
    )
  }
}
