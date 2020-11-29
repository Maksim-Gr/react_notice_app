import * as React from 'react'
import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from '@material-ui/icons/Delete'
import { IconButton } from '@material-ui/core'
import axios from 'axios';
import { DELETE_STICKER} from '../table/api'
import swal from 'sweetalert';


const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

type NoticeProps = {
  title: string;
  description: string;
  created: Date;
  noticeId: string
  getAllStickers: () => void

};
type IndexProps = {
  index: number;
};


const calcTimeDifference = (dateFuture, dateNow) => {
  let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000
  const days = Math.floor(diffInMilliSeconds / 86400)
  diffInMilliSeconds -= days * 86400
  const hours = Math.floor(diffInMilliSeconds / 3600) % 24
  diffInMilliSeconds -= hours * 3600
  const minutes = Math.floor(diffInMilliSeconds / 60) % 60
  diffInMilliSeconds -= minutes * 60
  let difference = ''
  if (days > 0) {
    difference += days === 1 ? `${days} day, ` : `${days} days, `
  }
  difference +=
    hours === 0 || hours === 1 ? `${hours} hour, ` : `${hours} hours, `
  difference +=
    minutes === 0 || hours === 1
      ? `${minutes} minutes`
      : `${minutes} minutes`
  return difference
}

const SingleRow = ({
  title,
  description,
  created,
  index,
  noticeId,
  getAllStickers
}: NoticeProps & IndexProps): JSX.Element => {
  const classes = useRowStyles();
  const deleteSticker = async (id) => {
    await axios.delete(DELETE_STICKER + id).then((response) => {
      swal("Deleted", "Sticker Has been deleted", "success")
      getAllStickers()
    }).catch((err) => {
      console.error(err)
      swal('Error', 'Somethimg went wrong', 'error')
    })
  }
  return (
    <>
      <TableRow className={classes.root}>
        <TableCell align="left">
          {index + 1}
        </TableCell>
        <TableCell align="left">{title}</TableCell>
        <TableCell align="left">{description}</TableCell>
        <TableCell align="left">{new Date(created).toDateString()}</TableCell>
        <TableCell align="left">{calcTimeDifference(new Date(created), new Date(Date.now()))} </TableCell>
        <TableCell align="right">
          <IconButton onClick={() => deleteSticker(noticeId)}>
            <DeleteIcon fontSize="small" />
          </IconButton> </TableCell>
        <TableCell />
      </TableRow>
    </>
  );
};

export default React.memo(SingleRow);
