import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layouts";
import CreateCategory from "./pages/admin/categories/create";
import EditCategory from "./pages/admin/categories/edit";
import ListCategories from "./pages/admin/categories/index";
import Dashboard from "./pages/admin/dashboard";
import CreateSubCategory from "./pages/admin/subCategories/categories/create";
import EditSubCategory from "./pages/admin/subCategories/categories/edit";
import ListSubCategories from "./pages/admin/subCategories/categories/index";
import ListProducts from "./pages/admin/products";
import CreateProducts from "./pages/admin/products/create";
import SignIn from "./pages/signIn";
import SignUp from "./pages/signUp";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/categories/create" element={<CreateCategory />} />
          <Route path="/categories/list" element={<ListCategories />} />
          <Route path="/categories/edit/:id" element={<EditCategory />} />
          <Route path="/subCategories/create" element={<CreateSubCategory />} />
          <Route path="/subCategories/list" element={<ListSubCategories />} />
          <Route path="/subCategories/edit/:id" element={<EditSubCategory />} />
          <Route path="/products/create" element={<CreateProducts />} />
          <Route path="/products/list" element={<ListProducts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
