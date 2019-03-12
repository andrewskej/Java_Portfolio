import React, { Component } from 'react'
import axios from 'axios'
import Comments from './Comments'
export default class ThreadContent extends Component {

    state={
        comments:[]
    }

    componentDidMount(){
        this.getComments(this.props.openThread.idx)
    }

    getComments = async (seq) => {
        const comments = await axios.get('//localhost:3000/work/board/getComments/'+seq)
        const commentData = comments.data
        if(commentData!==''){
            this.setState({comments:commentData})
        }

    }

    render() {
        const {openThread} = this.props
        const {comments} = this.state;

        return (
            <div className="threadContent" style={{padding:'5%', border:'solid 1px black', borderBottom:'none'}}>
                <div className="contentInfo" style={{display:'flex', justifyContent:'space-between', marginBottom:'3%'}}>
                    <div className="contentTitle" style={{fontSize:'20px',fontWeight:'bolder'}}> {openThread.title} </div>
                    <div className="contentWriter"> writer: {openThread.writer} </div>
                    <div className="contentRegDate"> date: {String(openThread.regdate).split('T')[0] + '  '+ String(openThread.regdate).split('T')[1].split('.')[0]} </div>
                </div>
                <div className="content" style={{fontSize:'20px'}}>
                    {openThread.content}
                </div>
                
                {/* <div className="buttons">
                    <div className="editDel" style={{display:'flex'}}>
                        <button>수정 아이디 일치시</button>
                        <button>삭제 아이디 일치시</button>
                    </div>
                    <div className="commentButton">
                        <button>리플 아이디 불일치시</button>
                    </div>
                </div> */}
                
                {comments!=='' && 
                    comments.map((cmt,i) => 
                    <Comments key={i} cmt={cmt}/>
                )}





            </div>
        )
  }
}
