import React, { useEffect, useState } from "react";
import axios from "axios";
import UserService from "../../../../Services/UserService";
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
    imageUrl: "",
    tags: "",
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = () => {
    const token = UserService.getUser();
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
    const token = UserService.getUser();

    const tagsArray = newArticle.tags.split(",").map((tag) => tag.trim());
    const articleData = {
      ...newArticle,
      tags: tagsArray,
    };

    axios
      .post("/admin/articles", articleData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Article created successfully:", response.data);
        fetchArticles();
        setNewArticle({
          name: "",
          price: 0,
          amount: 0,
          imageUrl: "",
          tags: "",
        });
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

  const handleDeleteClick = (productId) => {
    setSelectedProductId(productId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    const token = UserService.getUser();

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
      width: 120,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleDeleteClick(params.row.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Container>
      <Layout>
        <Typography variant="h4" gutterBottom>
          Admin Panel
        </Typography>

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
        <TextField
          name="imageUrl"
          label="Image URL"
          value={newArticle.imageUrl}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
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
        >
          Create Article
        </Button>

        <div style={{ height: 400, width: "100%", marginTop: "20px" }}>
          <DataGrid
            rows={products}
            columns={columns}
            pageSize={5}
            checkboxSelection
          />
        </div>

        {/* Delete Confirmation Dialog */}
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
