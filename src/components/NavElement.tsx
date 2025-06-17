import '../assets/styles/NavElement.css'
import type {navElement} from '../types/types'


export function NavElement({href, value}:navElement) {
  return (
    <a className='navElement' href={href}>
        {value}
    </a>
  )
}

export default NavElement
