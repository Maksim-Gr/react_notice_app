import * as React from "react";
import axios from "axios";
import swal from "sweetalert";
import { DELETE_STICKER, GET_ALL_STICKERS, POST_NEW_STICKER } from "./api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
} from "@material-ui/core";
import SingleRow from "../single-row/SingleRow";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { INPUT_TYPE } from "./constants";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      position: "absolute",
      width: "100%",
      height: "100%",
    },
    table: {
      position: "relative",
      margin: "10% auto 0",
      width: "900px",
      borderColapse: "collapse",
      overflow: "hidden",
      boxShadow: "0 0 50px rgba(0, 0, 0, 0.1)",
      backgroundColor: "red($color: #a19f9f)",
      textAlign: "center",
      border: "1px solid black",
    },
    button: {
      backgroundColor: "red($color: #a19f9f)",
    },
  })
);

interface Notice {
  title: string;
  description: string;
  created: Date;
}

const NoticeTable = () => {
  const classes = useStyles();
  const [data, setData] = React.useState<Notice[]>([]);
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [notice, setNotice] = React.useState({
    title: "",
    description: "",
  });

  const handleClose = () => {
    setShowModal(false);
  };

  const handleChangeNotice = (
    e: React.ChangeEvent<
      HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement | any
    >
  ): void => {
    if (
      [INPUT_TYPE.title, INPUT_TYPE.description]
        .map((type) => String(type))
        .includes(e.target.id)
    ) {
      setNotice({ ...notice, [e.target.id]: e.target.value as string });
    }
  };

  const getAllStickers = async () => {
    await axios
      .get(GET_ALL_STICKERS)
      .then((response) => {
        setData(response.data);
        swal("Done", "Data Sucsessfully Recieved", "success");
      })
      .catch((err) => {
        console.error(err);
        swal("Error", "Somethimg went wrong", "error");
      });
  };

  const addNewSticker = async () => {
    await axios
      .post(POST_NEW_STICKER, notice)
      .then((response) => {
        swal("Created", "New Sticker Has been Added", "success");
        handleClose();
        getAllStickers();
        setNotice({
          title: "",
          description: "",
        });
      })
      .catch((err) => {
        console.error(err);
        swal("Error", "Somethimg went wrong", "error");
      });
  };

  const deleteSticker = async (id) => {
    await axios
      .delete(DELETE_STICKER + id)
      .then((response) => {
        swal("Deleted", "Sticker Has been deleted", "success");
      })
      .catch((err) => {
        console.error(err);
        swal("Error", "Somethimg went wrong", "error");
      });
  };

  React.useEffect(() => {
    getAllStickers();
  }, []);

  return (
    <Paper className={classes.root}>
      <div>
        <Dialog open={showModal} onClose={handleClose}>
          <DialogTitle>Add New Notice</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please Enter Title and Description
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id={INPUT_TYPE.title}
              label="Title"
              type="Text"
              value={notice.title}
              onChange={handleChangeNotice}
              fullWidth
            />
            <TextField
              margin="dense"
              id={INPUT_TYPE.description}
              label="Description"
              type="text"
              value={notice.description}
              onChange={handleChangeNotice}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              variant="contained"
              className={classes.button}
            >
              Cancel
            </Button>
            <Button
              onClick={addNewSticker}
              variant="contained"
              className={classes.button}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell colSpan={7} align="center" style={{ fontSize: "30px" }}>
              Notice Tracking App
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="right">#</TableCell>
            <TableCell align="center">Title</TableCell>
            <TableCell align="center">Description</TableCell>
            <TableCell align="center">Created</TableCell>
            <TableCell align="center">Created Since</TableCell>
            <TableCell align="center">Delete</TableCell>
            <TableCell align="center">
              <Button
                variant="contained"
                className={classes.button}
                onClick={() => setShowModal(true)}
              >
                Add new notice
              </Button>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((notice, index) => (
            <SingleRow
              key={index}
              title={notice.title}
              description={notice.description}
              created={notice.created}
              index={index}
              noticeId={notice._id}
              getAllStickers={getAllStickers}
            />
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default React.memo(NoticeTable);
