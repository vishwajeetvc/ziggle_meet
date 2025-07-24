import { useRef, useEffect } from "react";

function MessageBox({messages}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" , block : "end"});
  }, [messages]);

  return (
    <div 
      className={`z-50 ${messages.length ? "" : 'hidden'}  shadow-blue-300 flex flex-col gap-3 overflow-auto scrollbar-hide relative bg-black/60 p-[20px] rounded-lg`}>
      {messages.map( (message, index) => {
        const [key, value] =  Object.entries(message)[0] ;
        const time = message.time
        return <div key={key+value+index}
          className={`${key == 'me' ? 'text-right text-white/90 bg-green-900 self-end' : 'self-start text-red-100 bg-red-900 '} 
                    shadow shadow-cyan-400
                    px-5 py-2 pb-2 rounded-lg inline-block font-mono relative text-sm  `}
        >{value}
          { false && 
            <div className="relative top-[6px] text-[14px] text-white/70">{time}</div>
          }
          <div className={` w-5 h-5 absolute top-0 ${key !== 'me' ? 'left-[-10px] border-t-red-900 ':'right-[-10px] border-t-green-900' } border-10 border-l-blue-50/0 border-r-blue-50/0 border-b-blue-50/0`}></div>
        </div>
      })}
      <div className={``} ref={bottomRef}></div>
    </div>
  )
}

          //{key == "me" && <div className="w-5 h-5 absolute top-0 border-10  border-l-blue-50/0 border-r-blue-50/0 border-b-blue-50/0"></div>}
export default MessageBox
