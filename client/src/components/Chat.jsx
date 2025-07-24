import MessageBox from "./MessageBox"
import { SendHorizontal } from "lucide-react"

export default function Chat({ channel,allMessages, setMessage, setAllMessages, message}){

  return <div className="z-50 md:m-5 w-[100%] md:w-[400px] absolute bottom-[75px] md:bottom-0">

    <div className={``}>
       <MessageBox messages={allMessages}/>
    </div>

      <form className={`w-[95%]  font-sans flex bg-black justify-between items-center mx-2 rounded border-2 font-thin`} onSubmit={(e)=>{
        e.preventDefault();
        channel.current.send(JSON.stringify({message}));
        setAllMessages(prev => [...prev , { me : message, time : getTime() }])
        setMessage('')
      }}>
        <input 
          placeholder={"Enter your message."}
          autoFocus
          className={`outline-none px-5 w-full `}
          value={ message } onChange={ (e) => setMessage(e.target.value)}/> 
        <button 
          className={`hover:cursor-pointer hover:font-bold transition-all  py-[15px] px-[10px] relative`}
          onClick={()=> {
          }}><SendHorizontal /></button>
      </form>
  </div>
}


function getTime(){
  const time = new Date();
  const hour  = String(time.getHours()).length < 2 ? '0' + time.getHours() : time.getHours();
  const min  = String(time.getMinutes()).length < 2 ? '0' + time.getMinutes() : time.getMinutes();
  return hour + ":" + min;
}
// protocal
//let message = {
  //message : 'this is other message'
//}
//let action = {
  //'video off / audio off / call down /share screen /emoji' : true/false
//}

