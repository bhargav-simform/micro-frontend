declare module 'mfe-app/App' {
  const MFEApp: React.FC
  export default MFEApp
}

declare module 'mfe-app/WorkflowSubmit' {
  const WorkflowSubmit: React.FC
  export default WorkflowSubmit
}

declare module 'header-app/Header' {
  const HeaderApp: React.FC
  export default HeaderApp
}

declare module 'header-app/WorkflowReview' {
  interface WorkflowReviewProps {
    readonly submission: { submitterName: string; description: string; timestamp: number } | null
  }
  const WorkflowReview: React.FC<WorkflowReviewProps>
  export default WorkflowReview
}

declare module 'vue-mfe/bootstrap' {
  export const VUE_WIDGET_TAG: string
}
