import type { HeaderPagesProps } from '../types/types'



function HeaderPages({text} :HeaderPagesProps) {
  return (
    <div className=' text-3xl text-center'>
      <h1>{text}</h1>
    </div>
  )
}

export default HeaderPages
