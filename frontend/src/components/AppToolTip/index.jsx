import { Tooltip } from 'antd'
import React from 'react'

export default function AppToolTip({children, title}) {
  return (
     <Tooltip title={title || ""}>
      {children}
    </Tooltip>
  )
}
