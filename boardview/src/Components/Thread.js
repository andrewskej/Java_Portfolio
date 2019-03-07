import React, { Component } from 'react'
import axios from 'axios'

export default class Thread extends Component {

    state={
        currentThread:'',
        openThread:[]
    }


    openOneThread =  (target) => {
        const selected = target.parentNode.firstChild.innerText;
        const {currentThread} = this.state;
        currentThread!=='' && this.closeOneThread()
        if(currentThread===selected){
            this.closeOneThread()
        }else{
            setTimeout(async ()=> {
                const oneThread = await axios.get(`//localhost:3000/work/board/getThread/${selected}`);
                const {data} = oneThread
                const [openThread] = data
                this.setState({
                    currentThread:selected,
                    openThread:openThread
                })
            }, 300)
        }
    }

    closeOneThread = () => {
        this.setState({
            currentThread:'',
            openThread:[]
        })
    }


    render() {
        const {currentThread, openThread} = this.state
        return (
        <div className="oneThread" style={{display:'flex', flexDirection:"column", border:'solid 1px red'}}>
            <div className="threadNav"  style={{display:'flex', border:'solid 1px black', padding:'5%'}} onClick={(e)=>this.openOneThread(e.target)}>
                <div className="seq" style={{display:'flex', flex:1, border:'solid 1px black', padding:'5%'}}>{this.props.seq}</div>
                <div className="writer" style={{display:'flex', flex:2, border:'solid 1px black', padding:'5%'}}>{this.props.writer}</div>
                <div className="title" style={{display:'flex',flex:5, border:'solid 1px black', padding:'5%'}}>{this.props.title}</div>
                <div className="hit" style={{display:'flex',flex:1, border:'solid 1px black', padding:'5%'}}>{this.props.hit}</div>
                <div className="regDate" style={{display:'flex',flex:4, border:'solid 1px black', padding:'5%'}}>{this.props.regDate}</div>
            </div>
            {
                currentThread!=='' &&
                <div className="threadContent" style={{padding:'5%'}}>
                    <div className="contentTitle" style={{fontSize:'20px',fontWeight:'bolder'}}>
                        {openThread.title}
                    </div>
                    <div className="contentInfo" style={{display:'flex', justifyContent:'space-between'}}>
                        <div className="contentWriter">
                        writer: {openThread.writer}
                        </div>
                        <div className="contentRegDate">
                        date: {String(openThread.regdate).split('T')[0]+String(openThread.regdate).split('T')[1].split('.')[0]}
                        </div>
                    </div>
                    <div className="content">
                        {openThread.content}
                    </div>
                </div>
            }        
        </div>
        )
  }
}
