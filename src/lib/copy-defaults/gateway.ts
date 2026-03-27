/**
 * Gateway copy defaults — combines Bloque 1 and Bloque 2.
 */

import type { CopySection } from './types'
import { getGatewayBloque1Defaults } from './gateway-bloque1'
import { getGatewayBloque2Defaults } from './gateway-bloque2'

export function getGatewayDefaults(): CopySection[] {
  return [
    ...getGatewayBloque1Defaults(),
    ...getGatewayBloque2Defaults(),
  ]
}
