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

const ListProducts = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [products, setProducts] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products/index")
      .then((response) => {
        setProducts(response.data.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  const handleDelete = (id, index) => {
    axios
      .delete(`http://localhost:5000/api/subCategories/delete/${id}`)
      .then((response) => {
        setProducts([
          ...products.slice(0, index),
          ...products.slice(index + 1),
        ]);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  return (
    <div className="container px-5">
      <div className="d-flex justify-content-between mt-5">
        <h3>All Products</h3>
        <Button
          variant="contained"
          onClick={() => navigate("/products/create")}
        >
          Add New Product{" "}
        </Button>
      </div>
      <TableContainer component={Paper} className="mt-2">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="centre">Description</TableCell>
              <TableCell align="centre">Category</TableCell>
              <TableCell align="centre">Sub Category</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products &&
              products.map((product, index) => (
                <TableRow
                  key={product.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {product.name}
                  </TableCell>
                  <TableCell align="centre">{product.description}</TableCell>
                  <TableCell align="centre">{product.category.name}</TableCell>
                  <TableCell align="centre">
                    {product.subcategory.name}
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/categories/detail/${product._id}`}
                      passHref={true}
                    >
                      <IconButton edge="end" aria-label="detail">
                        <DetailsIcon />
                      </IconButton>
                    </Link>

                    <Link
                      to={`/subCategories/edit/${product._id}`}
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
                      onClick={() => handleDelete(product._id, index)}
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
          count={products ? products.length : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </div>
  );
};
export default ListProducts;
