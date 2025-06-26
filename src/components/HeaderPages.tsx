import '../assets/styles/HeaderPages.css'
import type { HeaderPagesProps } from '../types/types'



function HeaderPages({text} :HeaderPagesProps) {
  return (
    <div className='headerPages'>
      <h1>{text}</h1>
    </div>
  )
}

export default HeaderPages
