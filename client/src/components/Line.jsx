export default function Line({ deg, t, l ,r}){
  return <span 
    style={{
      top:t+'px',
      left:l+'px',
      right:r+'px',
      transform : `rotate(${deg}deg)`,
      transition:'all 2s ease-in-out'
    }}
    className={`animate-pulse hidden absolute md:block w-[2900px] h-[2px] bg-cyan-400 transition-all ease-linear`}></span>
}
