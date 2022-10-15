import { Button, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const CreateSubCategory = () => {
  const navigate = useNavigate();
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

  const createHandler = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("category", values.category);
      const response = await axios.post(
        `http://localhost:5000/api/subCategories/create`,
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
    category: Yup.string().required("Category is required"),
  });

  const createSubCategoryFormik = useFormik({
    initialValues: {
      name: "",
      description: "",
      category: "",
    },

    validationSchema: createSubCategorySchema,
    onSubmit: async (values, { setLoading }) => {
      try {
        console.log("values", values);
        const response = await createHandler(values);
        if (response.status == 200) {
          toast.success(response.data.message);
          setTimeout(() => {
            navigate("/subCategories/list");
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
      <h3 className="px-5 mt-5">Create Sub category</h3>
      <div className="row px-5">
        <div className="col-md-12">
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Enter Sub category name"
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
            label="Enter Sub category description"
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
              disable={createSubCategoryFormik.isSubmitting}
              onClick={createSubCategoryFormik.handleSubmit}
            >
              Create
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSubCategory;
