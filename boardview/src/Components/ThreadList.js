import React, { Component } from 'react'
import Thread from './Thread';
import axios from 'axios'

export default class ThreadList extends Component {
    state ={
        allThreads:[],
        newThread:''
    }

    componentDidMount(){
        this.getAllThreads()
    }


    getAllThreads = async () => {
         const allThreads =  await axios.get(`//localhost:3000/work/board/getAllThreads`)
         const {data} = allThreads;
         this.setState({
             allThreads:data
         })
    }

    onInput = (e) => {
        this.setState({newThread:e.target.value})
    }

    onWriteConfirm = async () => {
        const {newThread} = this.state;
        console.log(newThread)
        const writeResult = await axios.post(`//localhost:3000/work/board/write`, {newThread})
        console.log(writeResult)
    }


    render() {
        const {allThreads} = this.state;

        return (
        <div className="threadList" style={{border:'solid 1px lightsteeblue', padding:'5%'}}>
            <div className="writeThread">
                <input className="writeInput" placeholder="write" onChange={(e)=>this.onInput(e)}/>
                <button className="writeConfirm" onClick={this.onWriteConfirm}>post</button>           
            </div>
           
            <div>ThreadTop</div>
            {
                allThreads.map((el,i) => 
                <Thread key={i} 
                        seq={el.idx} 
                        writer={el.writer} 
                        title={el.title} 
                        hit={el.hit} 
                        regDate={String(el.regdate).split('T')[0]} />
            )}      
        </div>
        )
  }
}
