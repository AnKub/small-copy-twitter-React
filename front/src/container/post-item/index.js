import './index.css';

import Box from '../../component/box';
import Grid from '../../component/grid';
import PostContent from '../../component/post-content';

import PostCreate from '../post-create';
import {Fragment, useState} from "react";
import {getDate} from '../../util/getDate';
import { LOAD_STATUS, Skeleton, Alert } from '../../component/load';


export default function Container({id, username, text, date}){
const [data, setData] = useState({id, username, text, date, reply: null,});

const [status, setStatus] = useState(null);
const [message, setMessage] = useState('');

const getData = async () => {
  setStatus(LOAD_STATUS.PROGRESS);

        try{
            const res = await fetch(`http://localhost:4000/post-item?id=${data.id}`);

            const resData = await res.json();
           
            if(res.ok){
            setData(convertData(resData));
            setStatus(LOAD_STATUS.SUCCESS);
            }else{
              setMessage(resData.massage);
              setStatus(LOAD_STATUS.ERROR);
            }
        }catch(error){
            setMessage(error.massage);
            setStatus(LOAD_STATUS.ERROR);
        }
  };

  const convertData = ({post}) => ({
      id:post.id,
      username:post.username,
      text:post.text,
      date: getDate(post.date),


    reply: post.reply.reverse().map(({id, username, text, date}) => ({
    id, 
    username,
    text,
    date: getDate(date),
   })),
   isEmpty: post.reply.length === 0,
   });


const [isOpen, setOpen] = useState(false);

const handleOpen = () => {
  if(status === null) {
  getData();
  }
setOpen(!isOpen);
};

return (
  <Box style={{padding:'0'}}>
        <div style={{
        padding:'20px',
        cursor:'pointer',
        }}
        onClick={handleOpen}
      >
        <PostContent
        username={data.username}
        date={data.date}
        text={data.text}
        />
        </div>
        {isOpen && (
          <div style={{padding:'0 20px 20px 20px'}}>
             <Grid>
               <Box>
                 <PostCreate
                 placeholder='Post your reply'
                 button='Reply'
                 id={data.id}
                 onCreate={getData}
                 />
               </Box>
               {status === LOAD_STATUS.PROGRESS && (
                <Fragment>
                  <Box>
                    <Skeleton/>
                  </Box>
                  <Box>
                    <Skeleton/>
                  </Box>
                </Fragment>                
                )}
                  {status === LOAD_STATUS.ERROR && (
                <Alert status={status} message={message}/>                
                )}
                {status === LOAD_STATUS.SUCCESS && 
                data.isEmpty === false &&
                data.reply.map((item) =>(
                <Fragment key={item.id}>
                  <Box>
                    <PostContent {...item}/>
                  </Box>
                </Fragment>
                ))}

             </Grid>
          </div>
          )}
  </Box>
  );
}