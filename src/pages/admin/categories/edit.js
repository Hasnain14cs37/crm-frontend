import { Button, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const EditCategory = () => {
  const navigate = useNavigate();
  let { id } = useParams();
  const [category, setCategory] = useState({
    name: "",
    description: "",
  });

  const createHandler = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      const response = await axios.put(
        `http://localhost:5000/api/categories/update/${id}`,
        formData
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const createSchema = Yup.object().shape({
    name: Yup.string().required("Category Name required"),

    description: Yup.string().required("Description is required"),
  });

  const createFormik = useFormik({
    initialValues: category,
    enableReinitialize: true,
    validationSchema: createSchema,
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
            navigate("/categories/list");
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
      .get(`http://localhost:5000/api/categories/getSingle/${id}`)
      .then((response) => {
        setCategory(response.data.data);
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
            value={createFormik.values.name}
            onChange={createFormik.handleChange}
            onBlur={createFormik.handleBlur}
            helperText={
              createFormik.touched.name ? createFormik.errors.name : ""
            }
            error={
              createFormik.touched.name && Boolean(createFormik.errors.name)
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
            value={createFormik.values.description}
            onChange={createFormik.handleChange}
            onBlur={createFormik.handleBlur}
            helperText={
              createFormik.touched.description
                ? createFormik.errors.description
                : ""
            }
            error={
              createFormik.touched.description &&
              Boolean(createFormik.errors.description)
            }
          />
        </div>
        <div className="col-md-12">
          <div className="d-flex justify-content-end">
            <Button
              className="text-end"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={createFormik.handleSubmit}
              disabled={createFormik.isSubmitting}
            >
              update
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCategory;
