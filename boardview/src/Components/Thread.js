import React, { Component } from 'react'
import ThreadContent from './ThreadContent'
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
        <div className="oneThread" style={{display:'flex', flexDirection:"column"}}>
            <div className="threadNav" style={{display:'flex', border:'solid 1px black'}} onClick={(e)=>this.openOneThread(e.target)}>
                <div className="seq" style={{display:'flex', flex:1, borderRight:'solid 1px black', padding:'1%'}}>{this.props.seq}</div>
                <div className="writer" style={{display:'flex', flex:2, borderRight:'solid 1px black', padding:'1%'}}>{this.props.writer}</div>
                <div className="title" style={{display:'flex',flex:6, borderRight:'solid 1px black', padding:'1%'}}>{this.props.title}</div>
                <div className="hit" style={{display:'flex',flex:1, borderRight:'solid 1px black', padding:'1%'}}>{this.props.hit}</div>
                <div className="regDate" style={{display:'flex',flex:2, padding:'1%'}}>{this.props.regDate}</div>
            </div>
            {
                currentThread!=='' && <ThreadContent openThread={openThread}/>
            }        
        </div>
        )
  }
}
