import React, { Fragment } from 'react'
import { Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  txtContent: {
    paddingTop: theme.spacing.unit * 2,
  },
  step: {
    paddingLeft: theme.spacing.unit * 2,
  },
})


const Steps = (props) => {
  const { classes } = props
  let { steps } = props
  steps = steps[0].steps

  return (
          <Fragment>
            <Typography variant="h3">
              Steps
            </Typography>
          {
            Array.isArray(steps) 
            ? steps.map((steps) => (
                <Typography variant="body2" key={steps.description} >
                {steps.description}
                </Typography>
               ))
            : Object.entries(steps).map(([title, steps]) => (
                  <Fragment key={title}>
                     <Typography variant="h5" className={classes.txtContent}>
                      {title}
                    </Typography>
                   {
                    steps.map((step) => (
                        <Typography variant="body2" key={step.description} className={classes.step} gutterBottom >
                          {step.description}
                        </Typography>
                    ))
                  }
                  </Fragment>          
             ))
          }
         </Fragment>          
  )
}
  


export default withStyles(styles)(Steps)