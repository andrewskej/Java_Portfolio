import React, { Component } from 'react'
import Thread from './Thread';
import axios from 'axios'

export default class ThreadList extends Component {
    state ={
        allThreads:[],
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


    

    render() {
        const {allThreads} = this.state;

        return (
        <div className="threadList" style={{border:'solid 1px lightsteeblue', padding:'5%'}}>
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
