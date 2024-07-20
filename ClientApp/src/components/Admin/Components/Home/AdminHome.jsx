import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import {
  Container,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Layout from "../Layout/Layout";


export default function AdminHome() {
  const [products, setProducts] = useState([]);
  const [newArticle, setNewArticle] = useState({
    name: "",
    price: 0,
    amount: 0,
    tags: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [editingArticleId, setEditingArticleId] = useState(null);
  const [editingArticle, setEditingArticle] = useState({
    name: "",
    price: 0,
    amount: 0,
    tags: "",
  });

  const token = useSelector(state => state.user.token);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchArticles();
  }, [token]);

  const fetchArticles = () => {
    axios
      .get("/admin/articles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  const handleCreateArticle = () => {
    const formData = new FormData();
    formData.append("name", newArticle.name);
    formData.append("price", newArticle.price);
    formData.append("amount", newArticle.amount);
    formData.append("tags", newArticle.tags.split(",").map((tag) => tag.trim()));
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    axios
      .post("/admin/articles", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Article created successfully:", response.data);
        fetchArticles();
        setNewArticle({
          name: "",
          price: 0,
          amount: 0,
          tags: "",
        });
        setImageFile(null);
      })
      .catch((error) => {
        console.error("Error creating article:", error);
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewArticle((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    setImageFile(event.target.files[0]);
  };

  const handleDeleteClick = (productId) => {
    setSelectedProductId(productId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    axios
      .delete(`/admin/articles/${selectedProductId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Article deleted successfully:", response.data);
        fetchArticles();
        setDeleteDialogOpen(false);
      })
      .catch((error) => {
        console.error("Error deleting article:", error);
        setDeleteDialogOpen(false);
      });
  };

  const handleDeleteCancel = () => {
    setSelectedProductId(null);
    setDeleteDialogOpen(false);
  };

  const handleEditClick = (article) => {
    setEditingArticleId(article.id);
    setEditingArticle({
      name: article.name,
      price: article.price,
      amount: article.amount,
      tags: article.tags.join(", "),
    });
  };

  const handleEditArticle = () => {
    const formData = new FormData();
    formData.append("name", editingArticle.name);
    formData.append("price", editingArticle.price);
    formData.append("amount", editingArticle.amount);
    formData.append("tags", editingArticle.tags.split(",").map((tag) => tag.trim()));

    axios
      .put(`/admin/articles/${editingArticleId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Article updated successfully:", response.data);
        fetchArticles();
        setEditingArticleId(null);
        setEditingArticle({
          name: "",
          price: 0,
          amount: 0,
          tags: "",
        });
      })
      .catch((error) => {
        console.error("Error updating article:", error);
      });
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setEditingArticle((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 130 },
    { field: "price", headerName: "Price", width: 90 },
    { field: "amount", headerName: "Amount", width: 90 },
    { field: "imageUrl", headerName: "Image URL", width: 150 },
    { field: "tags", headerName: "Tags", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <div>
          <Button
            variant="outlined"
            color="primary"
            style={{ marginRight: 10 }}
            onClick={() => handleEditClick(params.row)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleDeleteClick(params.row.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Container>
      <Layout>
        <Typography variant="h4" gutterBottom>
          Admin Panel
        </Typography>

        {editingArticleId ? (
          <>
            <TextField
              name="name"
              label="Name"
              value={editingArticle.name}
              onChange={handleEditInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="price"
              label="Price"
              type="number"
              value={editingArticle.price}
              onChange={handleEditInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="amount"
              label="Amount"
              type="number"
              value={editingArticle.amount}
              onChange={handleEditInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="tags"
              label="Tags (comma-separated)"
              value={editingArticle.tags}
              onChange={handleEditInputChange}
              fullWidth
              margin="normal"
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleEditArticle}
              style={{ marginTop: 10 }}
            >
              Save Changes
            </Button>
          </>
        ) : (
          <>
            <TextField
              name="name"
              label="Name"
              value={newArticle.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="price"
              label="Price"
              type="number"
              value={newArticle.price}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="amount"
              label="Amount"
              type="number"
              value={newArticle.amount}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <input
              accept="image/*"
              type="file"
              onChange={handleImageChange}
              style={{ margin: "20px 0" }}
            />
            <TextField
              name="tags"
              label="Tags (comma-separated)"
              value={newArticle.tags}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateArticle}
              style={{ marginTop: 10 }}
            >
              Create Article
            </Button>
          </>
        )}

        <div style={{ height: 400, width: "100%", marginTop: "20px" }}>
          <DataGrid
            rows={products}
            columns={columns}
            pageSize={5}
            checkboxSelection
          />
        </div>

        <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
          <DialogTitle>Delete Article</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this article?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Layout>
    </Container>
  );
}
