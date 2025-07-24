import { useState } from "react"

function ButtonIcon({icon, onclick, offIcon}) {

  const [isActive, setIsActive] = useState(true);

  const handleClick = () =>{
    setIsActive(!isActive);
  }

  return (
    <button 
      onClick={ ()=>{
        handleClick();
        onclick();
      }}
      className={` px-[20px] py-[15px] bg-black/30 rounded-2xl border-2 hover:cursor-pointer` }>
      { isActive ? icon : offIcon || icon }
    </button>
  )
}

export default ButtonIcon
