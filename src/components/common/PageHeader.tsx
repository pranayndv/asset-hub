
export default function PageHeader({text, size="xl", underline='blue', color}:{text:string, size?:string, underline?:string, color?: string}) {
  return (
    <h1 className={`text-${size} ${color} ${underline == "none"? "underline-none":"underline"} decoration-2 underline-offset-8 decoration-${underline}-500 font-bold mb-6 capitalize`}>{text}</h1>
  )
}
