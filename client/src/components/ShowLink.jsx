import { ClipboardCopy } from "lucide-react";
import { useState } from "react"

function ShowLink({link, onclick}) {
  const [show, setShow] = useState(true);


  const handleClick = async () => {
    await navigator.clipboard.writeText(link);
    onclick();
    setShow(false)
  }

  if(!show) return <></>

  return (
    <div className={`absolute top-[20px] md:top-[100px] w-full md:w-auto py-2 md:px-5 md:right-[100px] z-100  rounded-full bg-black/70 border-2 flex items-center animate-bounce hover:animate-none`}>
      <p className="md:p-[25px_40px] px-4 text-sm md:text-lg  rounded-l-full">{link}</p>
      <button className={` border text-cyan p-[5px] mx-1 hover:cursor-pointer rounded-full`} onClick={handleClick}><ClipboardCopy /></button>
    </div>
  )
}

export default ShowLink
