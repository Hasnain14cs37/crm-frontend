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

const ListCategories = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/categories/index")
      .then((response) => {
        setCategories(response.data.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  const handleDelete = (id, index) => {
    axios
      .delete(`http://localhost:5000/api/categories/delete/${id}`)
      .then((response) => {
        setCategories([
          ...categories.slice(0, index),
          ...categories.slice(index + 1),
        ]);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  return (
    <div className="container px-5">
      <div className="d-flex justify-content-between mt-5">
        <h3>All categories</h3>
        <Button
          variant="contained"
          onClick={() => navigate("/categories/create")}
        >
          Add New Category{" "}
        </Button>
      </div>
      <TableContainer component={Paper} className="mt-2">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="centre">Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories &&
              categories.map((category, index) => (
                <TableRow
                  key={category.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {category.name}
                  </TableCell>
                  <TableCell align="centre">{category.description}</TableCell>
                  <TableCell>
                    <Link
                      to={`/categories/detail/${category._id}`}
                      passHref={true}
                    >
                      <IconButton edge="end" aria-label="detail">
                        <DetailsIcon />
                      </IconButton>
                    </Link>

                    <Link
                      to={`/categories/edit/${category._id}`}
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
                      onClick={() => handleDelete(category._id, index)}
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
          count={categories ? categories.length : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </div>
  );
};
export default ListCategories;
