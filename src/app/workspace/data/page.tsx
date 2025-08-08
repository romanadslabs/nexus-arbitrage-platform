'use client'

import React from 'react'
import UnifiedDataView from '@/components/reports/UnifiedDataView'
import { FadeIn, SlideUp } from '@/components/ui/Animations'

export default function WorkspaceDataPage() {
  return (
    <FadeIn>
      <SlideUp>
        <UnifiedDataView defaultTable="accounts" />
      </SlideUp>
    </FadeIn>
  )
} 