import { Button, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const CreateProducts = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

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

  const fetchSubCategories = (id) => {
    axios
      .get(
        `http://localhost:5000/api/subCategories/getSubCatgoriesOfCatgory/${id}`
      )
      .then((response) => {
        setSubCategories(response.data.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const createHandler = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("quantity", values.quantity);
      formData.append("category", values.category);
      formData.append("subcategory", values.subcategory);
      formData.append("file", values.file);
      const response = await axios.post(
        `http://localhost:5000/api/products/create`,
        formData
      );
      if (response) {
        setLoading(false);
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const createProductSchema = Yup.object().shape({
    name: Yup.string().required("Category Name required"),
    description: Yup.string().required("Description is required"),
    quantity: Yup.string().required("Quantity is required"),
    price: Yup.string().required("Price is required"),
    category: Yup.string().required("Category is required"),
    subcategory: Yup.string().required("SubCategory is required"),
    file: Yup.string().required("File is required"),
  });

  const createProductFormik = useFormik({
    initialValues: {
      name: "",
      description: "",
      quantity: "",
      price: "",
      category: "",
      subcategory: "",
      file: "",
    },

    validationSchema: createProductSchema,
    onSubmit: async (values, { setLoading }) => {
      try {
        console.log("values", values);
        const response = await createHandler(values);
        if (response.status == 200) {
          toast.success(response.data.message);
          setTimeout(() => {
            navigate("/products/list");
          }, 1000);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="container">
      <h3 className="px-5 mt-5">Create Product</h3>
      <div className="row px-5">
        <div className="col-md-12">
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Enter Product name"
            name="name"
            value={createProductFormik.values.name}
            onChange={createProductFormik.handleChange}
            onBlur={createProductFormik.handleBlur}
            helperText={
              createProductFormik.touched.name
                ? createProductFormik.errors.name
                : ""
            }
            error={
              createProductFormik.touched.name &&
              Boolean(createProductFormik.errors.name)
            }
          />
        </div>
        <div className="col-md-12">
          <TextField
            margin="normal"
            required
            fullWidth
            id="description"
            label="Enter Product discription"
            name="description"
            multiline
            rows={5}
            value={createProductFormik.values.description}
            onChange={createProductFormik.handleChange}
            onBlur={createProductFormik.handleBlur}
            helperText={
              createProductFormik.touched.description
                ? createProductFormik.errors.description
                : ""
            }
            error={
              createProductFormik.touched.description &&
              Boolean(createProductFormik.errors.description)
            }
          />
        </div>
        <div className="col-md-6">
          <TextField
            margin="normal"
            required
            fullWidth
            id="price"
            label="Enter Product price"
            name="price"
            multiline
            rows={1}
            value={createProductFormik.values.price}
            onChange={createProductFormik.handleChange}
            onBlur={createProductFormik.handleBlur}
            helperText={
              createProductFormik.touched.price
                ? createProductFormik.errors.price
                : ""
            }
            error={
              createProductFormik.touched.price &&
              Boolean(createProductFormik.errors.price)
            }
          />
        </div>
        <div className="col-md-6">
          <TextField
            margin="normal"
            required
            fullWidth
            id="quantity"
            label="Enter Product quantity"
            name="quantity"
            multiline
            rows={1}
            value={createProductFormik.values.quantity}
            onChange={createProductFormik.handleChange}
            onBlur={createProductFormik.handleBlur}
            helperText={
              createProductFormik.touched.quantity
                ? createProductFormik.errors.quantity
                : ""
            }
            error={
              createProductFormik.touched.quantity &&
              Boolean(createProductFormik.errors.quantity)
            }
          />
        </div>
        <div className="col-md-12">
          <FormControl fullWidth sx={{ marginTop: "20px" }}>
            <InputLabel id="demo-simple-select-label">
              Select Category
            </InputLabel>
            <Select
              id="category"
              name="category"
              value={createProductFormik.values.category}
              label="Select Category"
              onChange={(event) => {
                createProductFormik.setValues({
                  ...createProductFormik.values,
                  category: event.target.value,
                });
                fetchSubCategories(event.target.value);
              }}
              helperText={
                createProductFormik.touched.category
                  ? createProductFormik.errors.category
                  : ""
              }
              error={
                createProductFormik.touched.category &&
                Boolean(createProductFormik.errors.category)
              }
            >
              {categories &&
                categories.map((category) => {
                  return (
                    <MenuItem value={category._id} key={category._id}>
                      {category.name}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </div>
        {createProductFormik.touched.category &&
        createProductFormik.errors.category ? (
          <div
            className="mt-1"
            style={{ color: "#d32f2f", fontSize: "0.75rem", marginLeft: 15 }}
          >
            Category is required
          </div>
        ) : null}

        <div className="col-md-12">
          <FormControl fullWidth sx={{ marginTop: "20px" }}>
            <InputLabel id="demo-simple-select-label">
              Select Sub Category
            </InputLabel>
            <Select
              id="subcategory"
              name="subcategory"
              value={createProductFormik.values.subcategory}
              label="Select Sub Category"
              onChange={(event) => {
                createProductFormik.setValues({
                  ...createProductFormik.values,
                  subcategory: event.target.value,
                });
              }}
              helperText={
                createProductFormik.touched.subcategory
                  ? createProductFormik.errors.subcategory
                  : ""
              }
              error={
                createProductFormik.touched.subcategory &&
                Boolean(createProductFormik.errors.subcategory)
              }
            >
              {subCategories &&
                subCategories.map((subcategory) => {
                  return (
                    <MenuItem value={subcategory._id} key={subcategory._id}>
                      {subcategory.name}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </div>
        {createProductFormik.touched.subcategory &&
        createProductFormik.errors.subcategory ? (
          <div
            className="mt-1"
            style={{ color: "#d32f2f", fontSize: "0.75rem", marginLeft: 15 }}
          >
            Sub Category is required
          </div>
        ) : null}

        <Box sx={{ mt: 5 }}>
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
          >
            Upload File
            <input
              type="file"
              accept="*"
              onChange={(event) => {
                setFileName(event.currentTarget.files[0].name);
                createProductFormik.setValues({
                  ...createProductFormik.values,
                  file: event.currentTarget.files[0],
                });
              }}
              error={Boolean(
                createProductFormik.touched.file &&
                  createProductFormik.errors.file
              )}
              hidden
            />
          </Button>

          <span style={{ marginLeft: 15 }}>{fileName}</span>
        </Box>
        {createProductFormik.touched.file && createProductFormik.errors.file ? (
          <div
            className="mt-1"
            style={{ color: "#d32f2f", fontSize: "0.75rem", marginLeft: 15 }}
          >
            File is required
          </div>
        ) : null}

        <div className="col-md-12">
          <div className="d-flex justify-content-end">
            {loading ? (
              <Button
                sx={{ mt: 2 }}
                variant="contained"
                style={{ textTransform: "none" }}
              >
                <CircularProgress color="inherit" size={20} />
                Creating...
              </Button>
            ) : (
              <Button
                className="text-end"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disable={createProductFormik.isSubmitting}
                onClick={createProductFormik.handleSubmit}
              >
                Create
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProducts;
