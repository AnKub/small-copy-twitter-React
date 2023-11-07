import './index.css';

import Title from '../../component/title';
import Grid from '../../component/grid';
import Box from '../../component/box';
import PostCreate from '../post-create';
import PostItem from '../post-item';

import {useState, Fragment} from 'react';
import { Alert, Skeleton, LOAD_STATUS } from '../../component/load';
import {getDate} from '../../util/getDate';

export default function Container() {
    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState('');
    const [data, setData] = useState(null);


  const getData = async() =>{
       setStatus(LOAD_STATUS.PROGRESS);
       try{
        const res = await fetch('http://localhost:4000/post-list', {
             method:'GET'
        });
 
       const data = await res.json();
       if(res.ok){
      setData(convertData(data));
      setStatus(LOAD_STATUS.SUCCESS);
      }else{
      setMessage(data.message);
      setStatus(LOAD_STATUS.ERROR);
      }
      }catch (error){
      setMessage(error.message);
      setStatus(LOAD_STATUS.ERROR)
      }
  };

  const convertData = (raw) => ({
   list: raw.list.reverse().map(({id, username, text, date}) => ({
   id, 
   username,
   text,
   date: getDate(date),
  })),
  isEmpty: raw.list.length === 0,
  })
 if (status === null) {
 getData();
}

return(
  <Grid>
    <Box>
      <Grid>
        <Title>Home</Title>
        <PostCreate 
        onCreate={getData}
        placeholder="What is happening?"
        button="Post"        
        />
      </Grid>
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
    {status === LOAD_STATUS.SUCCESS && (
      <Fragment>
        {data.isEmpty ? (
        <Alert maessage='List with posts is empty'/>
        ):(
        data.list.map((item) => (
          <Fragment key={item.id}>
            <PostItem {...item}/>
          </Fragment>
          ))
        )}
      </Fragment>      
      )}
  </Grid>
  );
}