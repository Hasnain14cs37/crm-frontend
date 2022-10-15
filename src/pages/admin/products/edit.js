import { Button, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const EditSubCategory = () => {
  const navigate = useNavigate();
  let { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [subCategory, setSubCategory] = useState({
    name: "",
    description: "",
    category: "",
  });

  const createHandler = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("category", values.category);
      const response = await axios.put(
        `http://localhost:5000/api/subcategories/update/${id}`,
        formData
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const createSubCategorySchema = Yup.object().shape({
    name: Yup.string().required("Category Name required"),
    description: Yup.string().required("Description is required"),
    category: Yup.string().required("Cateory Required"),
  });

  const createSubCategoryFormik = useFormik({
    initialValues: subCategory,
    enableReinitialize: true,
    validationSchema: createSubCategorySchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        console.log("values", values);
        const response = await createHandler(values);
        if (response.status == 200) {
          toast.success(response.data.message);
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          setTimeout(() => {
            navigate("/subcategories/list");
          }, 1000);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/subcategories/getSingle/${id}`)
      .then((response) => {
        setSubCategory(response.data.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/categories/index`)
      .then((response) => {
        setCategories(response.data.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  return (
    <div className="container">
      <h3 className="px-5 mt-5">Update category</h3>
      <div className="row px-5">
        <div className="col-md-12">
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Enter category name"
            name="name"
            value={createSubCategoryFormik.values.name}
            onChange={createSubCategoryFormik.handleChange}
            onBlur={createSubCategoryFormik.handleBlur}
            helperText={
              createSubCategoryFormik.touched.name
                ? createSubCategoryFormik.errors.name
                : ""
            }
            error={
              createSubCategoryFormik.touched.name &&
              Boolean(createSubCategoryFormik.errors.name)
            }
          />
        </div>
        <div className="col-md-12">
          <TextField
            margin="normal"
            required
            fullWidth
            id="description"
            label="Enter category description"
            name="description"
            multiline
            rows={5}
            value={createSubCategoryFormik.values.description}
            onChange={createSubCategoryFormik.handleChange}
            onBlur={createSubCategoryFormik.handleBlur}
            helperText={
              createSubCategoryFormik.touched.description
                ? createSubCategoryFormik.errors.description
                : ""
            }
            error={
              createSubCategoryFormik.touched.description &&
              Boolean(createSubCategoryFormik.errors.description)
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
              value={createSubCategoryFormik.values.category}
              label="Select Category"
              onChange={createSubCategoryFormik.handleChange("category")}
              helperText={
                createSubCategoryFormik.touched.category
                  ? createSubCategoryFormik.errors.category
                  : ""
              }
              error={
                createSubCategoryFormik.touched.category &&
                Boolean(createSubCategoryFormik.errors.category)
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
        {createSubCategoryFormik.touched.category &&
        createSubCategoryFormik.errors.category ? (
          <div
            className="mt-1"
            style={{ color: "#d32f2f", fontSize: "0.75rem", marginLeft: 15 }}
          >
            Category is required
          </div>
        ) : null}
        <div className="col-md-12">
          <div className="d-flex justify-content-end">
            <Button
              className="text-end"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={createSubCategoryFormik.handleSubmit}
              disabled={createSubCategoryFormik.isSubmitting}
            >
              update
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSubCategory;
