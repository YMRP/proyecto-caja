import type {navElement} from '../types/types'


export function NavElement({href, value, icon}:navElement) {
  return (
    <a className='flex items-center gap-2' href={href}>
        {icon}
        {value}
    </a>
  )
}

export default NavElement
