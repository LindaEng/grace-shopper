import React from 'react'
import {Link} from 'react-router-dom'
import {makeNewOrder} from '../store/orders'
import {clearCart} from '../store/cart'
import {connect} from 'react-redux'

import {withStyles, makeStyles} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import MuiDialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import Grid from '@material-ui/core/Grid'

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
})

const useStyles = makeStyles(theme => ({
  emailFont: {
    fontStyle: 'italic',
    fontWeight: 400,
    fontSize: '10px'
  },
  orderFont: {
    fontWeight: 100,
    display: 'block'
  },
  orderTitles: {
    fontWeight: 800,
    fontSize: 17
  },
  orderInformation: {
    fontWeight: 400,
    fontSize: 14,
    fontStyle: 'italic'
  },
  headerContainer: {
    padding: '20px 0'
  },
  icon: {
    height: '2em',
    width: '2em'
  },
  checkout: {
    backgroundColor: '#86bb3d',
    color: '#fffff2'
  }
}))

const DialogTitle = withStyles(styles)(props => {
  const {children, classes, onClose, ...other} = props
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h4">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  )
})

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent)

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions)

const ConfirmationCheckout = props => {
  console.log('CONFORMAITION HECKEKC===', props.clearCart)
  const classes = useStyles()

  const user = props.user.name
  const userEmail = props.user.email
  const userAddress = props.user.address
  const subTotal = props.order
    .map(order => {
      return order.keyboard.price
    })
    .reduce((a, b) => a + b, 0)
  const totalCost = subTotal + subTotal * 0.087

  const order = {
    RecipientName: user,
    RecipientEmail: userEmail,
    status: 'processing',
    items: props.order,
    userId: props.user.id
  }

  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmit = () => {
    props.clearCart()
    props.createOrder(props.user.id, order)
    handleClose()
  }

  // <div class="Dialog">
  //   <h6  class="title">Order Summary</h6>
  //   <avg>Icon</avg>
  //   <p>Hooogjriege</p>
  // </div>

  return (
    <div>
      <Button
        variant="contained"
        className={classes.checkout}
        onClick={handleClickOpen}
        disableElevation
      >
        Check Out
      </Button>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <Grid className={classes.headerContainer} style={{textAlign: 'center'}}>
          <CheckCircleIcon className={classes.icon} />
          <DialogTitle
            style={{textAlign: 'center'}}
            id="customized-dialog-title"
            onClose={handleClose}
          >
            Order Summary
          </DialogTitle>
          <Typography>We've received your order</Typography>
          <Typography className={classes.emailFont}>
            A copy of your receipt has been sent to {userEmail}
          </Typography>
        </Grid>

        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Typography className={classes.orderTitles} gutterBottom>
                Delivery details:
                <Typography
                  className={classes.orderFont}
                  component="span"
                  gutterBottom
                >
                  {userAddress}
                </Typography>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                align="right"
                className={classes.orderTitles}
                gutterBottom
              >
                Payment method
                <Typography
                  className={classes.orderFont}
                  component="span"
                  gutterBottom
                >
                  Malicious Express
                </Typography>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.orderTitles} gutterBottom>
                Subtotal
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                className={classes.orderInformation}
                align="right"
                gutterBottom
              >
                ${subTotal}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography className={classes.orderTitles} gutterBottom>
                Expedited Delivery
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                className={classes.orderInformation}
                align="right"
                gutterBottom
              >
                ${parseFloat(totalCost - subTotal).toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.orderTitles} gutterBottom>
                Total:
              </Typography>
            </Grid>
            <Grid item align="right" xs={6}>
              <Typography className={classes.orderInformation} gutterBottom>
                ${totalCost}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>

        <Typography className={classes.orderFont} style={{textAlign: 'center'}}>
          Thank you for shopping with us!
        </Typography>

        <DialogActions>
          <Link to="/products">
            <Button color="secondary" autoFocus onClick={handleSubmit}>
              Continue Shopping
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </div>
  )
}

const mapDispatch = dispatch => {
  return {
    createOrder(userId, order) {
      dispatch(makeNewOrder(userId, order))
    },
    clearCart() {
      dispatch(clearCart())
    }
  }
}

export default connect(null, mapDispatch)(ConfirmationCheckout)
