import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  IconButton,
  TablePagination,
} from "@mui/material";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DetailsIcon from "@mui/icons-material/Details";
import DeleteIcon from "@mui/icons-material/Delete";

const ListSubCategories = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [subCategories, setSubCategories] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/subCategories/index")
      .then((response) => {
        setSubCategories(response.data.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  const handleDelete = (id, index) => {
    axios
      .delete(`http://localhost:5000/api/subCategories/delete/${id}`)
      .then((response) => {
        setSubCategories([
          ...subCategories.slice(0, index),
          ...subCategories.slice(index + 1),
        ]);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  return (
    <div className="container px-5">
      <div className="d-flex justify-content-between mt-5">
        <h3>All Sub categories</h3>
        <Button
          variant="contained"
          onClick={() => navigate("/subCategories/create")}
        >
          Add New Sub Category{" "}
        </Button>
      </div>
      <TableContainer component={Paper} className="mt-2">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="centre">Description</TableCell>
              <TableCell align="centre">Category</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subCategories &&
              subCategories.map((subCategory, index) => (
                <TableRow
                  key={subCategory.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {subCategory.name}
                  </TableCell>
                  <TableCell align="centre">
                    {subCategory.description}
                  </TableCell>
                  <TableCell align="centre">
                    {subCategory.category.name}
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/categories/detail/${subCategory._id}`}
                      passHref={true}
                    >
                      <IconButton edge="end" aria-label="detail">
                        <DetailsIcon />
                      </IconButton>
                    </Link>

                    <Link
                      to={`/subCategories/edit/${subCategory._id}`}
                      passHref={true}
                    >
                      <IconButton
                        sx={{ marginLeft: 2 }}
                        edge="end"
                        aria-label="update"
                      >
                        <EditIcon />
                      </IconButton>
                    </Link>

                    <IconButton
                      sx={{ marginLeft: 1 }}
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(subCategory._id, index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={subCategories ? subCategories.length : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </div>
  );
};
export default ListSubCategories;
