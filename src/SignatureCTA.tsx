import { Link } from 'react-router-dom'
import type { LinkProps } from 'react-router-dom'

export function SignatureCTA({className, ...props}: LinkProps) {
  return <Link {...props} className={className ? `cta-signature ${className}` : 'cta-signature'} />
}
